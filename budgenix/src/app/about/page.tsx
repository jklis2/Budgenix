import HomeLayout from "@/components/layout/HomeLayout";
import Link from "next/link";

export default function About() {
  return (
    <HomeLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold">O Budgenix</h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
              Nasza misja to pomóc Ci przejąć kontrolę nad swoimi finansami i osiągnąć swoje cele finansowe.
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Nasza historia</h2>
              <p className="text-gray-600 mb-4">
                Budgenix powstał z prostej potrzeby - stworzyć narzędzie, które pomoże ludziom lepiej zarządzać swoimi finansami. Założony w 2023 roku przez grupę pasjonatów finansów i technologii, szybko stał się jednym z wiodących rozwiązań do zarządzania budżetem osobistym w Polsce.
              </p>
              <p className="text-gray-600 mb-4">
                Nasz zespół składa się z ekspertów finansowych, doświadczonych programistów i projektantów UX, którzy wspólnie pracują nad tym, aby Budgenix był nie tylko funkcjonalny, ale również intuicyjny i przyjemny w użyciu.
              </p>
              <p className="text-gray-600">
                Wierzymy, że każdy zasługuje na dostęp do narzędzi, które pomogą mu podejmować lepsze decyzje finansowe, niezależnie od poziomu wiedzy czy doświadczenia w zarządzaniu pieniędzmi.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-indigo-600/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nasze wartości</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Wartości, które kierują naszymi działaniami i decyzjami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Bezpieczeństwo</h3>
              <p className="text-gray-600">
                Bezpieczeństwo Twoich danych finansowych jest naszym priorytetem. Stosujemy najwyższe standardy zabezpieczeń i szyfrowania, aby chronić Twoje informacje.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Innowacyjność</h3>
              <p className="text-gray-600">
                Nieustannie rozwijamy nasze rozwiązania, wprowadzając innowacyjne funkcje, które pomagają naszym użytkownikom lepiej zarządzać swoimi finansami.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Społeczność</h3>
              <p className="text-gray-600">
                Budujemy społeczność świadomych finansowo osób, które dzielą się swoimi doświadczeniami i wspierają się nawzajem w drodze do finansowej niezależności.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nasz zespół</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Poznaj ludzi, którzy stoją za Budgenix
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">Jan Kowalski</h3>
                <p className="text-sm text-indigo-600 mb-3">CEO & Założyciel</p>
                <p className="text-gray-600 text-sm">
                  Ekspert finansowy z ponad 10-letnim doświadczeniem w branży fintech.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">Anna Nowak</h3>
                <p className="text-sm text-indigo-600 mb-3">CTO</p>
                <p className="text-gray-600 text-sm">
                  Doświadczona programistka i architektka systemów finansowych.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">Piotr Wiśniewski</h3>
                <p className="text-sm text-indigo-600 mb-3">Dyrektor Produktu</p>
                <p className="text-gray-600 text-sm">
                  Specjalista UX/UI z pasją do tworzenia intuicyjnych interfejsów.
                </p>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">Magdalena Dąbrowska</h3>
                <p className="text-sm text-indigo-600 mb-3">Dyrektor Marketingu</p>
                <p className="text-gray-600 text-sm">
                  Ekspertka w dziedzinie marketingu cyfrowego i komunikacji.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Dołącz do Budgenix już dziś</h2>
          <p className="mt-4 text-lg text-indigo-100 max-w-3xl mx-auto">
            Rozpocznij swoją drogę do finansowej niezależności z Budgenix
          </p>
          <div className="mt-10">
            <Link href="/auth/register" className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-lg shadow-lg hover:bg-indigo-50 hover:shadow-xl transition-all inline-block">
              Zarejestruj się za darmo
            </Link>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
