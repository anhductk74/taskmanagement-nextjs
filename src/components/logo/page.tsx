import React from 'react'

const Logo = () => {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center mt-10 mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-3 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">TaskManager</h1>
        </div>
  )
}

export default Logo