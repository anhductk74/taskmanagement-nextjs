import Image from "next/image";
import PublicLayout from "@/layouts/public/PublicLayout";
import Button from "@/components/ui/Button/Button";

export default function Home() {
  return (
    <PublicLayout>
      <div className="min-h-screen relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        {/* Logo Section */}
        
        {/* Hero Section */}
        <section className="relative z-10 rounded-2xl py-16 px-6 max-w-3xl w-full mx-auto mt-4 mb-10">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">A better way to</span>
              <span className="block bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">manage your tasks</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-slate-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Stay organized, focused, and in charge. TaskManager helps you
              manage your tasks efficiently so you can focus on what matters
              most.
            </p>
            <div className="mt-5 max-w-md mx-auto flex flex-col sm:flex-row sm:justify-center gap-4 md:mt-8">
              <a
                href="/register"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  Get started
                </Button>
              </a>
              <a
                href="/login"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  Sign In
                </Button>
              </a>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="relative z-10 py-16 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-5xl w-full mx-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white mx-auto shadow-lg mb-4">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">Task Management</h3>
                <p className="mt-2 text-base text-slate-300">
                  Create, organize, and track your tasks with ease.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white mx-auto shadow-lg mb-4">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">Team Collaboration</h3>
                <p className="mt-2 text-base text-slate-300">
                  Work together with your team seamlessly.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white mx-auto shadow-lg mb-4">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">Progress Tracking</h3>
                <p className="mt-2 text-base text-slate-300">
                  Monitor progress and achieve your goals.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
