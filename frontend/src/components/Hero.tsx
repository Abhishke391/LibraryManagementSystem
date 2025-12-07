import { Link } from "react-router-dom";

type HeroProps = {
  user: string | null;
  onAddClick?: () => void;
};

export default function Hero({ user, onAddClick }: HeroProps) {
  const isAuthenticated = Boolean(user);

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-4">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Explore the catalog</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Browse books without an account</h2>
            <p className="text-lg text-gray-700 max-w-2xl">
              Anyone can explore the collection. Sign in when you want to add, edit, or delete books.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/login"
                className="px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow hover:shadow-lg transition"
              >
                Login to manage
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 text-base font-semibold text-blue-700 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition"
              >
                Create free account
              </Link>
            </div>
          </div>
          <div className="flex-1 lg:justify-end">
            <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-indigo-50">
              <p className="text-lg font-semibold text-gray-900">At a glance</p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li>• Browse the library without signing in</li>
                <li>• Secure actions require login</li>
                <li>• Fast search-ready listing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-white to-blue-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Welcome back</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Keep your library organized</h2>
          <p className="text-lg text-gray-700 max-w-2xl">
            Add new books, update details, and keep the catalog clean. You are signed in as {user}.
          </p>
          {onAddClick && (
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onAddClick}
                className="px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl shadow hover:shadow-lg transition"
              >
                + Add Book
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 lg:justify-end">
          <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-emerald-50">
            <p className="text-lg font-semibold text-gray-900">Next steps</p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>• Add titles you own</li>
              <li>• Edit details to stay accurate</li>
              <li>• Remove books you no longer track</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}