export type LinksFunction = () => Array<{ rel: string; href: string; crossOrigin?: string }>;
export interface ErrorBoundaryProps {
  error: unknown;
}
export interface ActionArgs {
  request: Request;
  params?: Record<string, string>;
}