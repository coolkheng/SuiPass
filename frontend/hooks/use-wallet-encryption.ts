"use client"

import { useState, useCallback, useEffect } from 'react';
import { useCurrentAccount, useSignPersonalMessage } from '@mysten/dapp-kit';
import { 
  encryptData as encryptWithKey,
  decryptData as decryptWithKey,
  importKeyFromBase64,
  exportKeyToBase64,
  EncryptedData
} from '@/lib/crypto';
import { deriveEncryptionKey } from '@/lib/wallet-auth';
import { toast } from '@/hooks/use-toast';
import { SUI_WALLET_CONFIG } from '@/lib/wallet-adapter';

// Storage keys for localStorage
const WALLET_ADDRESS_STORAGE_KEY = 'suipass_wallet_address';
const ENCRYPTION_KEY_STORAGE_KEY = 'suipass_encryption_key';

// Helper to get stored encryption data
function getStoredEncryptionData() {
  const walletAddress = localStorage.getItem(WALLET_ADDRESS_STORAGE_KEY);
  const encryptionKey = localStorage.getItem(ENCRYPTION_KEY_STORAGE_KEY);
  
  if (!walletAddress || !encryptionKey) {
    return null;
  }
  
  return {
    walletAddress,
    encryptionKey
  };
}

/**
 * Hook for wallet-based encryption/decryption
 * This is a simplified version that uses a deterministic encryption key
 * derived from the wallet signature
 */
export function useWalletEncryption() {
  const currentAccount = useCurrentAccount();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();
  const [isInitialized, setIsInitialized] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connected = !!currentAccount;
  const publicKey = currentAccount?.address;

  // Check if we have encryption data in localStorage on mount
  useEffect(() => {
    // Check if there's encryption data in localStorage
    const storedData = getStoredEncryptionData();
    // Only set as initialized if we have a matching wallet address
    if (connected && publicKey && storedData && storedData.walletAddress === publicKey) {
      console.log('Found stored encryption key for current wallet');
      setIsInitialized(true);
    } else {
      setIsInitialized(false);
    }
  }, [publicKey, connected]);

  // Function to handle signature and derive encryption key
  const handleSignMessage = useCallback(async (): Promise<CryptoKey> => {
    if (!connected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a message to sign for Sui
      const messageText = `SuiPass-Auth-${publicKey.substring(0, 8)}`;
      
      return new Promise((resolve, reject) => {
        // Request the user to sign
        signPersonalMessage(
          { message: new TextEncoder().encode(messageText) },
          {
            onSuccess: async (result: any) => {
              try {
                console.log('✅ Message signed successfully, deriving encryption key');
                
                // Convert signature to string for storage
                const signatureString = result.signature;
                
                // Store wallet address
                localStorage.setItem(WALLET_ADDRESS_STORAGE_KEY, publicKey);
                
                // Derive encryption key using the signature
                const key = await deriveEncryptionKey(messageText, signatureString);
                console.log('✅ Successfully derived encryption key');
                
                // Export the key to base64 for storage
                const keyBase64 = await exportKeyToBase64(key);
                console.log('✅ Successfully exported key to base64 for storage');
                
                // Store the exported key in localStorage
                localStorage.setItem(ENCRYPTION_KEY_STORAGE_KEY, keyBase64);
                
                setEncryptionKey(key);
                setIsInitialized(true);
                
                resolve(key);
              } catch (err) {
                console.error('Error processing signature:', err);
                reject(err);
              }
            },
            onError: (error: any) => {
              console.error('Failed to sign message:', error);
              
              const errorMessage = error.message || 'Failed to sign message';
              if (errorMessage.includes('declined') || errorMessage.includes('reject')) {
                reject(new Error('You declined to sign the message. Wallet signature is required for encryption.'));
              } else {
                reject(new Error(errorMessage));
              }
            }
          }
        );
      });
    } catch (err) {
      console.error('Failed to initialize wallet encryption:', err);
      
      // Handle specific errors
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      
      setError('Unknown error initializing wallet encryption');
      throw new Error('Failed to initialize wallet encryption');
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey, signPersonalMessage]);

  // Function to encrypt data
  const handleEncryptData = useCallback(async (data: string) => {
    if (!connected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      let key = encryptionKey;

      // If we don't have a key yet but we're initialized, retrieve it
      if (!key && isInitialized) {
        const storedData = getStoredEncryptionData();
        if (storedData && storedData.encryptionKey) {
          try {
            // Import the key
            key = await importKeyFromBase64(storedData.encryptionKey);
            
            // Log details about the key we're using
            console.log(' Using stored encryption key');
            
            setEncryptionKey(key);
          } catch (keyError) {
            console.error('Error importing stored key:', keyError);
            // We'll generate a new key below
          }
        }
      }

      // If we still don't have a key, get one
      if (!key) {
        key = await handleSignMessage();
      }

      // Encrypt the data
      const encryptedData = await encryptWithKey(data, key);
      return encryptedData;
    } catch (err) {
      console.error('Encryption failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown encryption error';
      setError(errorMessage);
      throw new Error(`Encryption failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey, encryptionKey, isInitialized, handleSignMessage]);

  // Function to decrypt data with enhanced validation and debugging
  const handleDecryptData = useCallback(async (encryptedData: EncryptedData) => {
    if (!connected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    // Enhanced validation to prevent "Missing encrypted data" errors
    if (!encryptedData) {
      console.error('❌ No encrypted data provided to decryptData');
      throw new Error('No encrypted data provided');
    }
    
    if (!encryptedData.encrypted || encryptedData.encrypted === '') {
      console.error('❌ Missing encrypted value in encryptedData:', encryptedData);
      throw new Error('Missing encrypted value');
    }
    
    if (!encryptedData.iv || encryptedData.iv === '') {
      console.error('❌ Missing IV in encryptedData:', encryptedData);
      throw new Error('Missing IV value');
    }

    // Log the encrypted data we're trying to decrypt
    console.log(' Attempting to decrypt data:', {
      hasEncrypted: !!encryptedData.encrypted,
      encryptedLength: encryptedData.encrypted?.length || 0,
      hasIv: !!encryptedData.iv,
      ivLength: encryptedData.iv?.length || 0,
      encryptedSample: encryptedData.encrypted?.substring(0, 16) + '...',
      ivSample: encryptedData.iv?.substring(0, 16) + '...'
    });

    setIsLoading(true);
    setError(null);

    try {
      let key = encryptionKey;

      // If we don't have a key yet but we're initialized, retrieve it
      if (!key && isInitialized) {
        const storedData = getStoredEncryptionData();
        if (storedData && storedData.encryptionKey) {
          try {
            // Import the key
            key = await importKeyFromBase64(storedData.encryptionKey);
            setEncryptionKey(key);
          } catch (keyError) {
            console.error('Error importing stored key:', keyError);
            // We'll generate a new key below
          }
        }
      }

      // If we still don't have a key, get one
      if (!key) {
        key = await handleSignMessage();
      }

      // Decrypt the data
      const decryptedData = await decryptWithKey(encryptedData, key);
      return decryptedData;
    } catch (err) {
      console.error('Decryption failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown decryption error';
      setError(errorMessage);
      throw new Error(`Decryption failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey, encryptionKey, isInitialized, handleSignMessage]);

  return {
    isInitialized,
    isLoading,
    error,
    handleSignMessage,
    encryptData: handleEncryptData,
    decryptData: handleDecryptData
  };
}
