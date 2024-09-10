import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prisma/client';

const Queue = async () => {
  // Await the session data from NextAuth using getServerSession
  const session = await getServerSession(authOptions);

  console.log('Session:', session); // Check the session

  // If there is no session, redirect the user to the home page
  if (!session) {
    redirect('/'); // Use server-side redirection
  }

  // Fetch all the current requests from the database using Prisma
  const requests = await prisma.request.findMany();

  return (
    <div className="p-6 text-left max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4 mt-4">Queue of Current Requests</h1>

      {/* Check if there are any requests */}
      {requests.length > 0 ? (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <p><strong>Name:</strong> {request.name}</p>
              <p><strong>Course:</strong> {request.course}</p>
              <p><strong>Question:</strong> {request.question}</p>
              <p><strong>Submitted at:</strong> {new Date(request.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No requests are currently in the queue.</p>
      )}
    </div>
  );
}

export default Queue;
