import { gapi } from 'gapi-script';
import { Note } from '../App';

// Declare global gapi for TypeScript
declare global {
  interface Window {
    gapi: any;
  }
}

export interface KeepNote {
  id: string;
  title: string;
  body?: {
    text?: string;
  };
  listContent?: Array<{
    text?: string;
    checked?: boolean;
  }>;
  createdTime: string;
  modifiedTime: string;
}

export interface KeepGoalData {
  title: string;
  description: string;
  targetDate: Date;
  smartCriteria: {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
  };
}

class KeepApiService {
  private clientId: string;
  private apiKey: string;
  private discoveryDocs: string[];
  private scopes: string;
  private isInitialized: boolean = false;

  constructor() {
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
    this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
    this.discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/keep/v1/rest'];
    this.scopes = 'https://www.googleapis.com/auth/keep.readonly';
  }

  async authenticate(): Promise<boolean> {
    try {
      // Check if auth2 is available
      if (!gapi.auth2) {
        throw new Error('Google Auth2 not available');
      }
      
      const authInstance = gapi.auth2.getAuthInstance();
      
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }
      
      return authInstance.isSignedIn.get();
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fetchNotes(): Promise<KeepNote[]> {
    try {
      if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        throw new Error('User not authenticated');
      }

      const response = await gapi.client.keep.notes.list({
        pageSize: 100, // Adjust as needed
      });

      return response.result.notes || [];
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      throw new Error('Failed to fetch notes from Google Keep');
    }
  }

  transformNoteToGoal(note: KeepNote): KeepGoalData {
    // Extract text content from note body or list items
    let description = '';
    
    if (note.body?.text) {
      description = note.body.text;
    } else if (note.listContent && note.listContent.length > 0) {
      description = note.listContent
        .map(item => `${item.checked ? '☑' : '☐'} ${item.text || ''}`)
        .join('\n');
    }

    // Generate SMART criteria based on note content
    const smartCriteria = this.generateSmartCriteria(note.title, description);

    return {
      title: note.title || 'Untitled Goal',
      description: description || 'No description provided',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      smartCriteria,
    };
  }

  private generateSmartCriteria(title: string, description: string): {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
  } {
    const content = `${title} ${description}`.toLowerCase();
    
    // Simple heuristics to generate SMART criteria
    const specific = title || 'Complete the specified task';
    const measurable = this.extractMeasurableCriteria(content);
    const achievable = this.extractAchievableCriteria(content);
    const relevant = this.extractRelevantCriteria(content);
    const timeBound = this.extractTimeBoundCriteria(content);

    return {
      specific,
      measurable,
      achievable,
      relevant,
      timeBound,
    };
  }

  private extractMeasurableCriteria(content: string): string {
    if (content.includes('complete') || content.includes('finish')) {
      return 'Task completion status';
    }
    if (content.includes('number') || content.includes('count')) {
      return 'Quantifiable outcome';
    }
    return 'Trackable progress indicators';
  }

  private extractAchievableCriteria(content: string): string {
    if (content.includes('small') || content.includes('simple')) {
      return 'Realistic and manageable';
    }
    if (content.includes('step') || content.includes('phase')) {
      return 'Broken down into steps';
    }
    return 'Within current capabilities';
  }

  private extractRelevantCriteria(content: string): string {
    if (content.includes('goal') || content.includes('objective')) {
      return 'Aligns with overall objectives';
    }
    if (content.includes('important') || content.includes('priority')) {
      return 'High priority item';
    }
    return 'Contributes to larger goals';
  }

  private extractTimeBoundCriteria(content: string): string {
    if (content.includes('today') || content.includes('now')) {
      return 'Immediate action required';
    }
    if (content.includes('week') || content.includes('month')) {
      return 'Within specified timeframe';
    }
    return '30-day completion target';
  }

  transformKeepNoteToAppNote(note: KeepNote): Omit<Note, 'id' | 'createdAt' | 'updatedAt'> {
    let content = '';
    if (note.body?.text) {
      content = note.body.text;
    } else if (note.listContent && note.listContent.length > 0) {
      content = note.listContent
        .map(item => `${item.checked ? '☑' : '☐'} ${item.text || ''}`)
        .join('\n');
    }

    return {
      title: note.title || 'Untitled Note',
      content: content,
      color: '#ffffff', // Default color
      isPinned: false, // Default value
      tags: [], // Default value
    };
  }

  async importFromKeep(type: 'goal' | 'note'): Promise<KeepGoalData[] | Omit<Note, 'id' | 'createdAt' | 'updatedAt'>[]> {
    try {
      await this.authenticate();
      const notes = await this.fetchNotes();

      if (type === 'goal') {
        const potentialGoals = notes.filter(note =>
          note.title &&
          (note.body?.text || (note.listContent && note.listContent.length > 0))
        );
        return potentialGoals.map(note => this.transformNoteToGoal(note));
      } else {
        return notes.map(note => this.transformKeepNoteToAppNote(note));
      }
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }

  isUserSignedIn(): boolean {
    try {
      return gapi.auth2.getAuthInstance().isSignedIn.get();
    } catch {
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        await authInstance.signOut();
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }
}

export const keepApiService = new KeepApiService();
export default keepApiService;
