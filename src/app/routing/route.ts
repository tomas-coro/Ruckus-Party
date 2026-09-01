export type Route =
  | { readonly type: 'home' }
  | { readonly type: 'settings' }
  | { readonly type: 'unknown'; readonly raw: string };
