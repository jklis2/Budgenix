export interface User {
  id: string;
  email: string;
  isActive: boolean;
  fullName?: string | null;
  phoneNumber?: string | null;
  avatarColor?: string | null;
}

export interface UpdateUserProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  avatarColor?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string): Promise<User> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch user profile");
  }

  return response.json();
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateUserProfileRequest
): Promise<User> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update user profile");
  }

  return response.json();
}
