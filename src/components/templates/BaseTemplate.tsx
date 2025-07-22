import Link from 'next/link';

interface BaseTemplateProps {
  children: React.ReactNode;
}

export default function BaseTemplate({ children }: BaseTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Task Management
          </Link>
          <nav className="space-x-4">
            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/auth/signup" className="hover:text-blue-600">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="h-16 border-t">
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <p>&copy; 2025 Task Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
