import axios from "axios";
import { NewsArticle } from "../types/news";

interface HnItem {
  id: number;
  title: string;
  url?: string;
  by?: string;
  score?: number;
  descendants?: number;
  time: number;
  type: string;
}

const FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: 101,
    title: "TypeScript 5.x and Modern JavaScript Performance Best Practices",
    url: "https://devblogs.microsoft.com/typescript/",
    source: "Hacker News (Sample/Offline)",
    author: "techlead",
    score: 342,
    commentsCount: 88,
    publishedAt: new Date(),
    summary: "A deep dive into compiler optimizations and execution speeds in modern Node.js environments."
  },
  {
    id: 102,
    title: "Understanding Node.js Native TypeScript Type-Stripping Support",
    url: "https://nodejs.org/en/blog/release/v22.6.0",
    source: "Hacker News (Sample/Offline)",
    author: "node_enthusiast",
    score: 289,
    commentsCount: 64,
    publishedAt: new Date(Date.now() - 3600 * 1000 * 2),
    summary: "Node.js 22 introduces experimental native TypeScript execution without extra compilation steps."
  },
  {
    id: 103,
    title: "AI & Distributed Computing: Building Fast and Scalable Services",
    url: "https://news.ycombinator.com",
    source: "Hacker News (Sample/Offline)",
    author: "clouddev",
    score: 215,
    commentsCount: 42,
    publishedAt: new Date(Date.now() - 3600 * 1000 * 4),
    summary: "Architectures for balancing compute and memory throughput in modern AI-enabled applications."
  },
  {
    id: 104,
    title: "Design Patterns in Modern TypeScript: Builders and Service Layers",
    url: "https://refactoring.guru/design-patterns",
    source: "Hacker News (Sample/Offline)",
    author: "architect_guy",
    score: 198,
    commentsCount: 37,
    publishedAt: new Date(Date.now() - 3600 * 1000 * 6),
    summary: "Structuring robust enterprise TypeScript backends with clean separation of concerns."
  },
  {
    id: 105,
    title: "Clean Code and Automated Testing in Backend Engineering",
    url: "https://martinfowler.com",
    source: "Hacker News (Sample/Offline)",
    author: "qa_expert",
    score: 165,
    commentsCount: 29,
    publishedAt: new Date(Date.now() - 3600 * 1000 * 8),
    summary: "Strategies for high test coverage, reliable CI/CD pipelines, and defensive programming."
  }
];

export class HackerNewsApi {
  private static readonly BASE_URL = "https://hacker-news.firebaseio.com/v0";

  public static async fetchTopStories(limit = 10): Promise<{ articles: NewsArticle[]; isFallback: boolean }> {
    try {
      console.log(`[HackerNewsApi] Connecting to Hacker News API...`);
      const topIdsResponse = await axios.get<number[]>(`${this.BASE_URL}/topstories.json`, {
        timeout: 5000
      });

      const storyIds = (topIdsResponse.data || []).slice(0, limit);
      console.log(`[HackerNewsApi] Retrieved top ${storyIds.length} story IDs. Fetching details...`);

      const promises = storyIds.map(async (id) => {
        try {
          const itemRes = await axios.get<HnItem>(`${this.BASE_URL}/item/${id}.json`, { timeout: 4000 });
          const item = itemRes.data;
          if (!item || item.type !== "story") return null;

          const article: NewsArticle = {
            id: item.id,
            title: item.title,
            url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            source: "Hacker News",
            author: item.by,
            score: item.score,
            commentsCount: item.descendants || 0,
            publishedAt: new Date(item.time * 1000)
          };
          return article;
        } catch {
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validArticles = results.filter((a): a is NewsArticle => a !== null);

      if (validArticles.length > 0) {
        return { articles: validArticles, isFallback: false };
      }
      throw new Error("No valid articles returned from API.");
    } catch (err: any) {
      console.warn(`[HackerNewsApi] Live fetch failed (${err.message}). Using offline sample dataset.`);
      return { articles: FALLBACK_ARTICLES.slice(0, limit), isFallback: true };
    }
  }
}

