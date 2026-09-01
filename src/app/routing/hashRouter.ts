import type { Route } from './route';

export function parseHash(hash: string): Route {
  if (hash === '' || hash === '#/' || hash === '#') return { type: 'home' };
  if (hash === '#/settings') return { type: 'settings' };
  return { type: 'unknown', raw: hash };
}

export function routeToHash(route: Exclude<Route, { type: 'unknown' }>): string {
  switch (route.type) {
    case 'home':
      return '#/';
    case 'settings':
      return '#/settings';
  }
}

export function navigate(route: Exclude<Route, { type: 'unknown' }>): void {
  window.location.hash = routeToHash(route);
}
