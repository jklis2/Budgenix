export default function MainFooter({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  return (
    <footer className={`bg-red-500 text-white py-4 text-center transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
      2025 OszczędzaMy. Wszelkie prawa zastrzeżone.
    </footer>
  );
}
