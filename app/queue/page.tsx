import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const Queue = async () => {
  // Await the session data from NextAuth using getServerSession
  const session = await getServerSession(authOptions);

  console.log('Session:', session); // Check the session

  // If there is no session, redirect the user to the home page
  if (!session) {
    redirect('/'); // Use server-side redirection
  }

  // Return the protected content if the user is logged in
  return (
    <div>
      Protected content for Queue page
    </div>
  );
}

export default Queue;
