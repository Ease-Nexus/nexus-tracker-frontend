import { createFileRoute } from '@tanstack/react-router';
import { ReportsScreen } from '@/pages';

export const Route = createFileRoute('/reports')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReportsScreen completedTimers={[]} />;
}
