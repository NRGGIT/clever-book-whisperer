
const getApiBaseUrl = (): string => {
  // First try Vite environment variable (build time)
  if ((import.meta as any).env?.VITE_API_BASE_URL) {
    return (import.meta as any).env.VITE_API_BASE_URL;
  }
  
  // Then try runtime configuration (Docker)
  if (typeof window !== 'undefined' && (window as any).ENV?.VITE_API_BASE_URL) {
    return (window as any).ENV.VITE_API_BASE_URL;
  }
  
  // Fallback to default
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

interface ModelInfo {
  name: string;
  alias: string;
  hostedBy: string;
}

export class ApiService {
  static async uploadEpub(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('epub', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  static async getAllBooks(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/books`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  static async deleteBook(bookId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete book: ${response.statusText}`);
    }
  }
  
  static async getBookStructure(bookId: string): Promise<any> {
    // Use the nested structure endpoint
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/structure-nested`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch book structure: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  static async getChapterContent(bookId: string, chapterId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/content/${chapterId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch chapter content: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getFullChapterContent(bookId: string, chapterId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/full-content/${chapterId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch full chapter content: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  static async summarizeContent(request: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Summarization failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  static async getConfig(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/config`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  static async updateConfig(config: any): Promise<any> {
    console.log('Updating config with data:', config);
    
    // Only send the fields that the backend expects
    const backendConfig = {
      baseUrl: config.baseUrl,
      knowledgeModelId: config.knowledgeModelId,
      apiKey: config.apiKey,
      modelName: config.modelName, // This should be the alias
      prompt: config.prompt,
      defaultRatio: config.defaultRatio
    };
    
    console.log('Sending to backend:', backendConfig);
    
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendConfig),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Config update failed:', response.status, errorText);
      throw new Error(`Failed to update config: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  static async getAvailableModels(): Promise<ModelInfo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/models`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      
      const models: ModelInfo[] = await response.json();
      
      // Sort by name for consistent display
      return models.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Failed to fetch available models:', error);
      throw error;
    }
  }
}
