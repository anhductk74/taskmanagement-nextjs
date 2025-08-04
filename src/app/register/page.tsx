"use client";

import { useState } from "react";
import { THEME_COLORS, LIGHT_THEME, DARK_THEME } from "@/constants/theme";
import { ALL_ICONS } from "@/constants/icons";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Email registration:", formData);
    }, 1000);
  };

  const handleGmailRegister = async () => {
    setIsLoading(true);
    
    // Simulate Gmail OAuth
    setTimeout(() => {
      setIsLoading(false);
      console.log("Gmail registration initiated");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-lg">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TaskManager</h1>
          <p className="text-slate-400">Tạo tài khoản mới</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleEmailRegister} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                  Họ
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Nhập họ của bạn"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  leftIcon={<User className="w-5 h-5" />}
                  className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  inputSize="lg"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                  Tên
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Nhập tên của bạn"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  leftIcon={<User className="w-5 h-5" />}
                  className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  inputSize="lg"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleInputChange}
                required
                leftIcon={<Mail className="w-5 h-5" />}
                className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                inputSize="lg"
              />
            </div>

            {/* Phone & Company Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                  Số điện thoại
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  leftIcon={<Phone className="w-5 h-5" />}
                  className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  inputSize="lg"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                  Công ty (tùy chọn)
                </label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Nhập tên công ty"
                  value={formData.company}
                  onChange={handleInputChange}
                  leftIcon={<Building className="w-5 h-5" />}
                  className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  inputSize="lg"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Mật khẩu
              </label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tạo mật khẩu mới"
                value={formData.password}
                onChange={handleInputChange}
                required
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                inputSize="lg"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Xác nhận mật khẩu
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                inputSize="lg"
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 text-red-500 bg-white/5 border-white/20 rounded focus:ring-red-500 focus:ring-2 mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-slate-300">
                Tôi đồng ý với{" "}
                <a href="#" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-slate-400">hoặc</span>
            </div>
          </div>

          {/* Gmail Register Button */}
          <Button
            onClick={handleGmailRegister}
            variant="outline"
            size="lg"
            fullWidth
            loading={isLoading}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 font-semibold py-3 rounded-xl transition-all duration-200"
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký bằng Gmail"}
          </Button>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-slate-400">
              Đã có tài khoản?{" "}
              <a href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            © 2024 TaskManager. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
}
