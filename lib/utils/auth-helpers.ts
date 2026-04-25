import type { User } from '@/lib/data/user'

export const checkIfUserNeedsSetup = (userData: User | Partial<User> | null): boolean => {
  if (!userData) return true;
  if (userData.is_setup_complete === true) return false;

  const { full_name, phone_number } = userData;

  if (!full_name || full_name.trim() === '') {
    return true;
  }

  if (full_name === phone_number) {
    return true;
  }
  return false;
};