import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-signature");
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        // 1. Guard: secret and signature must both be present
        if (!secret) {
            console.error("WEBHOOK ERROR: LEMONSQUEEZY_WEBHOOK_SECRET is not set.");
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }
        if (!signature) {
            console.error("WEBHOOK ERROR: Missing x-signature header.");
            return NextResponse.json({ error: "Missing signature" }, { status: 401 });
        }

        // 2. Verify HMAC-SHA256 signature (constant-time comparison)
        const hmac = crypto.createHmac("sha256", secret);
        const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
        const signatureBuffer = Buffer.from(signature, "utf8");

        if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
            console.error("WEBHOOK ERROR: Invalid signature. Rejected.");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const data = JSON.parse(rawBody);
        const eventName = data.meta?.event_name;
        const attributes = data.data?.attributes;
        const customData = data.meta?.custom_data;
        const lsId = data.data?.id?.toString();

        console.log(`WEBHOOK: Received event '${eventName}' for LS ID: ${lsId}`);

        // 3. Require userId in custom_data for user-linked operations
        const userId = customData?.userId;

        // 4. Handle Events
        switch (eventName) {

            // --- SUBSCRIPTION EVENTS ---
            case "subscription_created":
            case "subscription_updated": {
                if (!userId) {
                    console.error(`WEBHOOK WARNING: ${eventName} missing userId. LS ID: ${lsId}`);
                    // Still acknowledge so LS doesn't retry; log for investigation
                    return NextResponse.json({ success: true, warning: "missing_userId" });
                }

                const periodEnd = attributes.renews_at || attributes.trial_ends_at || attributes.ends_at || null;

                // Upsert subscription (idempotent by lemonSqueezyId)
                await prisma.subscription.upsert({
                    where: { lemonSqueezyId: lsId },
                    update: {
                        status: attributes.status,
                        currentPeriodEnd: periodEnd ? new Date(periodEnd) : null,
                        cancelAtPeriodEnd: attributes.cancelled ?? false,
                        planId: customData?.plan ?? null,
                    },
                    create: {
                        userId: userId,
                        lemonSqueezyId: lsId,
                        status: attributes.status,
                        currentPeriodEnd: periodEnd ? new Date(periodEnd) : null,
                        cancelAtPeriodEnd: attributes.cancelled ?? false,
                        planId: customData?.plan ?? null,
                    },
                });

                console.log(`WEBHOOK OK: ${eventName} — userId: ${userId}, status: ${attributes.status}`);
                break;
            }

            case "subscription_cancelled":
            case "subscription_expired":
            case "subscription_paused": {
                // Update without requiring userId — lsId is sufficient to identify
                const existing = await prisma.subscription.findUnique({
                    where: { lemonSqueezyId: lsId },
                });
                if (!existing) {
                    console.error(`WEBHOOK WARNING: ${eventName} — No subscription found for LS ID: ${lsId}`);
                    return NextResponse.json({ success: true, warning: "subscription_not_found" });
                }
                await prisma.subscription.update({
                    where: { lemonSqueezyId: lsId },
                    data: {
                        status: attributes.status,
                        cancelAtPeriodEnd: eventName === "subscription_cancelled",
                    },
                });
                console.log(`WEBHOOK OK: ${eventName} — LS ID: ${lsId}, status: ${attributes.status}`);
                break;
            }

            case "subscription_resumed":
            case "subscription_unpaused": {
                const existing = await prisma.subscription.findUnique({
                    where: { lemonSqueezyId: lsId },
                });
                if (!existing) {
                    console.error(`WEBHOOK WARNING: ${eventName} — No subscription found for LS ID: ${lsId}`);
                    return NextResponse.json({ success: true, warning: "subscription_not_found" });
                }
                const periodEnd = attributes.renews_at || attributes.ends_at || null;
                await prisma.subscription.update({
                    where: { lemonSqueezyId: lsId },
                    data: {
                        status: attributes.status,
                        cancelAtPeriodEnd: false,
                        currentPeriodEnd: periodEnd ? new Date(periodEnd) : undefined,
                    },
                });
                console.log(`WEBHOOK OK: ${eventName} — LS ID: ${lsId}, status: ${attributes.status}`);
                break;
            }

            // --- ORDER EVENTS ---
            case "order_created": {
                if (!userId) {
                    console.error(`WEBHOOK WARNING: order_created missing userId. Order LS ID: ${lsId}`);
                    return NextResponse.json({ success: true, warning: "missing_userId" });
                }

                // Idempotency: check if this order was already recorded
                const existingPurchase = await prisma.purchase.findUnique({
                    where: { lemonSqueezyId: lsId },
                });

                if (existingPurchase) {
                    console.log(`WEBHOOK IDEMPOTENT: order_created already processed for LS ID: ${lsId}`);
                    return NextResponse.json({ success: true });
                }

                // Only record completed/paid orders
                const orderStatus = attributes.status; // 'paid', 'pending', 'refunded', 'voided'
                if (orderStatus !== "paid") {
                    console.log(`WEBHOOK SKIP: order_created with status '${orderStatus}' — not recording as sale. LS ID: ${lsId}`);
                    return NextResponse.json({ success: true });
                }

                const purchaseType = customData?.type || "SUBSCRIPTION";

                await prisma.purchase.create({
                    data: {
                        userId: userId,
                        type: purchaseType,
                        itemId: customData?.plan ?? customData?.reportId ?? null,
                        amount: (attributes.total ?? 0) / 100,
                        currency: attributes.currency ?? "USD",
                        invoiceUrl: attributes.urls?.receipt ?? null,
                        lemonSqueezyId: lsId,
                    },
                });

                console.log(`WEBHOOK OK: order_created — userId: ${userId}, amount: ${attributes.total / 100} ${attributes.currency}, type: ${purchaseType}`);
                break;
            }

            case "order_refunded": {
                // Mark existing purchase as refunded (update amount to 0 or negate)
                const existing = await prisma.purchase.findUnique({
                    where: { lemonSqueezyId: lsId },
                });
                if (existing) {
                    // Set amount to 0 to reflect refund in revenue calculations
                    await prisma.purchase.update({
                        where: { lemonSqueezyId: lsId },
                        data: { amount: 0, type: "REFUNDED" },
                    });
                    console.log(`WEBHOOK OK: order_refunded — LS ID: ${lsId}`);
                } else {
                    console.error(`WEBHOOK WARNING: order_refunded — No purchase found for LS ID: ${lsId}`);
                }
                break;
            }

            default:
                console.log(`WEBHOOK: Unhandled event '${eventName}' — LS ID: ${lsId}`);
        }

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error("WEBHOOK CRITICAL ERROR:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
