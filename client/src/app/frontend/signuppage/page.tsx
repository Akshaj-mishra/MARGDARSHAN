export const metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden w-full">
      <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover filter blur(4px)">
        <source src="/WhatsApp Video 2025-07-26 at 19.47.55_fc45921d.mp4" type="video/mp4" />Video not supported
      </video>
      <div className="relative z-10 w-11/12 max-w-sm rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900 sm:max-w-md">
        <h2 className="mb-6 text-center text-2xl font-bold dark:text-white">Sign Up</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input type="text" id="username" placeholder="Enter your username" className="w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"/>
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" id="password" placeholder="Enter your password" className="w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"/>
            <p className="text-red-500 text-xs italic">Please choose a password.</p>
          </div>

          <button type="submit" className="w-full rounded bg-[#5cb85c] px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-[#5cb85c] focus:ring-offset-2">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}