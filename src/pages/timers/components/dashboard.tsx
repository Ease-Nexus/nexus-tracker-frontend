import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Timer } from '@/domain';
import { TimerCard } from './card';
import { Dialog } from './dialog';

interface TimerDashboardProps {
  timers: Timer[];
  onUpdateTimer: (id: string, updates: Partial<Timer>) => void;
  onDeleteTimer: (id: string) => void;
  getTimerStats: () => {
    active: number;
    paused: number;
    stopped: number;
    completed: number;
    total: number;
    totalTimeHours: number;
    averageTime: number;
  };
  clearCompletedTimers: () => void;
}

export function Dashboard({
  timers,
  onUpdateTimer,
  onDeleteTimer,
  getTimerStats,
  clearCompletedTimers,
}: TimerDashboardProps) {
  if (timers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>clock icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhum timer ativo
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Clique em "Novo Timer" para adicionar o primeiro temporizador de
          crachá.
        </p>
      </div>
    );
  }
  const { completed } = getTimerStats();

  const runningTimers = timers.filter((timer) => timer.status === 'RUNNING');
  const completedTimers = timers.filter(
    (timer) =>
      ['COMPLETED', 'CANCELLED'].includes(timer.status) &&
      timer.elapsed >= timer.duration,
  );
  const stoppedTimers = timers.filter((timer) =>
    ['PAUSED'].includes(timer.status),
  );

  return (
    <Tabs className="gap-4" defaultValue="all">
      <div className="flex items-center justify-between">
        <TabsList className="">
          <TabsTrigger className="px-4" value="all">
            Todos
          </TabsTrigger>
          <TabsTrigger className="px-4" value="running">
            Em execução
          </TabsTrigger>
          <TabsTrigger className="px-4" value="paused">
            Parados
          </TabsTrigger>
          <TabsTrigger className="px-4" value="finished">
            Finalizados
          </TabsTrigger>
        </TabsList>
        {completed > 0 && (
          <Dialog
            body={
              <div>
                <p className="text-sm text-muted-foreground">
                  Timers finalizados : {completed}
                </p>
              </div>
            }
            dialog={{
              title: 'Limpar timers finalizados',
              description:
                'Você tem certeza que deseja limpar todos os timers finalizados? Esta ação não pode ser desfeita.',
              actions: {
                continue: {
                  label: 'Sim',
                  onClick: clearCompletedTimers,
                },
                cancel: {
                  label: 'Não',
                },
              },
            }}
          >
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-border/50 hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive transition-all duration-200 text-muted-foreground hover:shadow-sm bg-transparent cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              <span className="text-xs font-medium">
                Limpar timers finalizados
              </span>
              <div className="bg-red-800 bg-opacity-50 px-1.5 py-0.5 rounded-full text-xs font-bold">
                {completed}
              </div>
            </Button>
          </Dialog>
        )}
        {/* <Button variant={'destructive'} onClick={clearCompletedTimers}>
          Limpar finalizados
        </Button> */}
      </div>
      <TabsContent value="all">
        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {timers.map((timer) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onUpdate={onUpdateTimer}
                onDelete={onDeleteTimer}
              />
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="running">
        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {runningTimers.map((timer) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onUpdate={onUpdateTimer}
                onDelete={onDeleteTimer}
              />
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="paused">
        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {stoppedTimers.map((timer) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onUpdate={onUpdateTimer}
                onDelete={onDeleteTimer}
              />
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="finished">
        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {completedTimers.map((timer) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onUpdate={onUpdateTimer}
                onDelete={onDeleteTimer}
              />
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
