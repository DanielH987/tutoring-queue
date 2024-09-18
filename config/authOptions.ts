import { Session } from 'next-auth'; // Import types from NextAuth
import { JWT } from 'next-auth/jwt'; // Import JWT from next-auth/jwt
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { UserType } from '@/app/types';

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
    strategy: 'jwt' as const, // Make sure TypeScript treats this as a literal type
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.sub ?? '';
      session.user.email = token.email ?? '';
      session.user.role = token.role as string;
      return session;
    },
    async jwt({ token, user, account }: { token: JWT; user?: UserType | any; account?: any }) {
      // Check if `user` is available and if it has the necessary fields
      if (user && 'id' in user && 'email' in user && 'role' in user) {
        token.sub = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
