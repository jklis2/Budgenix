import HomeNavbar from './HomeNavbar';
import HomeFooter from './HomeFooter';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <HomeFooter />
    </div>
  );
}
