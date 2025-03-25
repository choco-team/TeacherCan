import { useAuthStore } from '@/store/use-auth-store';
import { fetchWithAuth } from './api/fetchWithAuth';

export const logout = async () => {
  try {
    const response = await fetchWithAuth('/login', {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      useAuthStore.setState({ isAuthenticated: false, user: null });
    } else {
      const data = await response.json();
      console.error(response.status, data.message);
    }
  } catch (error) {
    console.error(error);
  }
};
