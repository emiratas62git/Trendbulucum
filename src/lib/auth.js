import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { isDisposableEmail, checkRegistrationLimit, logAudit } from "./security";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Email and Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required.");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error("No user found with this email.");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Incorrect password.");
                }

                return user;
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const userEmail = user.email;
            
            // 1. Block disposable emails for NEW users
            const isNewUser = !user.id; // If no ID, NextAuth is about to create one
            
            if (isNewUser) {
                if (isDisposableEmail(userEmail)) {
                    throw new Error("Disposable email addresses are not allowed.");
                }

                // 2. Check IP registration limit
                // Note: Getting IP in NextAuth callback requires some workaround or middleware
                // For now, we assume IP is passed if possible, or we check in a registration route
            }

            return true;
        },
        async session({ session, token, user }) {
            if (session.user) {
                session.user.id = user.id;
                session.user.role = user.role;
                
                // Get subscription status
                const subscription = await prisma.subscription.findFirst({
                    where: { userId: user.id, status: 'active' }
                });
                session.user.isPremium = !!subscription;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    session: {
        strategy: "database",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
