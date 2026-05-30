import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
    try {
        const { path } = await req.json();
        const session = await getServerSession(authOptions);
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
        const userAgent = req.headers.get("user-agent") || "";

        // Log page view in AuditLog securely
        await prisma.auditLog.create({
            data: {
                userId: session?.user?.id || null,
                action: "PAGE_VIEW",
                details: path || "/",
                ipAddress: ip,
                userAgent: userAgent
            }
        });

        // Also track LOGIN state specifically if they just hit the dashboard and we haven't logged it in this session context
        if (session && path === "/dashboard") {
            const lastLoginLog = await prisma.auditLog.findFirst({
                where: {
                    userId: session.user.id,
                    action: "LOGIN",
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 60 * 1000) // within last 30 minutes
                    }
                }
            });

            if (!lastLoginLog) {
                await prisma.auditLog.create({
                    data: {
                        userId: session.user.id,
                        action: "LOGIN",
                        details: `Web session active for ${session.user.email}`,
                        ipAddress: ip,
                        userAgent: userAgent
                    }
                });
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        console.error("Tracking error:", e);
        return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
    }
}
