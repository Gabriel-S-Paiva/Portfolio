import type { APIContext } from 'astro';

// Generated so the sitemap URL follows SITE_URL instead of a hardcoded domain.
export function GET(context: APIContext) {
  const sitemap = new URL('sitemap-index.xml', context.site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`);
}
