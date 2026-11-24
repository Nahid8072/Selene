import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * SEO files for the public landing page.
 *
 * Set SITE_URL (for example `SITE_URL=https://selene.example npm run build`) once the official landing page URL
 * exists. With it, the build adds the canonical URL, absolute Open Graph URLs, and sitemap.xml. Without it, those
 * are left out instead of pointing at a placeholder.
 */
function seo(siteUrl: string | undefined): Plugin {
  const base = siteUrl?.replace(/\/+$/, '')
  return {
    name: 'selene-seo',
    transformIndexHtml(html) {
      if (!base) return html
      return html
        .replaceAll('content="/og-image.png"', `content="${base}/og-image.png"`)
        .replace(
          '<meta property="og:type"',
          `<link rel="canonical" href="${base}/" />\n    <meta property="og:url" content="${base}/" />\n    <meta property="og:type"`,
        )
        .replaceAll('"@id": "#organization"', `"@id": "${base}/#organization"`)
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /']
      if (base) robots.push('', `Sitemap: ${base}/sitemap.xml`)
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` })
      if (base) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${base}/</loc>\n  </url>\n</urlset>\n`,
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), seo(env.SITE_URL || undefined)],
  }
})
