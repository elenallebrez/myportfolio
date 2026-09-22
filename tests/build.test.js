import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { projects } from '../src/data/content.js';

const root = new URL('..', import.meta.url).pathname.replace(/^\/(?:[A-Za-z]:)/, (drive) => drive.slice(1));
const outputDirectory = join(root, 'dist');

for (const route of ['', 'about', 'projects', 'contact', 'thanks']) {
  await access(join(outputDirectory, route, 'index.html'));
}

for (const project of projects) {
  const projectPage = await readFile(
    join(outputDirectory, 'projects', project.slug, 'index.html'),
    'utf8',
  );

  assert.match(projectPage, new RegExp(project.externalLink.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  if (project.image) {
    assert.match(projectPage, /<source srcset="\/img\/.+\.webp" type="image\/webp">/);
  }
}

const contactPage = await readFile(join(outputDirectory, 'contact', 'index.html'), 'utf8');
assert.match(contactPage, /data-netlify="true"/);
assert.match(contactPage, /netlify-honeypot="bot-field"/);
assert.match(contactPage, /name="form-name" value="contact"/);

const redirects = await readFile(join(outputDirectory, '_redirects'), 'utf8');
for (const project of projects) {
  assert.ok(redirects.includes(project.legacyPath), `Missing redirect for ${project.legacyPath}`);
  assert.ok(redirects.includes(`/projects/${project.slug}/`), `Missing destination for ${project.slug}`);
}

console.log(`Validated ${projects.length + 5} generated pages, the Netlify form, and legacy redirects.`);
