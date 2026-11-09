import {SITE_ROUTES} from '../app/routes.js';
import sidebarItemsGenerator from './sidebar-items.js';

// Only this starter's documents are registered. Keep content roots explicit.
export const documentInstances = [
  {
    id: 'default',
    label: 'Docnest',
    path: 'documents',
    routeBasePath: SITE_ROUTES.home,
    exclude: ['**/_*/**', '**/_*.{md,mdx}', '**/README.md', '**/AGENTS.md', '**/CLAUDE.md'],
  },
];

export function docsPluginOptions({id, label, ...options}) {
  return {
    sidebarPath: './src/config/sidebars.js',
    sidebarItemsGenerator,
    ...options,
    ...(id === 'default' ? {} : {id}),
  };
}
