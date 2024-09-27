import { Session } from 'next-auth'; // Import types from NextAuth
import { JWT } from 'next-auth/jwt'; // Import JWT from next-auth/jwt
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { UserType } from '@/app/types';
import jwt from 'jsonwebtoken'; // Import jwt from jsonwebtoken

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null; // Return null if no credentials provided
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null; // Return null if the user doesn't exist
        }

        if (user.status === 'PENDING') {
          throw new Error('Your account is pending approval');
        }

        if (user.status === 'REJECTED') {
          throw new Error('Your account has been rejected');
        }

        if (user.status === 'SUSPENDED') {
          throw new Error('Your account has been suspended');
        }

        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Incorrect password');
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt' as const, // Ensure JWT strategy
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add the accessToken to the session object
      session.user.id = token.sub ?? '';
      session.user.email = token.email ?? '';
      session.user.role = token.role as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: UserType | any }) {
      // Log the user object when it's available (during login)
      if (user) {
    
        // Set user info on the token
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
    
        // Generate and set the accessToken
        token.accessToken = jwt.sign(
          { userId: user.id, role: user.role },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: '1h' }
        );
      }
      return token;
    },    
  },
  secret: process.env.NEXTAUTH_SECRET, // Set secret for JWT
};
