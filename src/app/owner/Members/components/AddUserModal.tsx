"use client";

import React, { useState } from "react";
import { X, User, Mail, Lock, Building, Shield } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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

export default function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: 3, // Default to member
    organizationId: 1,
    status: "active",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

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
      newErrors.username = "Tên người dùng là bắt buộc";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên người dùng phải có ít nhất 3 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const userData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSubmit(userData);
      onClose();
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleId: 3,
        organizationId: 1,
        status: "active",
      });
      setErrors({});
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[70] p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">Invite Member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

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
              className={`w-full px-4 py-3 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="example@company.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Mật khẩu *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${errors.password ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="********"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 