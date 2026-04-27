import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
        }

        // Check if email is already taken by another user
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser && existingUser.id !== session.user.id) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { name, email }
        });

        return NextResponse.json({ 
            message: "Profile updated successfully",
            user: {
                name: updatedUser.name,
                email: updatedUser.email
            }
        });

    } catch (e) {
        console.error("Profile update error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
