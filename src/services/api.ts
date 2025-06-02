
const API_BASE_URL = 'https://d4507e003c454f5ea575fedfd30f2173.constructor.pro/api';

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
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/structure`);
    
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
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update config: ${response.statusText}`);
    }
    
    return response.json();
  }
}
