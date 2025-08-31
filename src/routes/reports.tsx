import { createFileRoute } from '@tanstack/react-router';
import { useTimerManager } from '@/hooks/use-timer-manager';
import { ReportsScreen } from '@/pages';

export const Route = createFileRoute('/reports')({
  component: RouteComponent,
});

function RouteComponent() {
  const { getCompletedTimers } = useTimerManager();
  return <ReportsScreen completedTimers={getCompletedTimers()} />;
}
