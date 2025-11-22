import HomeLayout from "@/components/layout/HomeLayout";
import Link from "next/link";

export default function Home() {
  return (
    <HomeLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Zarządzaj finansami mądrzej z Budgenix
              </h1>
              <p className="mt-6 text-lg text-indigo-100">
                Kompleksowe narzędzie do zarządzania budżetem osobistym, śledzenia wydatków i osiągania celów finansowych.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth/register" className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-lg shadow-md hover:bg-indigo-50 transition-colors text-center">
                  Rozpocznij za darmo
                </Link>
                <Link href="/about" className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors text-center">
                  Dowiedz się więcej
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-80">
                <div className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-white/30 rounded-2xl transform -rotate-3"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Funkcje, które pokochasz</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Budgenix oferuje wszystko, czego potrzebujesz do efektywnego zarządzania swoimi finansami
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Budżetowanie</h3>
              <p className="text-gray-600">
                Twórz i zarządzaj budżetami miesięcznymi, kategoryzuj wydatki i monitoruj swoje postępy w czasie rzeczywistym.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Analizy i raporty</h3>
              <p className="text-gray-600">
                Uzyskaj wgląd w swoje finanse dzięki przejrzystym wizualizacjom i szczegółowym raportom finansowym.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Cele oszczędnościowe</h3>
              <p className="text-gray-600">
                Ustal cele finansowe i śledź swoje postępy, aby skutecznie oszczędzać na ważne wydatki i marzenia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Gotowy, by przejąć kontrolę nad swoimi finansami?</h2>
          <p className="mt-4 text-lg text-indigo-100 max-w-3xl mx-auto">
            Dołącz do tysięcy użytkowników, którzy już poprawili swoją sytuację finansową dzięki Budgenix
          </p>
          <div className="mt-10">
            <Link href="/auth/register" className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-lg shadow-lg hover:bg-indigo-50 hover:shadow-xl transition-all inline-block">
              Rozpocznij za darmo
            </Link>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
