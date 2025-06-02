
export interface EpubStructure {
  id: string;
  title: string;
  author: string;
  chapters: Chapter[];
  images: ImageAsset[];
  metadata: EpubMetadata;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  href: string;
  children: Chapter[];
}

export interface ImageAsset {
  id: string;
  href: string;
  mediaType: string;
}

export interface EpubMetadata {
  title: string;
  author?: string;
  language?: string;
  description?: string;
  publisher?: string;
  publishedDate?: string;
  coverImage?: string;
}

export interface SummarizeRequest {
  content: string;
  images?: string[];
  ratio: number;
  customPrompt?: string;
  language?: string;
}

export interface SummarizeResponse {
  summary: string;
  originalTokens: number;
  summaryTokens: number;
  actualRatio: number;
}

export interface BookListItem {
  id: string;
  title: string;
  author?: string;
  metadata: EpubMetadata;
  chapterCount: number;
  uploadDate: Date;
}

export interface AppConfig {
  openaiApiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
}
