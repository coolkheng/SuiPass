/**
 * Hook for managing projects with fallback support
 * Combines API data with local fallback storage for seamless demo experience
 */

import { useState, useEffect, useCallback } from 'react';
import { getFallbackProjects, getFallbackProject, type FallbackProject } from '@/lib/fallback-storage';

export interface ProjectWithFallback {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
  environments?: Array<{
    id: string;
    name: string;
    project_id: string;
  }>;
  project_members?: Array<{
    id: string;
    project_id: string;
    wallet_address: string;
    role: string;
  }>;
  creator_id?: string | null;
  _isFallback?: boolean;
  _fallbackReason?: string;
}

export function useProjectsWithFallback() {
  const [projects, setProjects] = useState<ProjectWithFallback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let apiProjects: ProjectWithFallback[] = [];
      let apiError: string | null = null;
      
      try {
        // Try to fetch from API first
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/projects`);
        
        if (response.ok) {
          apiProjects = await response.json();
          console.log('✅ Loaded projects from API:', apiProjects.length);
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      } catch (err) {
        apiError = err instanceof Error ? err.message : 'API unavailable';
        console.warn('⚠️ API projects fetch failed:', apiError);
      }
      
      // Always load fallback projects
      const fallbackProjectsMap = getFallbackProjects();
      const fallbackProjects: ProjectWithFallback[] = Object.values(fallbackProjectsMap);
      
      console.log('📂 Loaded fallback projects:', fallbackProjects.length);
      
      // Combine API and fallback projects (avoid duplicates by ID)
      const combinedProjects = new Map<string, ProjectWithFallback>();
      
      // Add API projects first (they take priority)
      apiProjects.forEach(project => {
        combinedProjects.set(project.id, project);
      });
      
      // Add fallback projects that don't conflict with API projects
      fallbackProjects.forEach(project => {
        if (!combinedProjects.has(project.id)) {
          combinedProjects.set(project.id, project);
        }
      });
      
      const allProjects = Array.from(combinedProjects.values())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setProjects(allProjects);
      
      // Set error only if we have no projects at all
      if (allProjects.length === 0 && apiError) {
        setError(apiError);
      }
      
      console.log('🎯 Total projects loaded:', allProjects.length, {
        api: apiProjects.length,
        fallback: fallbackProjects.length
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      console.error('❌ Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const refreshProjects = useCallback(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    error,
    refresh: refreshProjects,
    hasFallbackData: projects.some(p => p._isFallback)
  };
}

export function useProjectWithFallback(projectId: string) {
  const [project, setProject] = useState<ProjectWithFallback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let apiProject: ProjectWithFallback | null = null;
      
      try {
        // Try API first
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/projects/${id}`);
        
        if (response.ok) {
          apiProject = await response.json();
          console.log('✅ Loaded project from API:', id);
        } else if (response.status !== 404) {
          throw new Error(`API error: ${response.status}`);
        }
      } catch (err) {
        console.warn('⚠️ API project fetch failed:', err);
      }
      
      if (apiProject) {
        setProject(apiProject);
      } else {
        // Try fallback storage
        const fallbackProject = getFallbackProject(id);
        
        if (fallbackProject) {
          console.log('📂 Loaded project from fallback:', id);
          setProject(fallbackProject);
        } else {
          setError('Project not found');
        }
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load project';
      setError(errorMessage);
      console.error('❌ Failed to load project:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  const refreshProject = useCallback(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  return {
    project,
    isLoading,
    error,
    refresh: refreshProject
  };
}
