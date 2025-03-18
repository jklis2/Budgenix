import Link from "next/link";

export default function HomeNavbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-teal-600">
            Budgenix
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition">
              O nas
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition">
              Kontakt
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 transition"
            >
              Zaloguj się
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
