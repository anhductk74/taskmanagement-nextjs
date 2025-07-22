import Link from 'next/link';
import Logo from '@/components/atoms/Logo/Logo';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo variant="default" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/resources" className="text-gray-600 hover:text-gray-900">
              Resources
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
