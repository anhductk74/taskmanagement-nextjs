'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/components/atoms/Logo/Logo'
import { useRouter } from 'next/navigation'
import { SignUpFormData, signupSchema } from '@/lib/validations/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true)
      // Giả lập đăng ký thành công
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/auth/setup')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-8">
            <Logo size="lg" variant="default" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            You're one click away
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            from less busywork
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <Button
            type="button"
            className="w-full flex items-center justify-center gap-2 mb-6 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            onClick={async () => {
              setIsLoading(true)
              // Giả lập đăng nhập Google thành công
              await new Promise(resolve => setTimeout(resolve, 1000))
              router.push('/setup')
            }}
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Continue with your Google work account
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                placeholder="name@company.com"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500">
          By signing up, I agree to the{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  )
}
