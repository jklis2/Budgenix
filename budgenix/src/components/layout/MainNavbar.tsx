"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

type UserData = {
  id: string;
  email: string;
};

export default function MainNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Function to get user email from JWT token
    const getUserFromToken = () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Decode the token to get user data
          const decoded = jwtDecode<UserData>(token);
          
          // Set the email directly from the token
          if (decoded.email) {
            setUserEmail(decoded.email);
          }
        } else {
          setUserEmail(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserEmail(null);
      }
    };

    // Get user data when component mounts
    getUserFromToken();

    // Set up event listener for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      getUserFromToken();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Add click event listener to close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Update state
    setUserEmail(null);
    setDropdownOpen(false);
    // Redirect to home page
    router.push("/");
  };

  return (
    <nav className={`bg-blue-500 text-white h-16 flex items-center justify-between px-4 transition-all ${isSidebarOpen ? "ml-72" : "ml-0"}`}>
      <div className="flex items-center">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 cursor-pointer">
          <Image
            src={isSidebarOpen ? "/icons/closeSidebar.svg" : "/icons/openSidebar.svg"}
            alt="Toggle Sidebar"
            width={24}
            height={24}
          />
        </button>
      </div>
      
      {userEmail && (
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <span className="text-sm font-medium">{userEmail}</span>
          <div 
            className="w-8 h-8 rounded-full bg-red-500 cursor-pointer flex items-center justify-center hover:bg-red-600 transition-colors"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {userEmail.charAt(0).toUpperCase()}
          </div>
          
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800">
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center cursor-pointer"
              >
                <Image 
                  src="/icons/settings.svg" 
                  alt="Settings icon" 
                  width={20} 
                  height={20} 
                  className="mr-3"
                />
                Ustawienia
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center cursor-pointer"
              >
                <Image 
                  src="/icons/logout.svg" 
                  alt="Logout icon" 
                  width={20} 
                  height={20} 
                  className="mr-3"
                />
                Wyloguj
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
