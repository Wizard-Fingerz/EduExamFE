import api from './api';

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'teacher';
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'teacher';
  profile_picture?: string;
  bio?: string;
  date_of_birth?: string | null;
  phone_number?: string;
  address?: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'teacher';
}

const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/users/token/', credentials);
    const { access, refresh } = response.data;
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    return response.data;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post('/users/register/', {
      ...data,
      username: `${data.first_name.toLowerCase()}.${data.last_name.toLowerCase()}` // This will be overridden by the backend
    });
    return response.data;
  },

  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/users/profile/');
    console.log('Profile response:', response.data); // Debug log
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>) {
    const response = await api.patch('/users/profile/update/', data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};

export default authService; 