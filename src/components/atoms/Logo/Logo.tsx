import Link from 'next/link';

interface LogoProps {
  /**
   * The variant of the logo
   * @default 'default'
   */
  variant?: 'default' | 'white' | 'colored';
  
  /**
   * Whether the logo should be a link to home page
   * @default true
   */
  isLink?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

const variantStyles = {
  default: 'text-gray-900',
  white: 'text-white',
  colored: 'text-blue-600',
};

export default function Logo({
  variant = 'default',
  isLink = true,
  className = '',
}: LogoProps) {
  const textColor = variantStyles[variant];
  
  const LogoText = () => (
    <span className={`text-2xl font-bold ${textColor} ${className}`}>
      TaskManager
    </span>
  );

  if (isLink) {
    return (
      <Link href="/" className="flex items-center">
        <LogoText />
      </Link>
    );
  }

  return <LogoText />;
}
