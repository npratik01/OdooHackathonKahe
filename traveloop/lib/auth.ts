import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import { LoginSchema } from "@/lib/validations/auth";

export const authOptions: AuthOptions = {
  // ── Adapter ─────────────────────────────────────────────────────────────────
  // Using the Prisma adapter for OAuth account linking, but credentials login
  // bypasses it and creates/reads users directly so that password hashes remain
  // in our own User model.
  adapter: PrismaAdapter(prisma) as AuthOptions["adapter"],

  // ── Providers ────────────────────────────────────────────────────────────────
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validate shape
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 2. Look up user
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user || !user.passwordHash) return null;

        // 3. Verify password
        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  // ── Session Strategy ─────────────────────────────────────────────────────────
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ── JWT ───────────────────────────────────────────────────────────────────────
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  // ── Callbacks ─────────────────────────────────────────────────────────────────
  callbacks: {
    /**
     * Persist user id and role in the JWT token on sign-in.
     */
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: Role }).role;
      }

      // Handle session updates (e.g. role changes)
      if (trigger === "update" && session) {
        token.role = session.user?.role ?? token.role;
      }

      // On every token refresh, re-read the DB role to stay consistent
      if (!user && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }

      return token;
    },

    /**
     * Expose id and role on the client-side session object.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  // ── Pages ─────────────────────────────────────────────────────────────────────
  pages: {
    signIn: "/login",
    error: "/error",
    newUser: "/register",
  },

  // ── Events ────────────────────────────────────────────────────────────────────
  events: {
    /**
     * When a new OAuth user is created, ensure the role is set to USER.
     * (Prisma adapter default is correct but this makes intent explicit.)
     */
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: Role.USER },
      });
    },
  },

  // ── Debug ─────────────────────────────────────────────────────────────────────
  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET,
};
