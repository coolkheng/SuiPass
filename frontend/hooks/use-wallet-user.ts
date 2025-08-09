import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { apiRequest } from '@/lib/api-utils';

interface UserData {
  id: string;
  wallet_address: string;
  username: string;
  email?: string;
  created_at: string;
}

export function useWalletUser() {
  const currentAccount = useCurrentAccount();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Reset user data when wallet disconnects
    if (!currentAccount?.address) {
      setUser(null);
      return;
    }

    const fetchOrCreateUser = async () => {
      if (!currentAccount?.address) return;

      setIsLoading(true);
      setError(null);
      
      try {
        const walletAddress = currentAccount.address;
        
        // First, check if user exists by querying the users endpoint with wallet address
        console.log('Checking if user exists for wallet:', walletAddress);
        try {
          const existingUsers = await apiRequest<UserData[]>(`api/users?wallet=${walletAddress}`);
          
          if (existingUsers && existingUsers.length > 0) {
            console.log('User found:', existingUsers[0]);
            setUser(existingUsers[0]);
            return;
          }
          
          // User doesn't exist, create a new one with simplified data
          console.log('User not found, creating a new one');
          
          // Let the backend handle the username and email generation
          const newUser = await apiRequest<UserData>('api/users', {
            method: 'POST',
            body: JSON.stringify({
              wallet_address: walletAddress
            })
          });
          
          console.log('User created successfully:', newUser);
          setUser(newUser);
          
        } catch (apiError: any) {
          console.error('API error:', apiError);
          throw apiError;
        }
      } catch (err) {
        console.error('Error in wallet user hook:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrCreateUser();
  }, [currentAccount?.address]);
  
  return { user, isLoading, error };
}
