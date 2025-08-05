"use client";

import React, { useState, useEffect } from "react";
import { X, User, Mail, Building, Shield } from "lucide-react";
import { User as UserType } from "@/types/user";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
  user: UserType | null;
}

interface UserFormData {
  username: string;
  email: string;
  roleId: number;
  organizationId: number;
  status: 'active' | 'inactive';
}

const roles = [
  { id: 1, name: "Project Manager", description: "Project Manager" },
  { id: 2, name: "Leader", description: "Leader" },
  { id: 3, name: "Member", description: "Member" },
];

const organizations = [
  { id: 1, name: "Công ty ABC" },
  { id: 2, name: "Công ty XYZ" },
];

export default function EditUserModal({ isOpen, onClose, onSubmit, user }: EditUserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    roleId: 3,
    organizationId: 1,
    status: "active",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        roleId: user.roleId,
        organizationId: user.organizationId,
        status: user.status,
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const userData = {
        ...formData,
        id: user?.id,
        updatedAt: new Date().toISOString(),
      };
      
      onSubmit(userData);
      onClose();
      setErrors({});
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[70] p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 transform transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">Edit Member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="example@company.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="w-4 h-4 inline mr-2" />
              Role
            </label>
            <select
              value={formData.roleId}
              onChange={(e) => handleInputChange("roleId", parseInt(e.target.value))}
              className="w-full text-gray-700 text-sm font-medium hover:bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id} className="text-gray-700 text-sm font-medium hover:bg-gray-100">
                  {role.name} 
                </option>
              ))}
            </select>
          </div>

          {/* Organization */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-2" />
              Tổ chức
            </label>
            <select
              value={formData.organizationId}
              onChange={(e) => handleInputChange("organizationId", parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={(e) => handleInputChange("status", e.target.value as 'active' | 'inactive')}
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="inactive"
                  checked={formData.status === "inactive"}
                  onChange={(e) => handleInputChange("status", e.target.value as 'active' | 'inactive')}
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Inactive</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 