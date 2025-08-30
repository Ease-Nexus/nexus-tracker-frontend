import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/other-route')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/other-route"!</div>;
}
