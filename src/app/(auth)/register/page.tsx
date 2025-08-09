'use client'
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
import { createUser } from "@/services/userService";
import { Role, UserRegister } from "@/types/user";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// Validation schema
const registerSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
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

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const [message, setMessage] = useState('')
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
  
    const userRegister: UserRegister = {
      email: data.email,
      password: data.confirmPassword,
      roleIds: [2]
    };
  
    console.log("Email registration:", userRegister);
  
    try {
      const res = await createUser(userRegister);
      if (res) {
        console.log('User created successfully!');
        const resLogin = await signIn("credentials", {
          email: data.email,
          password: data.confirmPassword,
          redirect: false,
        });
        if (resLogin?.ok) {
          router.push('/home');
        }
      }
    } catch (err: any) {
      setMessage('Email already exists!');
    }
  
    setTimeout(() => {
      setIsLoading(false);
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
            {/* Message */}
            <div className="flex justify-center">
              {message && (
                <div className="text-red-400 text-sm mt-1 text-center">{message}</div>
              )}
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
            © 2025 TaskManager. By Manakai Team.
          </p>
        </div>
      </div>
    </div>
  );
}
