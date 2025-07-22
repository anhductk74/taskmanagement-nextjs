'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Logo from '@/components/atoms/Logo/Logo'
import { useRouter } from 'next/navigation'
import { SetupFormData, setupSchema } from '@/lib/validations/auth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const roles = [
  { id: 'team_member', title: 'Team Member', description: 'I work with my team to complete tasks and projects' },
  { id: 'owner', title: 'Owner', description: 'I own or run the organization' },
  { id: 'project_manager', title: 'Project Manager', description: 'I manage projects and coordinate team activities' },
  { id: 'leader', title: 'Leader', description: 'I lead a team and manage their workflow' },
  { id: 'other', title: 'Other', description: 'None of the above describes my role' }
]

const workFunctions = [
  'Engineering',
  'IT',
  'Marketing',
  'Operations',
  'Product',
  'Sales',
  'Other'
]

const useCases = [
  'Project Management',
  'Task Tracking',
  'Team Collaboration',
  'Process Management',
  'Other'
]

export default function SetupAccountPage() {
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema)
  })

  // Update form when role is selected
  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setValue('role', roleId as any)
  }

  const onSubmit = async (data: SetupFormData) => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(data)
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-16 bg-gray-50">
      <div className="w-full max-w-2xl">
        {/* Logo và Header */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <Logo size="lg" variant="default" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Tell us about your work
          </h1>
          <p className="text-base text-gray-600 max-w-md mx-auto">
            This will help us tailor the experience for you. We may also reach out to help you find the right products for your team.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Role Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">What's your role?</h2>
              <div className="grid gap-3">
                {roles.map((role) => (
                  <Card 
                    key={role.id}
                    className={`p-4 cursor-pointer transition-all border hover:border-blue-400 ${
                      selectedRole === role.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      {...register('role')}
                      value={role.id}
                      checked={selectedRole === role.id}
                    />
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{role.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{role.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === role.id 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedRole === role.id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {errors.role && (
                <p className="text-sm text-red-500 mt-2">{errors.role.message}</p>
              )}
            </div>

            {/* Function Selection */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">
                Which function best describes your work?
              </h2>
              <select
                className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                {...register('function')}
              >
                <option value="">Select a function</option>
                {workFunctions.map((fn) => (
                  <option key={fn} value={fn.toLowerCase()}>{fn}</option>
                ))}
              </select>
              {errors.function && (
                <p className="text-sm text-red-500">{errors.function.message}</p>
              )}
            </div>

            {/* Use Case Selection */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">
                What do you want to use the platform for?
              </h2>
              <select
                className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                {...register('useCase')}
              >
                <option value="">Select primary use case</option>
                {useCases.map((useCase) => (
                  <option key={useCase} value={useCase.toLowerCase()}>{useCase}</option>
                ))}
              </select>
              {errors.useCase && (
                <p className="text-sm text-red-500">{errors.useCase.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className={`w-full py-3 text-base font-medium transition-all ${
                isLoading 
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Setting up your account...' : 'Continue'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
