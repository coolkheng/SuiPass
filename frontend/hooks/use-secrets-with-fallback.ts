/**
 * Hook for managing secrets with fallback support
 * Combines API data with local fallback storage for seamless demo experience
 */

import { useState, useEffect, useCallback } from 'react';
import { getFallbackSecrets, getFallbackSecretsForProject, type FallbackSecret } from '@/lib/fallback-storage';

export interface SecretWithFallback {
  id: string;
  key: string;
  value?: string; // May be encrypted or hidden
  project_id: string;
  environment_id: string;
  created_at: string;
  updated_at: string;
  _isFallback?: boolean;
}

export function useSecretsWithFallback(projectId?: string) {
  const [secrets, setSecrets] = useState<SecretWithFallback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSecrets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let apiSecrets: SecretWithFallback[] = [];
      let apiError: string | null = null;
      
      try {
        // Try to fetch from API first
        const url = projectId 
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/projects/${projectId}/secrets`
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/secrets`;
          
        const response = await fetch(url);
        
        if (response.ok) {
          apiSecrets = await response.json();
          console.log('✅ Loaded secrets from API:', apiSecrets.length);
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      } catch (err) {
        apiError = err instanceof Error ? err.message : 'API unavailable';
        console.warn('⚠️ API secrets fetch failed:', apiError);
      }
      
      // Always load fallback secrets
      const fallbackSecrets: SecretWithFallback[] = projectId 
        ? getFallbackSecretsForProject(projectId)
        : Object.values(getFallbackSecrets());
      
      console.log('📂 Loaded fallback secrets:', fallbackSecrets.length);
      
      // Combine API and fallback secrets (avoid duplicates by ID)
      const combinedSecrets = new Map<string, SecretWithFallback>();
      
      // Add API secrets first (they take priority)
      apiSecrets.forEach(secret => {
        combinedSecrets.set(secret.id, secret);
      });
      
      // Add fallback secrets that don't conflict with API secrets
      fallbackSecrets.forEach(secret => {
        if (!combinedSecrets.has(secret.id)) {
          combinedSecrets.set(secret.id, secret);
        }
      });
      
      const allSecrets = Array.from(combinedSecrets.values())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setSecrets(allSecrets);
      
      // Set error only if we have no secrets at all
      if (allSecrets.length === 0 && apiError) {
        setError(apiError);
      }
      
      console.log('🎯 Total secrets loaded:', allSecrets.length, {
        api: apiSecrets.length,
        fallback: fallbackSecrets.length
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load secrets';
      setError(errorMessage);
      console.error('❌ Failed to load secrets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadSecrets();
  }, [loadSecrets]);

  const refreshSecrets = useCallback(() => {
    loadSecrets();
  }, [loadSecrets]);

  return {
    secrets,
    isLoading,
    error,
    refresh: refreshSecrets,
    hasFallbackData: secrets.some(s => s._isFallback)
  };
}

export function useSecretsForEnvironment(projectId: string, environmentId: string) {
  const { secrets, isLoading, error, refresh, hasFallbackData } = useSecretsWithFallback(projectId);
  
  const environmentSecrets = secrets.filter(secret => secret.environment_id === environmentId);
  
  return {
    secrets: environmentSecrets,
    isLoading,
    error,
    refresh,
    hasFallbackData
  };
}
