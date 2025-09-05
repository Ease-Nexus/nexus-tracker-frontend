'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { Info, Pause, Play, RotateCcw, Square, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Timer } from '@/domain';
import { cn, formatTime } from '@/lib/utils';
import { TimerDetailsModal } from './details-modal';
import { Dialog } from './dialog';

interface TimerCardProps {
  timer: Timer;
  onUpdate: (id: string, updates: Partial<Timer>) => void;
  onDelete: (id: string) => void;
}

export function TimerCard({ timer, onUpdate, onDelete }: TimerCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const completed = timer.elapsed >= timer.duration;

  const getTimeColor = () => {
    if (completed) return 'text-red-500 animate-pulse';
    if (timer.duration - timer.elapsed <= 60 * 1000) return 'text-red-500'; // 1 min
    if (timer.duration - timer.elapsed <= 300 * 1000) return 'text-yellow-600'; // 5 min
    return 'text-foreground';
  };

  const getProgressBarColor = () => {
    if (completed) return 'bg-gradient-to-r from-red-400 to-red-600';
    if (timer.status === 'RUNNING')
      return 'bg-gradient-to-r from-green-400 to-emerald-500';
    if (timer.status === 'PAUSED')
      return 'bg-gradient-to-r from-yellow-400 to-amber-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
  };

  const handlePlay = () => {
    if (timer.status === 'RUNNING') {
      // onUpdate(timer.id, { status: 'paused' });
    } else {
      // onUpdate(timer.id, { status: 'running' });
    }
  };

  const handleStop = () => {
    // onUpdate(timer.id, { status: 'stopped' });
  };

  const handleReset = () => {
    // onUpdate(timer.id, {
    //   remainingTime: timer.totalMinutes * 60,
    //   status: 'stopped',
    //   history: [],
    // });

    toast.info('Timer restaurado');
  };

  const handleDelete = () => {
    onDelete(timer.id);
    toast.info('Timer excluído');
  };

  const playButton = (
    <Button
      size="sm"
      variant={timer.status === 'RUNNING' ? 'secondary' : 'default'}
      onClick={handlePlay}
      disabled={completed}
      className="rounded-sm h-6 w-6 p-0 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {timer.status === 'RUNNING' ? (
        <Pause className="h-2.5 w-2.5" />
      ) : (
        <Play className="h-2.5 w-2.5" />
      )}
    </Button>
  );

  const stopButton = (
    <Button
      size="sm"
      variant="outline"
      onClick={handleStop}
      disabled={timer.status === 'CANCELED'}
      className="rounded-sm h-6 w-6 p-0 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent"
    >
      <Square className="h-2.5 w-2.5" />
    </Button>
  );

  const resetButton = (
    <Dialog
      dialog={{
        title: 'Restaurar Timer',
        description:
          'Tem certeza que deseja resetar este timer? Todo o histórico será perdido.',
        actions: {
          continue: {
            label: 'Sim',
            onClick: handleReset,
          },
          cancel: {
            label: 'Não',
            onClick: () => {},
          },
        },
      }}
    >
      <Button
        size="sm"
        variant="outline"
        disabled={timer.status === 'RUNNING'}
        className="rounded-sm h-6 w-6 p-0 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent"
      >
        <RotateCcw className="h-2.5 w-2.5" />
      </Button>
    </Dialog>
  );

  const infoButton = (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setShowDetails(true)}
      className="rounded-sm h-6 w-6 p-0 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <Info className="h-2.5 w-2.5" />
    </Button>
  );

  const deleteButton = (
    <Dialog
      dialog={{
        title: 'Excluir Timer',
        description: 'Tem certeza que deseja excluir este timer?',
        actions: {
          continue: {
            label: 'Sim',
            onClick: handleDelete,
          },
          cancel: {
            label: 'Não',
            onClick: () => {},
          },
        },
      }}
    >
      <Button
        size="sm"
        variant="destructive"
        className="rounded-sm h-6 w-6 p-0 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <Trash2 className="h-2.5 w-2.5" />
      </Button>
    </Dialog>
  );

  const progressPercentage =
    ((timer.duration - timer.elapsed) / timer.duration) * 100;

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-card border',
        )}
      >
        <CardContent className="px-4 py-0">
          <div className="flex items-start justify-between mb-3">
            <Badge
              variant="outline"
              className="font-mono text-xs px-2 py-0.5 bg-muted/50 backdrop-blur-sm border shadow-sm flex items-center gap-2 "
            >
              <Icon icon="meteor-icons:credit-card" />
              {timer.badge}
            </Badge>

            <div className="flex items-center gap-1.5">
              {playButton}
              {stopButton}
              {resetButton}
              {infoButton}
              {deleteButton}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={cn(
                'text-2xl font-bold font-mono tracking-tight',
                getTimeColor(),
              )}
            >
              {formatTime(timer.duration - timer.elapsed)}
            </div>

            {timer.history.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {/* <Users className="h-3 w-3" /> */}
                <Icon icon="bi:bar-chart-steps" />
                <span>{timer.history.length}</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-1 left-3 right-3">
            <div className="h-1 bg-muted rounded-full shadow-inner">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-1000 ease-out relative shadow-sm',
                  getProgressBarColor(),
                )}
                style={{ width: `${progressPercentage}%` }}
              >
                {timer.status === 'RUNNING' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TimerDetailsModal
        timer={timer}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
}
