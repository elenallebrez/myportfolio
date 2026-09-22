const iconDirectory = '/icons/tech/';

/** @type {Readonly<Record<string, string>>} */
const technologyIcons = Object.freeze({
  Python: 'python.svg',
  OpenAI: 'ai.svg',
  Gemini: 'gemini.svg',
  NumPy: 'numpy.svg',
  'Data Cleaning': 'clean.svg',
  Embeddings: 'network.svg',
  'Cosine Similarity': 'similarity.svg',
  Pygame: 'gamepad.svg',
  JSON: 'json.svg',
  HTML: 'html.svg',
  CSS: 'css.svg',
  'Responsive Design': 'devices.svg',
  Portfolio: 'folder.svg',
  'Scikit-learn': 'scikitlearn.svg',
  Matplotlib: 'chart.svg',
  'Node.js': 'nodejs.svg',
  Express: 'express.svg',
  MariaDB: 'mariadb.svg',
  'React Native': 'react.svg',
  'REST API': 'api.svg',
  'Requirements Engineering': 'clipboard.svg',
  'Use Cases': 'users.svg',
  Specification: 'document.svg',
  'UML Modeling': 'uml.svg',
  Java: 'coffee.svg',
  Collections: 'collection.svg',
  Streams: 'stream.svg',
  OOP: 'oop.svg',
  Namedtuples: 'tuple.svg',
  'Data Visualization': 'chart.svg',
});

/** @param {string} technology */
const createInitials = (technology) => technology
  .split(/[\s.-]+/)
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();

/** @param {string} technology */
export const getTechnologyMeta = (technology) => {
  const icon = technologyIcons[technology];

  return Object.freeze({
    icon: icon ? `${iconDirectory}${icon}` : null,
    initials: icon ? null : createInitials(technology),
  });
};

export const knownTechnologyIcons = Object.freeze(technologyIcons);
