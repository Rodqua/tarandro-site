import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Configuration des options NextAuth
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Hash en dur pour éviter les problèmes avec les $ dans .env
        const HASH_HARDCODED =
          "$2b$10$bL66BZzo47HtsZvMy6zEL.mCOzH2yId69BGa.BlP8MyOp/KUZkd4e";

        const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
        // Utiliser le hash du .env seulement s'il est complet (> 50 caractères)
        const envHash = process.env.ADMIN_PASSWORD_HASH || "";
        const ADMIN_PASSWORD_HASH =
          envHash.length > 50 ? envHash : HASH_HARDCODED;

        console.log("=== DEBUG AUTH ===");
        console.log("Username reçu:", credentials?.username);
        console.log("ADMIN_USERNAME:", ADMIN_USERNAME);
        console.log("Hash length:", ADMIN_PASSWORD_HASH?.length);
        console.log("Hash source:", envHash.length > 50 ? "ENV" : "HARDCODED");

        if (!credentials?.username || !credentials?.password) {
          console.log("❌ Credentials manquants");
          return null;
        }

        // Vérifier le nom d'utilisateur
        if (credentials.username === ADMIN_USERNAME) {
          console.log("✓ Username correct, test du password...");
          // Comparaison avec le hash en production
          const isValid = await bcrypt.compare(
            credentials.password,
            ADMIN_PASSWORD_HASH
          );
          console.log("✓ Résultat bcrypt.compare:", isValid);
          if (isValid) {
            console.log("✅ Authentification réussie !");
            return {
              id: "1",
              name: "Admin",
              email: "admin@tarandro.org",
            };
          } else {
            console.log("❌ Password incorrect");
          }
        } else {
          console.log("❌ Username incorrect");
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
