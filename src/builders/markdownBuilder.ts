import { Digest } from "../types/news";

export class MarkdownBuilder {
  public static build(digest: Digest): string {
    const lines: string[] = [];
    const dateStr = digest.generatedAt.toLocaleString();

    lines.push(`# 📰 ${digest.title}`);
    lines.push(`*Generated on: ${dateStr}*`);
    if (digest.isFallback) {
      lines.push(`> ℹ️ *Note: Generated using offline sample data because the external API was unreachable.*`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");

    digest.articles.forEach((art, idx) => {
      lines.push(`### ${idx + 1}. [${art.title}](${art.url})`);
      const meta: string[] = [];
      if (art.source) meta.push(`**Source:** ${art.source}`);
      if (art.author) meta.push(`**Author:** ${art.author}`);
      if (art.score !== undefined) meta.push(`⭐ **Score:** ${art.score}`);
      if (art.commentsCount !== undefined) meta.push(`💬 **Comments:** ${art.commentsCount}`);
      meta.push(`🕒 **Published:** ${art.publishedAt.toLocaleDateString()}`);

      lines.push(meta.join(" | "));
      if (art.summary) {
        lines.push(`\n> ${art.summary}`);
      }
      lines.push("");
    });

    lines.push("---");
    lines.push(`*Total Stories in Digest: ${digest.articles.length}*`);
    return lines.join("\n");
  }
}

