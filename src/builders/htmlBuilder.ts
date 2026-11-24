import { Digest } from "../types/news";

export class HtmlBuilder {
  public static build(digest: Digest): string {
    const dateStr = digest.generatedAt.toLocaleString();

    const articlesHtml = digest.articles
      .map((art, idx) => {
        return `
        <article class="article-card">
          <div class="article-rank">#${idx + 1}</div>
          <div class="article-content">
            <h2 class="article-title">
              <a href="${art.url}" target="_blank" rel="noopener noreferrer">${art.title}</a>
            </h2>
            <div class="article-meta">
              <span class="badge source">${art.source}</span>
              ${art.author ? `<span class="badge author">👤 ${art.author}</span>` : ""}
              ${art.score !== undefined ? `<span class="badge score">⭐ ${art.score}</span>` : ""}
              ${art.commentsCount !== undefined ? `<span class="badge comments">💬 ${art.commentsCount}</span>` : ""}
              <span class="badge date">🕒 ${art.publishedAt.toLocaleDateString()}</span>
            </div>
            ${art.summary ? `<p class="article-summary">${art.summary}</p>` : ""}
          </div>
        </article>
      `;
      })
      .join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${digest.title}</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --border: #334155;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      margin: 0;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1rem;
    }
    h1 {
      font-size: 2.2rem;
      margin: 0 0 0.5rem 0;
      color: #ffffff;
    }
    .header-meta {
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    .fallback-banner {
      background: #78350f;
      color: #fef3c7;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }
    .article-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .article-card:hover {
      transform: translateY(-2px);
      border-color: var(--accent);
    }
    .article-rank {
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--accent);
      min-width: 2rem;
    }
    .article-content {
      flex: 1;
    }
    .article-title {
      font-size: 1.2rem;
      margin: 0 0 0.5rem 0;
    }
    .article-title a {
      color: #f1f5f9;
      text-decoration: none;
    }
    .article-title a:hover {
      color: var(--accent);
      text-decoration: underline;
    }
    .article-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .badge {
      font-size: 0.8rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: #334155;
      color: #cbd5e1;
    }
    .article-summary {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin: 0.75rem 0 0 0;
    }
    footer {
      text-align: center;
      margin-top: 3rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📰 ${digest.title}</h1>
      <div class="header-meta">Generated on ${dateStr}</div>
    </header>
    ${
      digest.isFallback
        ? `<div class="fallback-banner">ℹ️ Generated using offline sample data because the external API was unreachable.</div>`
        : ""
    }
    <main>
      ${articlesHtml}
    </main>
    <footer>
      <p>Generated automatically with News Digest Generator</p>
    </footer>
  </div>
</body>
</html>`;
  }
}

