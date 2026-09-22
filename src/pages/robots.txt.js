/** @param {import('astro').APIContext} context */
export const GET = ({ site }) => {
  const baseUrl = site ?? new URL('http://localhost:4321');
  const sitemapUrl = new URL('sitemap-index.xml', baseUrl);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
