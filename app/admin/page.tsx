'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Use useSession hook for client-side session
import { useRouter } from 'next/navigation'; // Use useRouter for client-side navigation

const AdminApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // To store all users
  const { data: session, status } = useSession(); // Get session data from NextAuth
  const router = useRouter(); // To redirect the user

  useEffect(() => {
    // If session is still loading, do nothing
    if (status === 'loading') return;

    // If user is not logged in or not an admin, redirect to the home page
    if (!session || session.user.role !== 'admin') {
      router.push('/'); // Client-side redirect
    }

    // Fetch pending and all users if the user is an admin
    const fetchUsers = async () => {
      const pendingResponse = await fetch('/api/admin/pending-users');
      const allUsersResponse = await fetch('/api/admin/all-users');
      
      const pendingData = await pendingResponse.json();
      const allUsersData = await allUsersResponse.json();

      setPendingUsers(pendingData);
      setAllUsers(allUsersData);
    };

    if (session?.user.role === 'admin') {
      fetchUsers();
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

  const handleDeleteUser = async (userId) => {
    await fetch(`/api/admin/delete-user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    setAllUsers((prev) => prev.filter((user) => user.id !== userId)); // Remove from list
  };

  const handleSuspendUser = async (userId, action) => {
    await fetch(`/api/admin/suspend-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, action }),
    });
    const updatedUsers = allUsers.map((user) => 
      user.id === userId ? { ...user, status: action === 'SUSPEND' ? 'SUSPENDED' : 'APPROVED' } : user
    );
    setAllUsers(updatedUsers); // Update the user status in the list
  };

  const handleChangeRole = async (userId, newRole) => {
    await fetch(`/api/admin/change-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, role: newRole }),
    });
    const updatedUsers = allUsers.map((user) => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    setAllUsers(updatedUsers); // Update the user role in the list
  };

  // Render loading state while session is being fetched
  if (status === 'loading') {
    return (
      <div className="p-6 text-left max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4 mt-4">Admin Panel</h1>
        <p>Loading...</p>
      </div>
    )
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
                <p><strong>Role:</strong> {user.role}</p>
                <div className="flex space-x-4 mt-4">
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

      <h1 className="text-3xl font-bold mb-4 mt-4">All Users</h1>
      {allUsers.length > 0 ? (
        <ul className="space-y-4">
          {allUsers.map((user) => (
            user.status !== 'PENDING' && (
              <li key={user.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Status:</strong> {user.status}</p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                      onClick={() => handleSuspendUser(user.id, user.status === 'SUSPENDED' ? 'UNSUSPEND' : 'SUSPEND')}
                    >
                      {user.status === 'SUSPENDED' ? 'Unsuspend' : 'Suspend'}
                    </button>
                    <select
                      className="bg-gray-200 text-black py-2 px-4 rounded-lg"
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                    >
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
              </li>          
            )
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default AdminApproval;
