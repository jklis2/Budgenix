"use client";
import Image from "next/image";

export default function MainNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}) {
  return (
    <nav className={`bg-blue-500 text-white h-16 flex items-center px-4 transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4">
        <Image
          src={isSidebarOpen ? "/icons/closeSidebar.svg" : "/icons/openSidebar.svg"}
          alt="Toggle Sidebar"
          width={24}
          height={24}
        />
      </button>
      <span className="text-lg font-semibold">Main Navbar</span>
    </nav>
  );
}
