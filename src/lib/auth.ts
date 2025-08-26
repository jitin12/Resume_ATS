// src/lib/auth.ts
import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "../../backend/connectdb";
import { EntryModel } from "../../backend/models/Schema";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: User }) {
      try {
        await connectDB();

        const existing = await EntryModel.findOne({ email: user.email });
        if (!existing) {
          await EntryModel.create({
            userid: user.id,
            name: user.name,
            email: user.email,
          });
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async session({ session, user }) {
      // Optional: add custom fields to session
      return session;
    },
  },
};
