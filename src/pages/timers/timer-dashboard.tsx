import type { Timer } from '@/domain';
import { useTimersEvents } from '@/hooks/use-timers-events';
import {
  useAddTimerMutation,
  useClearCompletedTimersMutation,
  useDeleteTimerMutation,
  useTimersQuery,
  useUpdateTimerMutation,
} from '@/infrastructure/api/query';
import { AddTimerDrawer } from '@/pages/timers/components/add-timer-drawer';
import { Counters } from './components';
import { Dashboard } from './components/dashboard';

export default function TimerDashboard() {
  const { data: timers, isLoading: isLoadingTimers } = useTimersQuery();
  const { mutate: addTimer } = useAddTimerMutation();
  const { mutate: updateTimer } = useUpdateTimerMutation();
  const { mutate: deleteTimer } = useDeleteTimerMutation();
  const { mutate: clearCompletedTimers } = useClearCompletedTimersMutation();

  useTimersEvents();

  const getTimerStats = (timers: Timer[]) => {
    const active = timers.filter((t) => t.status === 'RUNNING').length;
    const paused = timers.filter((t) => t.status === 'PAUSED').length;
    const stopped = timers.filter((t) =>
      ['CREATED', 'CANCELED'].includes(t.status),
    ).length;
    const completed = timers.filter((t) => t.status === 'COMPLETED').length;
    const total = timers.length;

    const totalTimeMinutes = timers.reduce(
      (sum, timer) => sum + timer.duration / 60,
      0,
    );
    const totalTimeHours = Math.round((totalTimeMinutes / 60) * 10) / 10; // Round to 1 decimal
    const averageTime = total > 0 ? Math.round(totalTimeMinutes / total) : 0;
    const stats = {
      active,
      paused,
      stopped,
      completed,
      total,
      totalTimeHours,
      averageTime,
    };

    return stats;
  };

  if (isLoadingTimers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Carregando timers...</p>
        </div>
      </div>
    );
  }

  if (!timers) {
    return <div>No Data</div>;
  }

  const handleAddTimer = (badgeNumber: string, minutes: number) => {
    addTimer({ badgeNumber, minutes });
  };

  const timerStats = getTimerStats(timers);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <header className="bg-muted/50 flex-1 rounded-xl md:min-h-min">
        <div className="flex p-4 gap-4 flex-col">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Gerenciador de Temporizadores
              </h1>
              <p className="text-sm text-muted-foreground">
                Pista de Patinação - Controle de Crachás
              </p>
            </div>
            <AddTimerDrawer onAddTimer={handleAddTimer} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
            <Counters getTimerStats={() => timerStats} />
          </div>
        </div>
      </header>

      <Dashboard
        timers={timers}
        onUpdateTimer={(id, updates) => updateTimer({ id, updates })}
        onDeleteTimer={(id) => deleteTimer(id)}
        getTimerStats={() => timerStats}
        clearCompletedTimers={clearCompletedTimers}
      />
    </div>
  );
}
