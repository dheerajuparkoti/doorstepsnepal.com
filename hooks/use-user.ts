// lib/hooks/use-user.ts
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  updateFullName,
  updateEmail,
  updateGender,
  updateAgeGroup,
  updatePhone,
  updateProfileImage,
  deleteAccount,
  cancelAccountDeletion,
} from '@/lib/api/user';

export function useUserOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeOperation = async (
    operation: () => Promise<any>,
    successMessage: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      toast.success(successMessage);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    
    updateFullName: (name: string) =>
      executeOperation(() => updateFullName(name), 'Name updated successfully'),
    
    updateEmail: (email: string) =>
      executeOperation(() => updateEmail(email), 'Email updated successfully'),
    
    updateGender: (gender: string) =>
      executeOperation(() => updateGender(gender), 'Gender updated successfully'),
    
    updateAgeGroup: (ageGroup: string) =>
      executeOperation(() => updateAgeGroup(ageGroup), 'Age group updated successfully'),
    
    updatePhone: (phone: string) =>
      executeOperation(() => updatePhone(phone), 'Phone number updated successfully'),
    
    updateProfileImage: (file: File) =>
      executeOperation(() => updateProfileImage(file), 'Profile image updated successfully'),
    
    deleteAccount: () =>
      executeOperation(() => deleteAccount(), 'Account deletion requested'),
    
    cancelAccountDeletion: () =>
      executeOperation(() => cancelAccountDeletion(), 'Account deletion cancelled'),
  };
}