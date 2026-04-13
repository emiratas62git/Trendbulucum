import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isDisposableEmail, checkRegistrationLimit, logAudit } from "@/lib/security";

export async function POST(req) {
    try {
        const { email, password, name } = await req.json();
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

        if (!email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Security Check: Disposable Email
        if (isDisposableEmail(email)) {
            return NextResponse.json({ error: "Disposable email addresses are not allowed." }, { status: 400 });
        }

        // 2. Security Check: IP Limit (Max 2 per 24h)
        const canRegister = await checkRegistrationLimit(ip);
        if (!canRegister) {
            return NextResponse.json({ 
                error: "Too many accounts created from this IP. Please try again tomorrow." 
            }, { status: 429 });
        }

        // 3. Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // 4. Create User
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                lastIp: ip,
                role: "USER"
            }
        });

        // 5. Audit Log
        await logAudit(user.id, "REGISTER", ip, { email });

        return NextResponse.json({ success: true, userId: user.id }, { status: 201 });

    } catch (e) {
        console.error("Registration error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
