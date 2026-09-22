# Elena Fernández-Llebrez — Portfolio

Personal Software Engineering portfolio built with Astro and deployed on Netlify.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm test
```

The test suite validates the source content, all generated project pages, legacy redirects, and the Netlify contact form markup.

## Deployment

Netlify uses the configuration in `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`
- Contact submissions: Netlify Forms (`contact`)

The production URL is read from Netlify's `URL` environment variable during the build so canonical links, `robots.txt`, and the sitemap use the deployed domain.
