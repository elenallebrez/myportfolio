import cvData from '../../content/cv.json' with { type: 'json' };
import homeData from '../../content/home.json' with { type: 'json' };
import projectDetailsData from '../../content/project-details.json' with { type: 'json' };
import projectListData from '../../content/projects.json' with { type: 'json' };

/** @type {Readonly<Record<string, string>>} */
const slugByLegacyPath = Object.freeze({
  'project/NLP-pipeline-Project.html': 'nlp-pipeline',
  'project/Sevilla-Game.html': 'sevilla-reigns',
  'project/Portfolio-web.html': 'portfolio-website',
  'project/VRP-AI-assignment.html': 'vrp-clustering-genetic-algorithm',
  'project/IISSI-Project.html': 'food-delivery-system',
  'project/Ing-Requisitos.html': 'requirements-engineering',
  'project/Java-Term-Project.html': 'java-term-project',
  'project/Python-Term-Project.html': 'python-term-project',
});

const listByPath = new Map(
  projectListData.proyectos.map((project) => [project.ruta_pagina, project]),
);

const detailsByPath = new Map(
  projectDetailsData.proyectos.map((project) => [project.ruta_pagina, project]),
);

const homeProjects = homeData.secciones_proyectos.flatMap((section) =>
  section.proyectos.map((project) => ({ ...project, section: section.titulo })),
);

const homeByPath = new Map(homeProjects.map((project) => [project.enlace, project]));

/**
 * Converts the original project records into the stable shape consumed by pages.
 * Text remains untouched; only paths and field names are normalized.
 */
/**
 * @param {typeof projectDetailsData.proyectos[number]} project
 * @param {number} index
 */
const normalizeProject = (project, index) => {
  const legacyPath = project.ruta_pagina;
  const listProject = listByPath.get(legacyPath);
  const homeProject = homeByPath.get(legacyPath);
  const slug = slugByLegacyPath[legacyPath];

  if (!slug || !listProject) {
    throw new Error(`Project content is incomplete for ${legacyPath}`);
  }

  return Object.freeze({
    order: index + 1,
    slug,
    legacyPath,
    name: project.nombre,
    listName: listProject.nombre,
    description: project.descripcion_corta,
    listDescription: listProject.descripcion,
    image: project.imagen ? `/${project.imagen}` : null,
    imageAlt: homeProject?.texto_alternativo_imagen ?? null,
    section: homeProject?.section ?? null,
    technologies: project.tecnologias,
    externalLink: project.enlace_externo,
    summary: project.resumen,
    technicalDetails: project.detalles_tecnicos,
    process: project.proceso,
  });
};

export const projects = Object.freeze(
  projectListData.proyectos.map((listProject, index) => {
    const project = detailsByPath.get(listProject.ruta_pagina);

    if (!project) {
      throw new Error(`Project details are missing for ${listProject.ruta_pagina}`);
    }

    return normalizeProject(project, index);
  }),
);

export const featuredProjects = Object.freeze(
  homeProjects
    .map((project) => projects.find((entry) => entry.legacyPath === project.enlace))
    .filter((project) => project !== undefined),
);

export const site = Object.freeze({
  name: homeData.titulo,
  role: 'Software Engineering student',
  introduction: homeData.presentacion,
  contact: homeData.contacto,
});

export const cv = Object.freeze(cvData);

export const navigation = Object.freeze([
  { label: 'Work', href: '/projects/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
]);

/** @param {string} slug */
export const getProject = (slug) =>
  projects.find((project) => project.slug === slug) ?? null;
