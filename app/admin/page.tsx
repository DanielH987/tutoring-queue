'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Use useSession hook for client-side session
import { useRouter } from 'next/navigation'; // Use useRouter for client-side navigation
import { FaSyncAlt } from 'react-icons/fa'; // Import the refresh icon from FontAwesome (or your icon library)
import { UserType, StatusType } from '../types';
import Modal from '@/components/Modal'; // Use your existing Modal component

const AdminApproval = () => {
  const [pendingUsers, setPendingUsers] = useState<UserType[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]); // To store all users
  const [isPendingUsersLoading, setIsPendingUsersLoading] = useState(false); // For controlling the animation on pending users
  const [isAllUsersLoading, setIsAllUsersLoading] = useState(false); // For controlling the animation on all users
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null); // User selected for deletion
  const { data: session, status } = useSession(); // Get session data from NextAuth
  const router = useRouter(); // To redirect the user

  useEffect(() => {
    // If session is still loading, do nothing
    if (status === 'loading') return;

    // If user is not logged in or not an admin, redirect to the home page
    if (!session || session?.user?.role !== 'admin') {
      router.push('/'); // Client-side redirect
      return;
    }

    // Fetch pending and all users if the user is an admin
    const fetchUsers = async () => {
      const token = session?.accessToken; // Get the token from the session
      console.log('session:', session);

      const pendingResponse = await fetch('/api/admin/pending-users', {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      const allUsersResponse = await fetch('/api/admin/all-users', {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      
      const pendingData = await pendingResponse.json();
      const allUsersData = await allUsersResponse.json();

      setPendingUsers(pendingData);
      setAllUsers(allUsersData);
    };

    if (session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [session, status, router]);

  const handleApproval = async (userId: string , action: string) => {
    const token = session?.accessToken; // Get the token from the session

    await fetch('/api/admin/approve-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
      body: JSON.stringify({ userId, action }),
    });
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId)); // Remove from list
  };

  const confirmDeleteUser = (user: UserType) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    const token = session?.accessToken; // Get the token from the session

    await fetch(`/api/admin/delete-user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
      body: JSON.stringify({ userId: userToDelete.id }),
    });
    setAllUsers((prev) => prev.filter((user) => user.id !== userToDelete.id)); // Remove from list
    setIsDeleteModalOpen(false); // Close the modal after deletion
    setUserToDelete(null); // Clear the selected user
  };

  const handleSuspendUser = async (userId: string, action: 'SUSPEND' | 'UNSUSPEND') => {
    const token = session?.accessToken; // Get the token from the session

    await fetch(`/api/admin/suspend-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
      body: JSON.stringify({ userId, action }),
    });
    const updatedUsers = allUsers.map((user) => 
      user.id === userId ? { ...user, status: action === 'SUSPEND' ? 'SUSPENDED' as StatusType : 'APPROVED' as StatusType } : user
    );
    setAllUsers(updatedUsers); // Update the user status in the list
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    const token = session?.accessToken; // Get the token from the session

    await fetch(`/api/admin/change-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
      body: JSON.stringify({ userId, role: newRole }),
    });
    const updatedUsers = allUsers.map((user) => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    setAllUsers(updatedUsers); // Update the user role in the list
  };

  const refreshPendingUsers = async () => {
    setIsPendingUsersLoading(true); // Start spinning animation
    const token = session?.accessToken; // Get the token from the session

    const pendingResponse = await fetch('/api/admin/pending-users', {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    });
    const pendingData = await pendingResponse.json();
    setPendingUsers(pendingData);
    setIsPendingUsersLoading(false); // Stop spinning animation
  };

  const refreshAllUsers = async () => {
    setIsAllUsersLoading(true); // Start spinning animation
    const token = session?.accessToken; // Get the token from the session

    const allUsersResponse = await fetch('/api/admin/all-users', {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    });
    const allUsersData = await allUsersResponse.json();
    setAllUsers(allUsersData);
    setIsAllUsersLoading(false); // Stop spinning animation
  };

  // Render loading state while session is being fetched
  if (status === 'loading') {
    return (
      <div className="p-6 text-left max-w-screen-lg mx-auto min-h-screen">
        <h1 className="text-3xl font-bold mb-4 mt-4">Admin Panel</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-left max-w-screen-lg mx-auto min-h-screen relative pb-20">
      {/* Pending Users Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Pending User Approvals</h1>
        <FaSyncAlt
          className={`text-gray-600 hover:text-gray-700 cursor-pointer ${isPendingUsersLoading ? 'animate-spin' : ''}`}
          size={20}
          onClick={refreshPendingUsers} // Call the refresh function when the icon is clicked
        />
      </div>
      {pendingUsers.length > 0 ? (
        <ul className="space-y-4 overflow-y-auto">
          {pendingUsers.map((user) => (
            <li key={user.id} className="bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-800">
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

      {/* All Users Section */}
      <div className="flex justify-between items-center mt-8 mb-4">
        <h1 className="text-3xl font-bold">All Users</h1>
        <FaSyncAlt
          className={`text-gray-600 hover:text-gray-700 cursor-pointer ${isAllUsersLoading ? 'animate-spin' : ''}`}
          size={20}
          onClick={refreshAllUsers} // Call the refresh function when the icon is clicked
        />
      </div>
      {allUsers.length > 0 ? (
        <ul className="space-y-4 overflow-y-auto">
          {allUsers.map((user) => (
            user.status !== 'PENDING' && (
              <li key={user.id} className="bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-800">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Status:</strong> {user.status}</p>
                <div className="flex space-x-4 mt-4">
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
                    onClick={() => confirmDeleteUser(user)}
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
                    className="bg-gray-200 text-black py-2 px-4 rounded-lg dark:bg-gray-800 dark:text-white"
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <p>Are you sure you want to delete user: {userToDelete?.name}?</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
            onClick={handleDeleteUser}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminApproval;
