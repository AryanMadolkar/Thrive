import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { Provider } from "next-auth/providers";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations";

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const user = await db.user.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
      });
      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(
        parsed.data.password,
        user.passwordHash
      );
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        username: user.username,
      };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
    newUser: "/discover",
  },
  providers,
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id;
        token.username =
          (user as { username?: string }).username ?? token.username;
      }

      // Google users may not have a username yet — ensure one exists.
      if (account?.provider === "google" && token.email && !token.username) {
        const existing = await db.user.findUnique({
          where: { email: token.email as string },
        });
        if (existing) {
          token.id = existing.id;
          token.username = existing.username;
          if (!existing.username) {
            const base =
              (existing.name || "user")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "")
                .slice(0, 16) || "user";
            let username = base;
            let n = 0;
            while (await db.user.findUnique({ where: { username } })) {
              n += 1;
              username = `${base}${n}`;
            }
            await db.user.update({
              where: { id: existing.id },
              data: { username },
            });
            token.username = username;
          }
        }
      }

      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.picture = session.image ?? token.picture;
        token.username = session.username ?? token.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = (token.username as string) || "";
        session.user.image = (token.picture as string) ?? session.user.image;
      }
      return session;
    },
  },
});
