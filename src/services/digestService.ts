import { HackerNewsApi } from "../api/hackerNews";
import { MarkdownBuilder } from "../builders/markdownBuilder";
import { HtmlBuilder } from "../builders/htmlBuilder";
import { FileWriter } from "../utils/fileWriter";
import { Digest } from "../types/news";

export class DigestService {
  public static async generate(limit = 10): Promise<{ mdPath: string; htmlPath: string; total: number }> {
    console.log("=========================================");
    console.log("   🚀 News Digest Generator Starting...   ");
    console.log("=========================================");

    const { articles, isFallback } = await HackerNewsApi.fetchTopStories(limit);

    const now = new Date();
    const digest: Digest = {
      title: "Daily Tech News Digest",
      generatedAt: now,
      articles,
      isFallback
    };

    console.log(`[DigestService] Building Markdown and HTML digests (${articles.length} articles)...`);
    const markdownContent = MarkdownBuilder.build(digest);
    const htmlContent = HtmlBuilder.build(digest);

    const dateKey = now.toISOString().slice(0, 10);
    const timeKey = now.toTimeString().slice(0, 8).replace(/:/g, "");

    const mdFilename = `digest-${dateKey}-${timeKey}.md`;
    const htmlFilename = `digest-${dateKey}-${timeKey}.html`;

    const mdPath = FileWriter.saveDigest(mdFilename, markdownContent);
    const htmlPath = FileWriter.saveDigest(htmlFilename, htmlContent);

    // Also update digest-latest
    FileWriter.saveDigest("digest-latest.md", markdownContent);
    FileWriter.saveDigest("digest-latest.html", htmlContent);

    console.log(`[DigestService] ✅ Digest files successfully generated!`);
    console.log(` - Markdown: ${mdPath}`);
    console.log(` - HTML:     ${htmlPath}`);
    console.log(` - Latest:   output/digest-latest.md & .html`);
    console.log("=========================================");

    return { mdPath, htmlPath, total: articles.length };
  }
}

