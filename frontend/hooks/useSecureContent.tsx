// src/hooks/useSecureContent.tsx - React hook to manage secure content workflow (encryption & decryption)
import { useState, useEffect, useCallback } from 'react';
// Note: These imports may need adjustment based on actual @mysten/dapp-kit package structure
// import { useCurrentWallet, useSignPersonalMessage, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getSessionKeyForUser } from '@/lib/secure-store.service';
import { sealDecrypt, initSessionKey } from '@/lib/seal.client';
import { walrusReadBlob } from '@/lib/walrus.client';
import { createClient } from '@supabase/supabase-js';

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '') : null;

interface SecretMetadata {
  id: string;
  name: string;
  blobId: string;
}

export function useSecureContent(projectId: string, environmentId?: string) {
  // TODO: Uncomment when @mysten/dapp-kit is properly configured
  // const { currentWallet } = useCurrentWallet();
  // const signPersonalMessage = useSignPersonalMessage();
  // const signAndExecute = useSignAndExecuteTransaction(); // for possibly executing add_member or others if needed

  // Mock wallet for now
  const currentWallet = { accounts: [{ address: '0x1234567890abcdef' }] };
  const signPersonalMessage = { mutateAsync: async ({ message }: { message: string }) => ({ signature: 'mock_signature' }) };

  const [secrets, setSecrets] = useState<SecretMetadata[]>([]);
  const [sessionKey, setSessionKey] = useState<import('@mysten/seal').SessionKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing secrets metadata for this project/environment
  useEffect(() => {
    const fetchSecrets = async () => {
      if (!projectId || !supabase) return;
      setLoading(true);
      const { data, error } = await supabase.from('secrets')
        .select('id, name, blob_id')
        .eq('project_id', projectId)
        .eq('environment_id', environmentId || null);
      if (error) {
        console.error('Error fetching secrets list:', error);
        setError('Failed to load secrets');
      } else if (data) {
        setSecrets(data.map(rec => ({ id: rec.id, name: rec.name, blobId: rec.blob_id })));
      }
      setLoading(false);
    };
    fetchSecrets();
  }, [projectId, environmentId]);

  // Initialize a Seal SessionKey for this user and policy package when the wallet is connected
  useEffect(() => {
    const setupSession = async () => {
      if (!currentWallet?.accounts?.[0]?.address) return;
      try {
        // Assume the policy package ID is set in env (NEXT_PUBLIC_POLICY_PACKAGE_ID)
        const packageId = process.env.NEXT_PUBLIC_POLICY_PACKAGE_ID || '';
        const address = currentWallet.accounts[0].address;
        // Create SessionKey without signer, then ask user to sign personal message
        const sk = await initSessionKey(address, packageId, 10);
        const message = sk.getPersonalMessage();
        // Request user signature for session key
        const sigResult = await signPersonalMessage.mutateAsync({ message });
        if (sigResult.signature) {
          sk.setPersonalMessageSignature(sigResult.signature);
          setSessionKey(sk);
        } else {
          console.warn('Session key signature was not obtained');
        }
      } catch (err) {
        console.error('Failed to initialize session key:', err);
      }
    };
    setupSession();
  }, [currentWallet, signPersonalMessage]);

  // Encrypt and upload a new secret
  const addSecret = useCallback(async (name: string, plaintext: string) => {
    if (!currentWallet?.accounts?.[0]?.address) {
      throw new Error('No wallet connected');
    }
    setLoading(true);
    setError(null);
    try {
      // Call the API to handle encryption & storage (the API will encrypt and store securely)
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: currentWallet.accounts[0].address, projectId, environmentId, name, plaintext })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
      // Update local secrets list
      const newSecret: SecretMetadata = { id: result.secretId, name, blobId: result.blobId };
      setSecrets(prev => [...prev, newSecret]);
    } catch (err: any) {
      console.error('Error adding secret:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, environmentId, currentWallet]);

  // Fetch and decrypt a secret's value
  const readSecret = useCallback(async (secret: SecretMetadata): Promise<string | null> => {
    if (!sessionKey || !currentWallet?.accounts?.[0]?.address) {
      setError('Not authenticated or session not initialized');
      return null;
    }
    try {
      // Fetch encrypted data from API (or directly from Walrus)
      const res = await fetch(`/api/read?secretId=${secret.id}&walletAddress=${currentWallet.accounts[0].address}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch secret data');
      }
      const encryptedBase64 = data.encryptedData;
      const encryptedBytes = Uint8Array.from(Buffer.from(encryptedBase64, 'base64'));
      // Decrypt using Seal
      const packageId = process.env.NEXT_PUBLIC_POLICY_PACKAGE_ID || '';
      // Note: We assume the policy object ID is known via project context (not passed here explicitly).
      // We can retrieve the policy object ID via an API or include it in project metadata.
      // For demonstration, we refetch project allowlist_id:
      let policyObjectId = '';
      if (supabase) {
        const { data: proj } = await supabase.from('projects').select('allowlist_id').eq('id', projectId).single();
        policyObjectId = proj?.allowlist_id || '';
      }
      if (!policyObjectId) {
        throw new Error('Policy object ID not found for decryption');
      }
      const decryptedBytes = await sealDecrypt(packageId, policyObjectId, encryptedBytes, sessionKey);
      const plaintext = new TextDecoder().decode(decryptedBytes);
      return plaintext;
    } catch (err: any) {
      console.error('Error decrypting secret:', err);
      setError(err.message || 'Decryption failed');
      return null;
    }
  }, [sessionKey, projectId, currentWallet]);

  return {
    secrets,
    loading,
    error,
    addSecret,
    readSecret
  };
}
