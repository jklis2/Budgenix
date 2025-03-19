"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

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
    
    // Clean up event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <nav className={`bg-blue-500 text-white h-16 flex items-center justify-between px-4 transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
      <div className="flex items-center">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4">
          <Image
            src={isSidebarOpen ? "/icons/closeSidebar.svg" : "/icons/openSidebar.svg"}
            alt="Toggle Sidebar"
            width={24}
            height={24}
          />
        </button>
        <span className="text-lg font-semibold">Main Navbar</span>
      </div>
      
      {userEmail && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{userEmail}</span>
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
        </div>
      )}
    </nav>
  );
}
