'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Use useSession hook for client-side session
import { useRouter } from 'next/navigation'; // Use useRouter for client-side navigation

const AdminApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const { data: session, status } = useSession(); // Get session data from NextAuth
  const router = useRouter(); // To redirect the user

  useEffect(() => {

    console.log('Session:', session);

    // If session is still loading, do nothing
    if (status === 'loading') return;

    // If user is not logged in or not an admin, redirect to the home page
    if (!session || session.user.role !== 'admin') {
      router.push('/'); // Client-side redirect
    }

    // Fetch pending users if the user is an admin
    const fetchPendingUsers = async () => {
      const response = await fetch('/api/admin/pending-users');
      const data = await response.json();
      setPendingUsers(data);
    };

    if (session?.user.role === 'admin') {
      fetchPendingUsers();
    }
  }, [session, status, router]);

  const handleApproval = async (userId, action) => {
    await fetch('/api/admin/approve-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, action }),
    });
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId)); // Remove from list
  };

  // Render loading state while session is being fetched
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 text-left max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4 mt-4">Pending User Approvals</h1>
      {pendingUsers.length > 0 ? (
        <ul className="space-y-4">
          {pendingUsers.map((user) => (
            <li key={user.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <div className="flex space-x-4 mt-4"> {/* Flexbox with horizontal space between buttons */}
                <button
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                    onClick={() => handleApproval(user.id, 'APPROVE')}
                >
                    Approve
                </button>
                <button
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
                    onClick={() => handleApproval(user.id, 'REJECT')}
                >
                    Reject
                </button>
                </div>
            </li>          
          ))}
        </ul>
      ) : (
        <p>No pending users for approval.</p>
      )}
    </div>
  );
};

export default AdminApproval;
