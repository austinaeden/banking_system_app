/**
 * API Service Layer.
 * Handles all communication between the React frontend and the Spring Boot backend.
 */
const API_BASE_URL = 'http://localhost:8085/api';

export const api = {
  /**
   * Authenticates a user.
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Server error. Please try again.' };
      }
      return await response.json();
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: 'Cannot connect to server. Please ensure the backend is running on port 8085.' };
    }
  },

  /**
   * Registers a new user.
   */
  register: async (username, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Server error. Please try again.' };
      }
      return await response.json();
    } catch (error) {
      console.error("Register Error:", error);
      return { success: false, message: 'Cannot connect to server. Please ensure the backend is running on port 8085.' };
    }
  },

  /**
   * Fetches all relevant data for a specific user (Accounts, Transactions, Notifications).
   */
  getUserData: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/data`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      return await response.json();
    } catch (error) {
      console.error("GetUserData Error:", error);
      return { accounts: [], transactions: [], notifications: [], user: null };
    }
  },

  /**
   * Admin: Fetches global system metrics and all entities.
   */
  getAdminData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/data`);
      if (!response.ok) throw new Error("Failed to fetch admin data");
      return await response.json();
    } catch (error) {
      console.error("GetAdminData Error:", error);
      return { stats: {}, allUsers: [], allAccounts: [], allTransactions: [] };
    }
  },

  /**
   * Processes a fund transfer between accounts.
   */
  transfer: async (fromAccountId, toAccountName, amount, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAccount: fromAccountId, toAccount: toAccountName, amount, userId })
      });
      return await response.json();
    } catch (error) {
      console.error("Transfer Error:", error);
      return { success: false, message: 'Network error occurred.' };
    }
  },

  /**
   * Updates user profile details (Username, Email, Phone, etc.).
   */
  updateProfile: async (profileData, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      return await response.json();
    } catch (error) {
      console.error("UpdateProfile Error:", error);
      return { success: false, message: 'Network error occurred.' };
    }
  },

  /**
   * Admin: Sends a global system notification.
   */
  sendNotification: async (title, message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: title, message })
      });
      return await response.json();
    } catch (error) {
      console.error("Notify Error:", error);
      return { success: false, message: 'Network error occurred.' };
    }
  },

  /**
   * Updates a user's profile photo.
   */
  updatePhoto: async (photoUrl, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/photo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl })
      });
      return await response.json();
    } catch (error) {
      console.error("UpdatePhoto Error:", error);
      return { success: false, message: 'Network error occurred.' };
    }
  },

  /**
   * Deletes a notification by its ID.
   */
  deleteNotification: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/notifications/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error("DeleteNotification Error:", error);
      return { success: false, message: 'Network error occurred.' };
    }
  },

  /**
   * Admin: Freezes or Unfreezes a bank account.
   */
  toggleFreezeAccount: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/accounts/${id}/toggle-freeze`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      console.error("ToggleFreeze Error:", error);
      return { success: false, message: 'Network error occurred.' };
    }
  },

  /**
   * Admin: Fetches transaction history for a specific account.
   */
  getAccountTransactions: async (accountId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/accounts/${accountId}/transactions`);
      if (!response.ok) throw new Error("Failed to fetch account transactions");
      return await response.json();
    } catch (error) {
      console.error("GetAccountTransactions Error:", error);
      return [];
    }
  }
};
