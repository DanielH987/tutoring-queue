import NextAuth from 'next-auth';
import { authOptions } from '@/config/authOptions';

// Create a custom handler for NextAuth to work with the new Next.js app router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
