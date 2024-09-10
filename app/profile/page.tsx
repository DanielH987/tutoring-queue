import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  console.log('Session:', session); // Check the session

  if (!session) {
    redirect('/');
  }

  return <div>Protected content for {session.user?.email}</div>;
}
