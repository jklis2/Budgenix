"use client";

interface MainSidebarProps {
  isOpen?: boolean;
}

export default function MainSidebar({ isOpen = true }: MainSidebarProps) {
  return (
    <aside className={`bg-green-500 text-white w-64 h-screen fixed top-0 left-0 shadow-lg transition-all duration-300 ease-in-out transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6 text-lg font-semibold">Main Sidebar</div>
    </aside>
  );
}
