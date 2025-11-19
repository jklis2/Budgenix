"use client";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { getUserProfile, User } from "@/services/userService";

type UserData = {
  id: string;
  email: string;
};

export default function MainNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobile = false,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobile?: boolean;
}) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Function to get user data from JWT token and fetch profile
    const getUserFromToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Decode the token to get user data
          const decoded = jwtDecode<UserData>(token);
          
          // Set the email directly from the token
          if (decoded.email) {
            setUserEmail(decoded.email);
            
            // Fetch full user profile
            try {
              const profile = await getUserProfile(decoded.id);
              setUserProfile(profile);
            } catch (error) {
              console.error("Error fetching user profile:", error);
              // If profile fetch fails, still show email
            }
          }
        } else {
          setUserEmail(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserEmail(null);
        setUserProfile(null);
      }
    };

    // Get user data when component mounts
    getUserFromToken();

    // Set up event listener for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      getUserFromToken();
    };

    // Set up event listener for profile updates
    const handleProfileUpdate = () => {
      getUserFromToken();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profileUpdated", handleProfileUpdate);
    
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
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Update state
    setUserEmail(null);
    setUserProfile(null);
    setDropdownOpen(false);
    // Redirect to home page
    router.push("/");
  };

  const getDisplayName = () => {
    return userProfile?.fullName || userEmail || "User";
  };

  const getAvatarInitial = () => {
    if (userProfile?.fullName) {
      return userProfile.fullName.charAt(0).toUpperCase();
    }
    if (userEmail) {
      return userEmail.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getAvatarColor = () => {
    return userProfile?.avatarColor || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  };

  return (
    <nav className={`bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 transition-all duration-300 shadow-sm ${
      isSidebarOpen && !isMobile ? "lg:ml-64" : "ml-0"
    }`}>
      <div className="flex items-center">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-gray-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        <div className="ml-4 hidden md:flex items-center space-x-1">
          <div className="text-xs text-gray-500">Dzisiaj</div>
          <div className="text-sm font-medium text-gray-700">
            {new Date().toLocaleDateString('pl-PL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>
        
        {userEmail && (
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <span className="text-sm font-medium text-gray-700 hidden md:block">{getDisplayName()}</span>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium shadow-sm"
                style={{ background: getAvatarColor() }}
              >
                {getAvatarInitial()}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10 text-gray-700 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{getDisplayName()}</div>
                  <div className="text-xs text-gray-500">{userEmail}</div>
                </div>
                
                <button
                  onClick={() => router.push('/dashboard/settings')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ustawienia
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/support')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Centrum wsparcia
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center cursor-pointer text-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Wyloguj
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
