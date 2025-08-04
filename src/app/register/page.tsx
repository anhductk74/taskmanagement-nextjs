"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { THEME_COLORS, LIGHT_THEME, DARK_THEME } from "@/constants/theme";
import { ALL_ICONS } from "@/constants/icons";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building } from "lucide-react";
import Link from "next/link";

// Validation schema
const registerSchema = yup.object({
  firstName: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  company: yup
    .string()
    .required("Company is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
}).required();

type RegisterFormData = yup.InferType<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Email registration:", data);
      reset();
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
          <p className="text-slate-400">Create a new account</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  leftIcon={<User className="w-5 h-5" />}
                  className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  inputSize="lg"
                  {...register("firstName")}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  leftIcon={<User className="w-5 h-5" />}
                  className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  inputSize="lg"
                  {...register("lastName")}
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
                type="email"
                placeholder="Enter your email"
                error={!!errors.email}
                helperText={errors.email?.message}
                leftIcon={<Mail className="w-5 h-5" />}
                className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                inputSize="lg"
                {...register("email")}
              />
            </div>

            {/* Phone & Company Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  leftIcon={<Phone className="w-5 h-5" />}
                  className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  inputSize="lg"
                  {...register("phone")}
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                  Company (Optional)
                </label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Enter company name"
                  error={!!errors.company}
                  helperText={errors.company?.message}
                  leftIcon={<Building className="w-5 h-5" />}
                  className="bg-white/5 border-white/20 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  inputSize="lg"
                  {...register("company")}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a new password"
                error={!!errors.password}
                helperText={errors.password?.message}
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
                {...register("password")}
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
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
                {...register("confirmPassword")}
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-red-500 bg-white/5 border-white/20 rounded focus:ring-red-500 focus:ring-2 mt-1"
                {...register("terms")}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-slate-300">
                I agree to the{" "}
                <a href="#" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-400 text-sm mt-1">{errors.terms.message}</p>
            )}

            {/* Register Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-slate-400">or</span>
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
            {isLoading ? "Processing..." : "Sign up with Gmail"}
          </Button>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                Sign in now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            © 2024 TaskManager. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
