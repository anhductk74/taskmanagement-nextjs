"use client"
import React, { useState } from "react";
import { Plus, Mail, Phone, MoreVertical } from "lucide-react";
// import { useTheme } from "@/layouts/hooks/useTheme";
import { User } from "@/types/user";
import AddUserModal from "./components/AddUserModal";
import EditUserModal from "./components/EditUserModal";
import UserActionsDropdown from "./components/UserActionsDropdown";

export default function UserManagementPage() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: "Nguyen Van A",
      email: "nguyen.vana@company.com",
      avatarUrl: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
      roleId: 1,
      organizationId: 1,
      status: "active",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-15T14:30:00Z",
    },
    {
      id: 2,
      username: "Tran Thi B",
      email: "tran.thib@company.com",
      avatarUrl: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
      roleId: 2,
      organizationId: 1,
      status: "active",
      createdAt: "2024-01-02T10:00:00Z",
      updatedAt: "2024-01-15T09:15:00Z",
    },
    {
      id: 3,
      username: "Nguyen Van C",
      email: "nguyen.vanc@company.com",
      avatarUrl: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
      roleId: 3,
      organizationId: 1,
      status: "active",
      createdAt: "2024-01-03T10:00:00Z",
      updatedAt: "2024-01-15T14:30:00Z",
    },
    {
      id: 4,
      username: "Nguyen Van D",
      email: "nguyen.vand@company.com",
      avatarUrl: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
      roleId: 4,
      organizationId: 1,
      status: "active",
      createdAt: "2024-01-04T10:00:00Z",
      updatedAt: "2024-01-15T14:30:00Z",
    }
  ]);

  const handleAddUser = (userData: any) => {
    const newUser: User = {
      id: users.length + 1,
      username: userData.username,
      email: userData.email,
      avatarUrl: userData.avatarUrl,
      roleId: userData.roleId,
      organizationId: userData.organizationId,
      status: userData.status,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    setUsers(prev => [...prev, newUser]);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = (userData: any) => {
    setUsers(prev => prev.map(user =>
      user.id === userData.id
        ? { ...user, ...userData }
        : user
    ));
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>

      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded">
          <p className="text-sm text-gray-400">Total Users</p>
          <p className="text-xl font-bold">{users.length}</p>
          <p className="text-xs text-green-500">+2 new users this month</p>
        </div>
        <div className="bg-white p-4 rounded">
          <p className="text-sm text-gray-400">Active</p>
          <p className="text-xl font-bold">{users.filter(u => u.status === 'active').length}</p>
          <p className="text-xs text-purple-500">{Math.round((users.filter(u => u.status === 'active').length / users.length) * 100)}% total</p>
        </div>
        <div className="bg-white p-4 rounded">
          <p className="text-sm text-gray-400">Project Management</p>
          <p className="text-xl font-bold">1</p>
        </div>
        <div className="bg-white p-4 rounded">
          <p className="text-sm text-gray-400">Admin</p>
          <p className="text-xl font-bold">1</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4" /> Create Member
        </button>
       <div className="flex items-center gap-2">
         <div className="relative">
          <input
            placeholder="Search user..."
            className="w-64 bg-white border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <select className="bg-white text-black p-2 rounded border border-neutral-700">
          <option>All roles</option>
          <option>Admin</option>
          <option>Member</option>
        </select>
        <select className="bg-white text-black p-2 rounded border border-neutral-700">
          <option>All status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
       </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        {/* Table Header */}

        {/* Table Rows */}
        <table className="min-w-full bg-white rounded-xl overflow-hidden text-sm text-gray-700">
          {/* Table Head */}
          <thead className="bg-gray-100 text-gray-400 font-medium border-b border-neutral-700">
            <tr>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Last updated</th>
              <th className="text-center p-4"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-neutral-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-100 transition-colors"
              >
                <td className="p-4 w-1/4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center text-white text-lg font-bold shadow-inner overflow-hidden flex-shrink-0">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        user.username.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 w-1/4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                </td>
                <td className="p-4 w-1/6">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium text-white ${user.roleId === 1 ? 'bg-red-500' : 'bg-purple-400'
                      }`}
                  >
                    {user.roleId === 1 ? "Admin" : "Member"}
                  </span>
                </td>
                <td className="p-4 w-1/6">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium text-white ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 w-1/6 text-gray-400">
                  <span className="text-sm">{new Date(user.updatedAt).toLocaleString('vi-VN')}</span>
                </td>
                <td className="p-4 w-1/12 flex justify-center">
                  <UserActionsDropdown
                    user={user}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUser}
        user={selectedUser}
      />
    </div>
  );
}
