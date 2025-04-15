import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@/lib/firebase/init";
import { signInWithEmailAndPassword } from "firebase/auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          if (userCredential.user) {
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
            };
          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
