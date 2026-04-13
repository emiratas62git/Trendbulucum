import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-signature");
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        // 1. Verify Signature
        const hmac = crypto.createHmac("sha256", secret);
        const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
        const signatureBuffer = Buffer.from(signature, "utf8");

        if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const data = JSON.parse(rawBody);
        const eventName = data.meta.event_name;
        const attributes = data.data.attributes;
        const customData = data.meta.custom_data;

        const userId = customData?.userId;
        if (!userId) {
            console.error("Webhook missing userId:", data);
            return NextResponse.json({ success: true }); // Still return 200 to acknowledge
        }

        // 2. Handle Events
        switch (eventName) {
            case "subscription_created":
            case "subscription_updated":
                await prisma.subscription.upsert({
                    where: { lemonSqueezyId: data.data.id.toString() },
                    update: {
                        status: attributes.status,
                        currentPeriodEnd: new Date(attributes.renews_at || attributes.ends_at),
                        cancelAtPeriodEnd: attributes.cancelled,
                        planId: customData.plan
                    },
                    create: {
                        userId: userId,
                        lemonSqueezyId: data.data.id.toString(),
                        status: attributes.status,
                        currentPeriodEnd: new Date(attributes.renews_at || attributes.ends_at),
                        cancelAtPeriodEnd: attributes.cancelled,
                        planId: customData.plan
                    }
                });
                break;

            case "subscription_cancelled":
            case "subscription_expired":
                await prisma.subscription.update({
                    where: { lemonSqueezyId: data.data.id.toString() },
                    data: {
                        status: attributes.status,
                        cancelAtPeriodEnd: true
                    }
                });
                break;

            case "order_created":
                // Handle one-time purchases (AI Reports)
                if (customData.type === 'REPORT') {
                    await prisma.purchase.create({
                        data: {
                            userId: userId,
                            type: 'REPORT',
                            itemId: customData.reportId,
                            amount: attributes.total / 100,
                            currency: attributes.currency,
                            invoiceUrl: attributes.urls.receipt,
                            lemonSqueezyId: data.data.id.toString()
                        }
                    });
                }
                break;

            default:
                console.log(`Unhandled event: ${eventName}`);
        }

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error("Webhook error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
