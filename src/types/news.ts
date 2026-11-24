export interface NewsArticle {
  id: string | number;
  title: string;
  url: string;
  source: string;
  author?: string;
  score?: number;
  commentsCount?: number;
  publishedAt: Date;
  summary?: string;
}

export interface Digest {
  title: string;
  generatedAt: Date;
  articles: NewsArticle[];
  isFallback?: boolean;
}

