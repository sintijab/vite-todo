export type LinksFunction = () => Array<{ rel: string; href: string; crossOrigin?: string }>;
export interface ErrorBoundaryProps {
  error: unknown;
}
export type Route = {
  LinksFunction: LinksFunction;
  ErrorBoundaryProps: ErrorBoundaryProps;
};