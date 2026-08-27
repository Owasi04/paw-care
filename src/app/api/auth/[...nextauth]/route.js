import { dbConnect } from "@/app/lib/dbConnect";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

// Next.js 16: route handlers must explicitly opt into the Node.js runtime
// and dynamic rendering, otherwise the catch-all auth route can be
// statically optimized / not registered, returning an HTML 404 page
// instead of JSON (which triggers CLIENT_FETCH_ERROR in next-auth).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const authOptions = {
  // Configure one or more authentication providers
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  providers: [
    CredentialsProvider({
      //"Sign in with..{name} button
      name: "Credentials",
      //   Inputs
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const usersCollection = await dbConnect("users");
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return null;
        }
        const passwordOk = await bcrypt.compare(password, user.password);
        if (passwordOk) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.photoURL || user.image || null,
            role: user.role || "user",
          };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000, // increase to 10 seconds
      },
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: "/auth/login",
    register: "/auth/register",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const usersCollection = await dbConnect("users");
        let existingUser = await usersCollection.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = {
            name: user.name || "Unknown",
            email: user.email,
            role: user.role || "user",
            photoURL: user.image || user.photoURL || null,
            createdAt: new Date().toISOString(),
          };
          const result = await usersCollection.insertOne(newUser);
          existingUser = { ...newUser, _id: result.insertedId };
        }

        token.id = existingUser._id.toString();
        token.email = user.email;
        token.name = user.name || existingUser.name;
        token.photoURL =
          user.image || user.photoURL || existingUser.photoURL || null;
        token.role = user.role || existingUser.role || "user";
        // Links a vet login to its `vet` collection profile.
        token.vetID = existingUser.vetID ?? null;
      } else if (token.email) {
        const usersCollection = await dbConnect("users");
        const dbUser = await usersCollection.findOne({ email: token.email });
        if (dbUser) {
          token.photoURL = dbUser.photoURL || token.photoURL || null;
          token.role = dbUser.role || token.role || "user";
          // Re-read on refresh so an account linked after sign-in picks up its
          // vetID without the vet having to log out and back in.
          token.vetID = dbUser.vetID ?? null;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.photoURL;
        session.user.photoURL = token.photoURL;
        session.user.role = token.role || "user";
        session.user.vetID = token.vetID ?? null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
