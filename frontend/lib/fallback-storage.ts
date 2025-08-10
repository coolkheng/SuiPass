/**
 * Fallback storage system for demo mode
 * Ensures data persistence across browser sessions
 */

export interface FallbackProject {
  id: string;
  name: string;
  description: string;
  status: string;
  environments: Array<{
    id: string;
    name: string;
    project_id: string;
  }>;
  project_members: Array<{
    id: string;
    project_id: string;
    wallet_address: string;
    role: string;
  }>;
  creator_id: string | null;
  created_at: string;
  updated_at: string;
  _isFallback: boolean;
  _fallbackReason?: string;
  _createdAt?: string;
}

export interface FallbackSecret {
  id: string;
  key: string;
  value: string;
  project_id: string;
  environment_id: string;
  created_at: string;
  updated_at: string;
  _isFallback: boolean;
}

const STORAGE_KEYS = {
  PROJECTS: 'suipass_fallback_projects',
  SECRETS: 'suipass_fallback_secrets',
  LAST_SYNC: 'suipass_last_sync'
} as const;

// Project management
export function saveFallbackProject(project: FallbackProject): boolean {
  try {
    const projects = getFallbackProjects();
    projects[project.id] = {
      ...project,
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    console.log('💾 Saved fallback project:', project.id);
    return true;
  } catch (error) {
    console.error('Failed to save fallback project:', error);
    return false;
  }
}

export function getFallbackProjects(): Record<string, FallbackProject> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load fallback projects:', error);
    return {};
  }
}

export function getFallbackProject(projectId: string): FallbackProject | null {
  const projects = getFallbackProjects();
  return projects[projectId] || null;
}

export function deleteFallbackProject(projectId: string): boolean {
  try {
    const projects = getFallbackProjects();
    delete projects[projectId];
    
    // Also delete related secrets
    const secrets = getFallbackSecrets();
    const filteredSecrets: Record<string, FallbackSecret> = {};
    Object.values(secrets).forEach(secret => {
      if (secret.project_id !== projectId) {
        filteredSecrets[secret.id] = secret;
      }
    });
    
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEYS.SECRETS, JSON.stringify(filteredSecrets));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    console.log('🗑️ Deleted fallback project:', projectId);
    return true;
  } catch (error) {
    console.error('Failed to delete fallback project:', error);
    return false;
  }
}

// Secret management
export function saveFallbackSecret(secret: FallbackSecret): boolean {
  try {
    const secrets = getFallbackSecrets();
    secrets[secret.id] = {
      ...secret,
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.SECRETS, JSON.stringify(secrets));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    console.log('💾 Saved fallback secret:', secret.id);
    return true;
  } catch (error) {
    console.error('Failed to save fallback secret:', error);
    return false;
  }
}

export function getFallbackSecrets(): Record<string, FallbackSecret> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SECRETS);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load fallback secrets:', error);
    return {};
  }
}

export function getFallbackSecretsForProject(projectId: string): FallbackSecret[] {
  const secrets = getFallbackSecrets();
  return Object.values(secrets).filter(secret => secret.project_id === projectId);
}

export function getFallbackSecretsForEnvironment(environmentId: string): FallbackSecret[] {
  const secrets = getFallbackSecrets();
  return Object.values(secrets).filter(secret => secret.environment_id === environmentId);
}

export function deleteFallbackSecret(secretId: string): boolean {
  try {
    const secrets = getFallbackSecrets();
    delete secrets[secretId];
    
    localStorage.setItem(STORAGE_KEYS.SECRETS, JSON.stringify(secrets));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    console.log('🗑️ Deleted fallback secret:', secretId);
    return true;
  } catch (error) {
    console.error('Failed to delete fallback secret:', error);
    return false;
  }
}

// Utility functions
export function isFallbackMode(): boolean {
  const projects = getFallbackProjects();
  return Object.keys(projects).length > 0;
}

export function getFallbackStats() {
  const projects = getFallbackProjects();
  const secrets = getFallbackSecrets();
  const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  
  return {
    projectCount: Object.keys(projects).length,
    secretCount: Object.keys(secrets).length,
    lastSync: lastSync ? new Date(lastSync) : null,
    storageSize: new Blob([
      localStorage.getItem(STORAGE_KEYS.PROJECTS) || '',
      localStorage.getItem(STORAGE_KEYS.SECRETS) || ''
    ]).size
  };
}

export function clearFallbackData(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.SECRETS);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    
    console.log('🧹 Cleared all fallback data');
    return true;
  } catch (error) {
    console.error('Failed to clear fallback data:', error);
    return false;
  }
}

// Export data for backup/migration
export function exportFallbackData() {
  return {
    projects: getFallbackProjects(),
    secrets: getFallbackSecrets(),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
}

// Import data from backup
export function importFallbackData(data: ReturnType<typeof exportFallbackData>): boolean {
  try {
    if (data.projects) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
    }
    if (data.secrets) {
      localStorage.setItem(STORAGE_KEYS.SECRETS, JSON.stringify(data.secrets));
    }
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    console.log('📥 Imported fallback data');
    return true;
  } catch (error) {
    console.error('Failed to import fallback data:', error);
    return false;
  }
}
