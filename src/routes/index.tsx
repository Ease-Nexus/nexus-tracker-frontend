import { createFileRoute } from '@tanstack/react-router';
import TimerDashboard from '@/pages/timer-dashboard';

export const Route = createFileRoute('/')({
  component: TimerDashboard,
});
