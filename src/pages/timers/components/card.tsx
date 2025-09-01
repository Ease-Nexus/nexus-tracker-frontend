'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { Info, Pause, Play, RotateCcw, Square, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

  const getProgressBarColor = () => {
    if (timer.remainingTime === 0)
      return 'bg-gradient-to-r from-red-400 to-red-600';
    if (timer.status === 'running')
      return 'bg-gradient-to-r from-green-400 to-emerald-500';
    if (timer.status === 'paused')
      return 'bg-gradient-to-r from-yellow-400 to-amber-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
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
              {timer.badgeNumber}
            </Badge>

            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant={timer.status === 'running' ? 'secondary' : 'default'}
                onClick={handlePlay}
                disabled={timer.remainingTime === 0}
                className="rounded-sm h-6 w-6 p-0 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {timer.status === 'running' ? (
                  <Pause className="h-2.5 w-2.5" />
                ) : (
                  <Play className="h-2.5 w-2.5" />
                )}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleStop}
                disabled={timer.status === 'stopped'}
                className="rounded-sm h-6 w-6 p-0 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent"
              >
                <Square className="h-2.5 w-2.5" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                disabled={timer.status === 'running'}
                className="rounded-sm h-6 w-6 p-0 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent"
              >
                <RotateCcw className="h-2.5 w-2.5" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDetails(true)}
                className="rounded-sm h-6 w-6 p-0 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Info className="h-2.5 w-2.5" />
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                className="rounded-sm h-6 w-6 p-0 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={cn(
                'text-2xl font-bold font-mono tracking-tight',
                getTimeColor(),
              )}
            >
              {formatTime(timer.remainingTime)}
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
                {timer.status === 'running' && (
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
