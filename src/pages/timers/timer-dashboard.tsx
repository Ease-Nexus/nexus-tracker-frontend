import { useTimerManager } from '@/hooks/use-timer-manager';
import { AddTimerDrawer } from '@/pages/timers/components/add-timer-drawer';
import { Counters } from './components';
import { Dashboard } from './components/dashboard';

export interface Timer {
  id: string;
  badgeNumber: string;
  totalMinutes: number;
  remainingTime: number;
  status: 'running' | 'paused' | 'stopped';
  createdAt: Date;
  history: TimerBlock[];
}

export interface TimerBlock {
  start: Date;
  end?: Date;
  elapsed: number;
}

export default function TimerDashboard() {
  const {
    timers,
    isLoaded,
    addTimer,
    updateTimer,
    deleteTimer,
    getTimerStats,
  } = useTimerManager();

  const handleAddTimer = (badgeNumber: string, minutes: number) => {
    console.log(badgeNumber, minutes);
    addTimer(badgeNumber, minutes);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Carregando timers...</p>
        </div>
      </div>
    );
  }

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
            <Counters getTimerStats={getTimerStats} />
          </div>
        </div>
      </header>

      <Dashboard
        timers={timers}
        onUpdateTimer={updateTimer}
        onDeleteTimer={deleteTimer}
      />
    </div>
  );
}
