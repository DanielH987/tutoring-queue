import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null; // Return null if no credentials provided
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null; // Return null if the user doesn't exist
        }

        // Check if the user's status is approved
        if (user.status === 'PENDING') {
          throw new Error('Your account is pending approval');
        }

        if (user.status === 'REJECTED') {
          throw new Error('Your account has been rejected');
        }

        if (user.status === 'SUSPENDED') {
          throw new Error('Your account has been suspended');
        }

        // Compare the password using bcrypt
        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Incorrect password');
        }

        // Return the user object if everything is valid
        return user;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',  // Redirect here if login fails
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      // Attach the user's id, email, and role to the session object
      session.user.id = token.sub;
      session.user.email = token.email;
      session.user.role = token.role;  // Include the role in the session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.role = user.role;  // Include the role in the token
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
