import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { planId } = await req.json();
        
        // Map plan names to your Lemon Squeezy Variant IDs (Must be set in .env)
        const VARIANTS = {
            'Monthly Pro': process.env.LS_MONTHLY_VARIANT_ID,
            '3-Month Growth': process.env.LS_QUARTERLY_VARIANT_ID,
            'Annual Mastery': process.env.LS_YEARLY_VARIANT_ID,
        };

        const variantId = VARIANTS[planId];
        if (!variantId) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // Create Lemon Squeezy Checkout
        const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
            method: "POST",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
            },
            body: JSON.stringify({
                data: {
                    type: "checkouts",
                    attributes: {
                        checkout_data: {
                            email: session.user.email,
                            name: session.user.name,
                            custom: {
                                userId: session.user.id,
                                plan: planId
                            },
                        },
                        product_options: {
                            redirect_url: `${process.env.NEXTAUTH_URL}/dashboard`,
                        },
                    },
                    relationships: {
                        store: {
                            data: { type: "stores", id: process.env.LS_STORE_ID },
                        },
                        variant: {
                            data: { type: "variants", id: variantId },
                        },
                    },
                },
            }),
        });

        const checkout = await response.json();
        
        if (checkout.errors) {
            console.error("LS Checkout Error:", checkout.errors);
            return NextResponse.json({ error: "Billing service error" }, { status: 500 });
        }

        return NextResponse.json({ url: checkout.data.attributes.url });

    } catch (e) {
        console.error("Checkout route error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
