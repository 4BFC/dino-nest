// Shared URL values and comparisons. Docusaurus registers the actual pages.
export const SITE_ROUTES = Object.freeze({
  home: '/',
  license: '/license',
  // Optional page: rename src/pages/_updates.jsx to updates.jsx to enable it.
  updates: '/updates',
});

export function normalizePath(pathname) {
  return pathname.replace(/\/$/, '') || SITE_ROUTES.home;
}

export function isSameRoute(pathname, route) {
  return normalizePath(pathname) === normalizePath(route);
}
