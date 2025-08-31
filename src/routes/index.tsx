import { createFileRoute } from '@tanstack/react-router';
import TimerDashboard from '@/pages/timers/timer-dashboard';

export const Route = createFileRoute('/')({
  component: TimerDashboard,
});
