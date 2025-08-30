import { Info, Pause, Play, RotateCcw, Square, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Timer } from '@/types';
import { TimerDetailsModal } from './details-modal';

interface TimerCardProps {
  timer: Timer;
  onUpdate: (id: string, updates: Partial<Timer>) => void;
  onDelete: (id: string) => void;
}

export function TimerCard({ timer, onUpdate, onDelete }: TimerCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timer.remainingTime === 0) return 'text-red-500 animate-pulse';
    if (timer.remainingTime <= 60) return 'text-red-500'; // 1 min
    if (timer.remainingTime <= 300) return 'text-yellow-600'; // 5 min
    return 'text-foreground';
  };

  const handlePlay = () => {
    if (timer.status === 'running') {
      onUpdate(timer.id, { status: 'paused' });
    } else {
      onUpdate(timer.id, { status: 'running' });
    }
  };

  const handleStop = () => {
    onUpdate(timer.id, { status: 'stopped' });
  };

  const handleReset = () => {
    if (
      confirm(
        'Tem certeza que deseja resetar este timer? Todo o histórico será perdido.',
      )
    ) {
      onUpdate(timer.id, {
        remainingTime: timer.totalMinutes * 60,
        status: 'stopped',
        history: [],
      });
    }
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este timer?')) {
      onDelete(timer.id);
    }
  };

  const progressPercentage =
    ((timer.totalMinutes * 60 - timer.remainingTime) /
      (timer.totalMinutes * 60)) *
    100;

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-mono">
              #{timer.badgeNumber}
            </Badge>
            <Badge
              variant={timer.status === 'running' ? 'default' : 'outline'}
              className="capitalize"
            >
              {timer.status === 'running'
                ? 'Ativo'
                : timer.status === 'paused'
                  ? 'Pausado'
                  : 'Parado'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={cn('text-3xl font-bold font-mono', getTimeColor())}>
              {formatTime(timer.remainingTime)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Total: {timer.totalMinutes} min
              {timer.history.length > 0 && (
                <span className="ml-2">
                  • {timer.history.length} sessõe
                  {timer.history.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-1">
            <Button
              size="sm"
              variant={timer.status === 'running' ? 'secondary' : 'default'}
              onClick={handlePlay}
              disabled={timer.remainingTime === 0}
            >
              {timer.status === 'running' ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleStop}
              disabled={timer.status === 'stopped'}
            >
              <Square className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={timer.status === 'running'}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDetails(true)}
            >
              <Info className="h-4 w-4" />
            </Button>

            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
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
