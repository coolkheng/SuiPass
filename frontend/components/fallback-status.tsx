/**
 * Demo mode indicator and fallback data management
 */

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Download, Trash2, RefreshCw } from 'lucide-react';
import { 
  getFallbackStats, 
  exportFallbackData, 
  clearFallbackData, 
  isFallbackMode 
} from '@/lib/fallback-storage';
import { toast } from '@/hooks/use-toast';

interface FallbackStatusProps {
  onRefresh?: () => void;
  className?: string;
}

export function FallbackStatus({ onRefresh, className }: FallbackStatusProps) {
  const [isInFallbackMode, setIsInFallbackMode] = React.useState(false);
  const [stats, setStats] = React.useState<ReturnType<typeof getFallbackStats> | null>(null);

  React.useEffect(() => {
    const checkFallbackMode = () => {
      const inFallbackMode = isFallbackMode();
      setIsInFallbackMode(inFallbackMode);
      
      if (inFallbackMode) {
        setStats(getFallbackStats());
      }
    };

    checkFallbackMode();
    
    // Check periodically for changes
    const interval = setInterval(checkFallbackMode, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExportData = () => {
    try {
      const data = exportFallbackData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `suipass-demo-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported",
        description: "Your demo data has been downloaded as a JSON file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export demo data",
        variant: "destructive",
      });
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all demo data? This cannot be undone.')) {
      try {
        clearFallbackData();
        setIsInFallbackMode(false);
        setStats(null);
        
        toast({
          title: "Data cleared",
          description: "All demo data has been removed",
        });
        
        onRefresh?.();
      } catch (error) {
        toast({
          title: "Clear failed",
          description: "Failed to clear demo data",
          variant: "destructive",
        });
      }
    }
  };

  if (!isInFallbackMode || !stats) {
    return null;
  }

  return (
    <div className={className}>
      <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <Info className="h-4 w-4 text-orange-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-orange-800 dark:text-orange-200">
              <strong>Demo Mode:</strong> Your data is stored locally in your browser.
            </span>
            <Badge variant="outline" className="text-xs">
              {stats.projectCount} projects, {stats.secretCount} secrets
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="h-8 px-2 text-orange-700 hover:text-orange-900"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportData}
              className="h-8 px-2 text-orange-700 hover:text-orange-900"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearData}
              className="h-8 px-2 text-orange-700 hover:text-orange-900"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface FallbackProjectBadgeProps {
  isFallback?: boolean;
  reason?: string;
  className?: string;
}

export function FallbackProjectBadge({ isFallback, reason, className }: FallbackProjectBadgeProps) {
  if (!isFallback) return null;

  return (
    <Badge 
      variant="outline" 
      className={`text-xs text-orange-600 border-orange-300 ${className}`}
      title={reason || 'Created in demo mode'}
    >
      Demo
    </Badge>
  );
}

interface FallbackDataManagerProps {
  children: React.ReactNode;
  onDataChange?: () => void;
}

export function FallbackDataManager({ children, onDataChange }: FallbackDataManagerProps) {
  React.useEffect(() => {
    // Listen for storage changes to refresh data when fallback data is modified
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('suipass_fallback_')) {
        onDataChange?.();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [onDataChange]);

  return <>{children}</>;
}
