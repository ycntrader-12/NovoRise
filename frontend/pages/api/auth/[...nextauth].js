import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax', // Requis pour le retour du flux OAuth Google (cross-origin redirection)
        path: '/',
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        if (!profile.email_verified) return false; 
        return true;
      }
      return false;
    },
  },
  logger: {
    error(code, metadata) {
      console.error(`[SECURE_LOG - AUTH_ERROR] ${code}:`, metadata);
    },
  },
};

export default NextAuth(authOptions);
