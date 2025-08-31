'use client';

import {
  Clock,
  Info,
  Pause,
  Play,
  RotateCcw,
  Square,
  TimerIcon,
  Trash2,
} from 'lucide-react';
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

  const getStatusBadge = () => {
    if (timer.status === 'running')
      return {
        variant: 'default' as const,
        text: 'Ativo',
        color: 'bg-green-500',
      };
    if (timer.status === 'paused')
      return {
        variant: 'secondary' as const,
        text: 'Pausado',
        color: 'bg-yellow-500',
      };
    if (timer.remainingTime === 0)
      return {
        variant: 'destructive' as const,
        text: 'Finalizado',
        color: 'bg-red-500',
      };
    return {
      variant: 'outline' as const,
      text: 'Parado',
      color: 'bg-gray-500',
    };
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
  const statusBadge = getStatusBadge();

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-card border',
        )}
      >
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="font-mono text-xs px-2 py-0.5 bg-muted/50 backdrop-blur-sm border shadow-sm"
            >
              <TimerIcon className="h-2.5 w-2.5 mr-1" />#{timer.badgeNumber}
            </Badge>
            <Badge
              variant={statusBadge.variant}
              className="capitalize px-2 py-0.5 text-xs font-medium shadow-sm"
            >
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full mr-1.5',
                  statusBadge.color,
                )}
              />
              {statusBadge.text}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-2">
          <div className="text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5">
              <Clock className={cn('h-4 w-4', getTimeColor())} />
              <div
                className={cn(
                  'text-2xl font-bold font-mono tracking-tight',
                  getTimeColor(),
                )}
              >
                {formatTime(timer.remainingTime)}
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-muted/30 rounded-full px-2 py-0.5 backdrop-blur-sm border">
              Total: {timer.totalMinutes} min
              {timer.history.length > 0 && (
                <span className="ml-1.5">
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
              className="h-7 w-7 p-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              {timer.status === 'running' ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleStop}
              disabled={timer.status === 'stopped'}
              className="h-7 w-7 p-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 bg-transparent"
            >
              <Square className="h-3 w-3" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={timer.status === 'running'}
              className="h-7 w-7 p-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 bg-transparent"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDetails(true)}
              className="h-7 w-7 p-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <Info className="h-3 w-3" />
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              className="h-7 w-7 p-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          <div className="absolute bottom-1 left-3 right-3">
            <div className="h-1.5 bg-muted rounded-full shadow-inner">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-1000 ease-out relative shadow-sm',
                  timer.status === 'running'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : timer.status === 'paused'
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                      : 'bg-gradient-to-r from-blue-400 to-indigo-500',
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
