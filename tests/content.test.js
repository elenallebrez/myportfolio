import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { featuredProjects, projects, site } from '../src/data/content.js';
import { getTechnologyMeta } from '../src/data/technologies.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(currentDirectory, '..');

assert.equal(projects.length, 8, 'Expected all eight existing projects');
assert.equal(new Set(projects.map(({ slug }) => slug)).size, projects.length, 'Project slugs must be unique');
assert.equal(featuredProjects.length, 6, 'Expected all six existing featured projects');
assert.match(site.contact.email, /@/, 'Existing contact email must be valid');

for (const project of projects) {
  assert.ok(project.name, `Missing name for ${project.slug}`);
  assert.ok(project.description, `Missing description for ${project.slug}`);
  assert.ok(project.summary, `Missing summary for ${project.slug}`);
  assert.ok(project.externalLink?.url, `Missing external link for ${project.slug}`);

  if (project.image) {
    await access(join(projectRoot, 'public', project.image));
  }

  for (const technology of project.technologies) {
    const meta = getTechnologyMeta(technology);
    assert.ok(meta.icon, `Missing icon mapping for ${technology}`);
    await access(join(projectRoot, 'public', meta.icon.slice(1)));
  }
}

const futureTechnology = getTechnologyMeta('Future Technology');
assert.equal(futureTechnology.icon, null, 'Unknown technologies should use the fallback chip');
assert.equal(futureTechnology.initials, 'FT');

await access(join(projectRoot, 'public', 'icons', 'tech', 'ATTRIBUTION.md'));

console.log(`Validated ${projects.length} projects and ${featuredProjects.length} featured entries.`);
