import * as z from 'zod';

export const organizationDomains = [
  '@company.com',
  '@org.com',
  // Add more allowed domains here
] as const;

export const signupSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .refine((email) => {
      return organizationDomains.some(domain => email.endsWith(domain));
    }, 'Please use your company or organization email')
});

export const setupSchema = z.object({
  role: z.enum(['team_member', 'owner', 'project_manager', 'leader', 'other']).describe('Please select your role'),
  function: z.string().min(1, 'Please select your function'),
  useCase: z.string().min(1, 'Please select your primary use case')
});

export type SignUpFormData = z.infer<typeof signupSchema>;
export type SetupFormData = z.infer<typeof setupSchema>;
