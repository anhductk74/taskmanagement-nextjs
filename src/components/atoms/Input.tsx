import { forwardRef, InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300',
        error: 'border-red-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', variant, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          ref={ref}
          className={inputVariants({ variant: error ? 'error' : variant, className })}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
