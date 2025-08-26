import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { EntryModel } from "../../../../../backend/models/Schema";
import connectDB from "../../../../../backend/connectdb";
import { NextRequest } from "next/server";

// Internal options (do NOT export)
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
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
    },
  },
};

// App Router-compatible wrapper
const handler = (req: NextRequest) => NextAuth(authOptions)(req);

// ONLY export GET and POST
export { handler as GET, handler as POST };
