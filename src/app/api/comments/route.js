import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });

    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            include: { user: { select: { name: true, email: true } } }
        });
        
        // Format to match client
        const formatted = comments.map(c => ({
            id: c.id,
            text: c.text,
            author: c.user?.name || (c.user?.email ? c.user.email.split('@')[0] : c.author),
            date: c.createdAt.toLocaleDateString()
        }));
        
        return NextResponse.json(formatted);
    } catch (error) {
        console.error("GET comments error", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId, text } = await request.json();
    if (!postId || !text) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    try {
        const newComment = await prisma.comment.create({
            data: {
                postId,
                text: text.substring(0, 1000), // sanitize max length
                userId: session.user.id
            },
            include: { user: { select: { name: true, email: true } } }
        });
        
        const formatted = {
            id: newComment.id,
            text: newComment.text,
            author: newComment.user?.name || (newComment.user?.email ? newComment.user.email.split('@')[0] : newComment.author),
            date: newComment.createdAt.toLocaleDateString()
        };
        
        return NextResponse.json({ success: true, comment: formatted });
    } catch (error) {
        console.error("POST comment error", error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
