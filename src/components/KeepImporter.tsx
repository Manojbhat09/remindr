
import React, { useState, useEffect } from 'react';
import { Goal, Note } from '../App';
import keepApiService from '../services/keepApi';
import { useGapi } from '../contexts/GapiContext';

type Importable = Goal | Note;

interface KeepImporterProps<T extends Importable> {
  onImport: (items: Omit<T, 'id' | 'progress' | 'status' | 'tasks' | 'createdAt' | 'updatedAt'>[]) => void;
  onClose: () => void;
  importType: 'goal' | 'note';
}

const KeepImporter = <T extends Importable>({ onImport, onClose, importType }: KeepImporterProps<T>) => {
  const { isGapiInitialized } = useGapi();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isGapiInitialized) return;

    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const signedIn = keepApiService.isUserSignedIn();
        setIsAuthenticated(signedIn);
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    checkAuth();
  }, [isGapiInitialized]);

  const handleAuthClick = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await keepApiService.authenticate();
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setError(errorMessage);
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportClick = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const importedItems = await keepApiService.importFromKeep(importType);
      onImport(importedItems as any);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to import ${importType}s from Google Keep. Please try again.`;
      setError(errorMessage);
      console.error('Import error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal modal-open animate-fade-in">
      <div className="modal-box max-w-md animate-bounce-in">
        <h3 className="font-bold text-2xl mb-6 gradient-text">Import from Google Keep</h3>
        {error && (
          <div className="alert alert-error mb-4 animate-fade-in">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        <div className="space-y-4">
          {!isAuthenticated ? (
            <button
              onClick={handleAuthClick}
              disabled={isLoading || !isGapiInitialized}
              className="btn btn-primary w-full hover-lift hover-glow transition-all-smooth"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <span>🔐</span>
              )}
              {isLoading ? 'Authenticating...' : !isGapiInitialized ? 'Initializing...' : 'Authenticate with Google'}
            </button>
          ) : (
            <button
              onClick={handleImportClick}
              disabled={isLoading}
              className="btn btn-success w-full hover-lift hover-glow transition-all-smooth"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <span>📝</span>
              )}
              {isLoading ? `Importing ${importType}s...` : `Import ${importType === 'goal' ? 'Goals' : 'Notes'} from Keep`}
            </button>
          )}
          
          <button
            onClick={onClose}
            className="btn btn-ghost w-full hover-lift transition-all-smooth"
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default KeepImporter;
