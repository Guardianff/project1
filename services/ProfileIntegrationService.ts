import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  tokenType: string;
}

export interface GitHubData {
  profile: {
    id: number;
    login: string;
    name: string;
    bio: string;
    location: string;
    company: string;
    email: string;
    followers: number;
    following: number;
    publicRepos: number;
    createdAt: string;
  };
  repositories: Array<{
    id: number;
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    watchers: number;
    size: number;
    createdAt: string;
    updatedAt: string;
    topics: string[];
  }>;
  contributions: {
    totalCommits: number;
    currentStreak: number;
    longestStreak: number;
    contributionCalendar: Array<{
      date: string;
      count: number;
    }>;
  };
  languages: Array<{
    name: string;
    percentage: number;
    bytes: number;
  }>;
}

export interface LinkedInData {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    headline: string;
    summary: string;
    location: string;
    industry: string;
    profilePicture: string;
    publicProfileUrl: string;
  };
  experience: Array<{
    id: string;
    title: string;
    companyName: string;
    description: string;
    startDate: string;
    endDate?: string;
    location: string;
    isCurrent: boolean;
  }>;
  education: Array<{
    id: string;
    schoolName: string;
    degreeName: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    grade?: string;
    activities?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    endorsements: number;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    authority: string;
    licenseNumber?: string;
    startDate: string;
    endDate?: string;
    url?: string;
  }>;
}

export interface SyncConflict {
  id: string;
  field: string;
  githubValue: any;
  linkedinValue: any;
  lastGitHubUpdate: string;
  lastLinkedInUpdate: string;
  resolved: boolean;
  resolution?: 'github' | 'linkedin' | 'manual';
  resolvedValue?: any;
}

class ProfileIntegrationService {
  private static instance: ProfileIntegrationService;
  private githubToken: AuthToken | null = null;
  private linkedinToken: AuthToken | null = null;
  private encryptionKey: string = 'profile-integration-key'; // In production, use proper key management

  static getInstance(): ProfileIntegrationService {
    if (!ProfileIntegrationService.instance) {
      ProfileIntegrationService.instance = new ProfileIntegrationService();
    }
    return ProfileIntegrationService.instance;
  }

  // OAuth 2.0 Authentication
  async authenticateGitHub(config: OAuthConfig): Promise<AuthToken> {
    try {
      // In a real implementation, this would handle the OAuth flow
      // For demo purposes, we'll simulate the process
      
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&scope=${config.scope.join(' ')}`;
      
      // Simulate OAuth flow completion
      const mockToken: AuthToken = {
        accessToken: 'github_access_token_' + Date.now(),
        refreshToken: 'github_refresh_token_' + Date.now(),
        expiresAt: Date.now() + (3600 * 1000), // 1 hour
        tokenType: 'Bearer',
      };

      await this.securelyStoreToken('github', mockToken);
      this.githubToken = mockToken;
      
      return mockToken;
    } catch (error) {
      console.error('GitHub authentication failed:', error);
      throw new Error('Failed to authenticate with GitHub');
    }
  }

  async authenticateLinkedIn(config: OAuthConfig): Promise<AuthToken> {
    try {
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${config.clientId}&redirect_uri=${config.redirectUri}&scope=${config.scope.join(' ')}`;
      
      // Simulate OAuth flow completion
      const mockToken: AuthToken = {
        accessToken: 'linkedin_access_token_' + Date.now(),
        refreshToken: 'linkedin_refresh_token_' + Date.now(),
        expiresAt: Date.now() + (3600 * 1000), // 1 hour
        tokenType: 'Bearer',
      };

      await this.securelyStoreToken('linkedin', mockToken);
      this.linkedinToken = mockToken;
      
      return mockToken;
    } catch (error) {
      console.error('LinkedIn authentication failed:', error);
      throw new Error('Failed to authenticate with LinkedIn');
    }
  }

  // Token Management
  private async securelyStoreToken(platform: 'github' | 'linkedin', token: AuthToken): Promise<void> {
    try {
      // In production, use proper encryption
      const encryptedToken = this.encryptData(JSON.stringify(token));
      await AsyncStorage.setItem(`${platform}_token`, encryptedToken);
    } catch (error) {
      console.error(`Failed to store ${platform} token:`, error);
      throw error;
    }
  }

  private async getStoredToken(platform: 'github' | 'linkedin'): Promise<AuthToken | null> {
    try {
      const encryptedToken = await AsyncStorage.getItem(`${platform}_token`);
      if (!encryptedToken) return null;
      
      const decryptedToken = this.decryptData(encryptedToken);
      const token: AuthToken = JSON.parse(decryptedToken);
      
      // Check if token is expired
      if (token.expiresAt <= Date.now()) {
        await this.refreshToken(platform, token);
      }
      
      return token;
    } catch (error) {
      console.error(`Failed to retrieve ${platform} token:`, error);
      return null;
    }
  }

  private async refreshToken(platform: 'github' | 'linkedin', token: AuthToken): Promise<AuthToken> {
    try {
      if (!token.refreshToken) {
        throw new Error('No refresh token available');
      }

      // Simulate token refresh
      const newToken: AuthToken = {
        ...token,
        accessToken: `${platform}_refreshed_token_` + Date.now(),
        expiresAt: Date.now() + (3600 * 1000),
      };

      await this.securelyStoreToken(platform, newToken);
      
      if (platform === 'github') {
        this.githubToken = newToken;
      } else {
        this.linkedinToken = newToken;
      }

      return newToken;
    } catch (error) {
      console.error(`Failed to refresh ${platform} token:`, error);
      throw error;
    }
  }

  // Data Fetching
  async fetchGitHubData(): Promise<GitHubData> {
    try {
      const token = await this.getStoredToken('github');
      if (!token) {
        throw new Error('GitHub not authenticated');
      }

      // In a real implementation, make actual API calls
      // For demo purposes, return mock data
      const mockData: GitHubData = {
        profile: {
          id: 12345,
          login: 'alexjohnson',
          name: 'Alex Johnson',
          bio: 'Full-stack developer passionate about React Native and AI',
          location: 'San Francisco, CA',
          company: 'TechCorp',
          email: 'alex@example.com',
          followers: 245,
          following: 180,
          publicRepos: 42,
          createdAt: '2018-01-15T00:00:00Z',
        },
        repositories: [
          {
            id: 1,
            name: 'react-native-app',
            description: 'A comprehensive React Native application',
            language: 'TypeScript',
            stars: 156,
            forks: 23,
            watchers: 89,
            size: 2048,
            createdAt: '2023-01-15T00:00:00Z',
            updatedAt: '2025-01-10T00:00:00Z',
            topics: ['react-native', 'typescript', 'mobile'],
          },
          {
            id: 2,
            name: 'ai-chatbot',
            description: 'AI-powered chatbot using machine learning',
            language: 'Python',
            stars: 89,
            forks: 12,
            watchers: 45,
            size: 1024,
            createdAt: '2023-06-01T00:00:00Z',
            updatedAt: '2025-01-08T00:00:00Z',
            topics: ['ai', 'python', 'chatbot', 'machine-learning'],
          },
        ],
        contributions: {
          totalCommits: 1247,
          currentStreak: 15,
          longestStreak: 42,
          contributionCalendar: [
            { date: '2025-01-01', count: 5 },
            { date: '2025-01-02', count: 3 },
            { date: '2025-01-03', count: 8 },
          ],
        },
        languages: [
          { name: 'TypeScript', percentage: 45.2, bytes: 125000 },
          { name: 'Python', percentage: 28.7, bytes: 79500 },
          { name: 'JavaScript', percentage: 18.1, bytes: 50100 },
          { name: 'Swift', percentage: 5.0, bytes: 13800 },
          { name: 'Kotlin', percentage: 3.0, bytes: 8300 },
        ],
      };

      await this.cacheData('github', mockData);
      return mockData;
    } catch (error) {
      console.error('Failed to fetch GitHub data:', error);
      throw error;
    }
  }

  async fetchLinkedInData(): Promise<LinkedInData> {
    try {
      const token = await this.getStoredToken('linkedin');
      if (!token) {
        throw new Error('LinkedIn not authenticated');
      }

      // Mock LinkedIn data
      const mockData: LinkedInData = {
        profile: {
          id: 'linkedin_12345',
          firstName: 'Alex',
          lastName: 'Johnson',
          headline: 'Senior Full-Stack Developer | React Native Expert',
          summary: 'Passionate full-stack developer with 5+ years of experience building scalable web and mobile applications.',
          location: 'San Francisco Bay Area',
          industry: 'Computer Software',
          profilePicture: 'https://example.com/profile.jpg',
          publicProfileUrl: 'https://linkedin.com/in/alexjohnson',
        },
        experience: [
          {
            id: 'exp1',
            title: 'Senior Full-Stack Developer',
            companyName: 'TechCorp',
            description: 'Leading mobile app development using React Native and building scalable backend services.',
            startDate: '2022-01-01',
            location: 'San Francisco, CA',
            isCurrent: true,
          },
          {
            id: 'exp2',
            title: 'Frontend Developer',
            companyName: 'StartupXYZ',
            description: 'Built responsive web applications with React and implemented modern UI/UX designs.',
            startDate: '2020-06-01',
            endDate: '2021-12-31',
            location: 'San Francisco, CA',
            isCurrent: false,
          },
        ],
        education: [
          {
            id: 'edu1',
            schoolName: 'Stanford University',
            degreeName: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            startDate: '2016-09-01',
            endDate: '2020-06-01',
            grade: '3.8 GPA',
          },
        ],
        skills: [
          { id: 'skill1', name: 'React Native', endorsements: 45 },
          { id: 'skill2', name: 'TypeScript', endorsements: 38 },
          { id: 'skill3', name: 'Node.js', endorsements: 32 },
          { id: 'skill4', name: 'Python', endorsements: 28 },
          { id: 'skill5', name: 'AWS', endorsements: 25 },
        ],
        certifications: [
          {
            id: 'cert1',
            name: 'AWS Certified Solutions Architect',
            authority: 'Amazon Web Services',
            startDate: '2023-03-15',
            endDate: '2026-03-15',
            url: 'https://aws.amazon.com/certification/',
          },
        ],
      };

      await this.cacheData('linkedin', mockData);
      return mockData;
    } catch (error) {
      console.error('Failed to fetch LinkedIn data:', error);
      throw error;
    }
  }

  // Data Synchronization
  async synchronizeData(selectedFields: { github: string[]; linkedin: string[] }): Promise<{
    success: boolean;
    conflicts: SyncConflict[];
    syncedFields: string[];
  }> {
    try {
      const [githubData, linkedinData] = await Promise.all([
        this.fetchGitHubData(),
        this.fetchLinkedInData(),
      ]);

      const conflicts: SyncConflict[] = [];
      const syncedFields: string[] = [];

      // Detect conflicts in overlapping fields
      const overlappingFields = [
        { field: 'name', githubPath: 'profile.name', linkedinPath: 'profile.firstName,lastName' },
        { field: 'location', githubPath: 'profile.location', linkedinPath: 'profile.location' },
        { field: 'company', githubPath: 'profile.company', linkedinPath: 'experience.0.companyName' },
      ];

      for (const fieldMapping of overlappingFields) {
        const githubValue = this.getNestedValue(githubData, fieldMapping.githubPath);
        const linkedinValue = this.getNestedValue(linkedinData, fieldMapping.linkedinPath);

        if (githubValue && linkedinValue && githubValue !== linkedinValue) {
          conflicts.push({
            id: `conflict_${fieldMapping.field}_${Date.now()}`,
            field: fieldMapping.field,
            githubValue,
            linkedinValue,
            lastGitHubUpdate: new Date().toISOString(),
            lastLinkedInUpdate: new Date().toISOString(),
            resolved: false,
          });
        } else {
          syncedFields.push(fieldMapping.field);
        }
      }

      // Store synchronized data
      await this.storeSynchronizedData({
        github: githubData,
        linkedin: linkedinData,
        lastSync: new Date().toISOString(),
        conflicts,
      });

      return {
        success: true,
        conflicts,
        syncedFields,
      };
    } catch (error) {
      console.error('Data synchronization failed:', error);
      return {
        success: false,
        conflicts: [],
        syncedFields: [],
      };
    }
  }

  // Conflict Resolution
  async resolveConflict(conflictId: string, resolution: 'github' | 'linkedin' | 'manual', manualValue?: any): Promise<void> {
    try {
      const conflicts = await this.getStoredConflicts();
      const conflictIndex = conflicts.findIndex(c => c.id === conflictId);
      
      if (conflictIndex === -1) {
        throw new Error('Conflict not found');
      }

      const conflict = conflicts[conflictIndex];
      conflict.resolved = true;
      conflict.resolution = resolution;

      if (resolution === 'manual' && manualValue !== undefined) {
        conflict.resolvedValue = manualValue;
      } else if (resolution === 'github') {
        conflict.resolvedValue = conflict.githubValue;
      } else if (resolution === 'linkedin') {
        conflict.resolvedValue = conflict.linkedinValue;
      }

      conflicts[conflictIndex] = conflict;
      await this.storeConflicts(conflicts);
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
      throw error;
    }
  }

  // Data Caching and Storage
  private async cacheData(platform: 'github' | 'linkedin', data: any): Promise<void> {
    try {
      const encryptedData = this.encryptData(JSON.stringify(data));
      await AsyncStorage.setItem(`${platform}_data`, encryptedData);
      await AsyncStorage.setItem(`${platform}_data_timestamp`, Date.now().toString());
    } catch (error) {
      console.error(`Failed to cache ${platform} data:`, error);
    }
  }

  private async getCachedData(platform: 'github' | 'linkedin'): Promise<any | null> {
    try {
      const encryptedData = await AsyncStorage.getItem(`${platform}_data`);
      const timestamp = await AsyncStorage.getItem(`${platform}_data_timestamp`);
      
      if (!encryptedData || !timestamp) return null;
      
      // Check if cache is still valid (24 hours)
      const cacheAge = Date.now() - parseInt(timestamp);
      if (cacheAge > 24 * 60 * 60 * 1000) return null;
      
      const decryptedData = this.decryptData(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error(`Failed to get cached ${platform} data:`, error);
      return null;
    }
  }

  private async storeSynchronizedData(data: any): Promise<void> {
    try {
      const encryptedData = this.encryptData(JSON.stringify(data));
      await AsyncStorage.setItem('synchronized_data', encryptedData);
    } catch (error) {
      console.error('Failed to store synchronized data:', error);
    }
  }

  private async getStoredConflicts(): Promise<SyncConflict[]> {
    try {
      const encryptedConflicts = await AsyncStorage.getItem('sync_conflicts');
      if (!encryptedConflicts) return [];
      
      const decryptedConflicts = this.decryptData(encryptedConflicts);
      return JSON.parse(decryptedConflicts);
    } catch (error) {
      console.error('Failed to get stored conflicts:', error);
      return [];
    }
  }

  private async storeConflicts(conflicts: SyncConflict[]): Promise<void> {
    try {
      const encryptedConflicts = this.encryptData(JSON.stringify(conflicts));
      await AsyncStorage.setItem('sync_conflicts', encryptedConflicts);
    } catch (error) {
      console.error('Failed to store conflicts:', error);
    }
  }

  // Utility Methods
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      if (key.includes(',')) {
        // Handle combined fields like "firstName,lastName"
        const keys = key.split(',');
        return keys.map(k => current?.[k]).filter(Boolean).join(' ');
      }
      return current?.[key];
    }, obj);
  }

  private encryptData(data: string): string {
    // In production, use proper encryption like AES
    // For demo purposes, use simple base64 encoding
    return Buffer.from(data).toString('base64');
  }

  private decryptData(encryptedData: string): string {
    // In production, use proper decryption
    // For demo purposes, use simple base64 decoding
    return Buffer.from(encryptedData, 'base64').toString();
  }

  // Rate Limiting
  private async checkRateLimit(platform: 'github' | 'linkedin'): Promise<boolean> {
    try {
      const lastRequest = await AsyncStorage.getItem(`${platform}_last_request`);
      const requestCount = await AsyncStorage.getItem(`${platform}_request_count`);
      
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      if (!lastRequest || (now - parseInt(lastRequest)) > oneHour) {
        // Reset rate limit window
        await AsyncStorage.setItem(`${platform}_last_request`, now.toString());
        await AsyncStorage.setItem(`${platform}_request_count`, '1');
        return true;
      }
      
      const count = parseInt(requestCount || '0');
      const limit = platform === 'github' ? 5000 : 500; // GitHub: 5000/hour, LinkedIn: 500/hour
      
      if (count >= limit) {
        return false;
      }
      
      await AsyncStorage.setItem(`${platform}_request_count`, (count + 1).toString());
      return true;
    } catch (error) {
      console.error(`Rate limit check failed for ${platform}:`, error);
      return false;
    }
  }

  // Cleanup and Security
  async revokeAccess(platform: 'github' | 'linkedin'): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${platform}_token`);
      await AsyncStorage.removeItem(`${platform}_data`);
      await AsyncStorage.removeItem(`${platform}_data_timestamp`);
      
      if (platform === 'github') {
        this.githubToken = null;
      } else {
        this.linkedinToken = null;
      }
    } catch (error) {
      console.error(`Failed to revoke ${platform} access:`, error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      const keys = [
        'github_token', 'linkedin_token',
        'github_data', 'linkedin_data',
        'github_data_timestamp', 'linkedin_data_timestamp',
        'synchronized_data', 'sync_conflicts',
        'github_last_request', 'linkedin_last_request',
        'github_request_count', 'linkedin_request_count',
      ];
      
      await AsyncStorage.multiRemove(keys);
      this.githubToken = null;
      this.linkedinToken = null;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }
}

export default ProfileIntegrationService;