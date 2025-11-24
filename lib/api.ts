// API client utilities for frontend

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Set auth token
export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

// Remove auth token
export function removeAuthToken(): void {
  localStorage.removeItem('auth_token');
}

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

// Bookings API
export const bookingsApi = {
  getAll: async () => {
    return apiRequest<any[]>('/bookings');
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/bookings/${id}`);
  },

  create: async (bookingData: any) => {
    return apiRequest<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  update: async (id: string, updates: any) => {
    return apiRequest<any>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    try {
      const url = `${API_BASE_URL}/auth/login`;
      console.log('Login request:', { url, username, API_BASE_URL });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        console.error('Login failed - response not ok:', data);
        return {
          success: false,
          error: data.error || 'Login failed',
          data: undefined,
        };
      }

      // API returns { success: true, token, user } directly
      if (data.success && data.token) {
        console.log('Login successful, setting token');
        setAuthToken(data.token);
        return {
          success: true,
          data: {
            token: data.token,
            user: data.user,
          },
        };
      }

      console.error('Login failed - unexpected response structure:', data);
      return {
        success: false,
        error: data.error || 'Login failed - unexpected response',
        data: undefined,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle network errors or parsing errors
      return {
        success: false,
        error: error.message || 'Login request failed',
        data: undefined,
      };
    }
  },

  logout: () => {
    removeAuthToken();
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

