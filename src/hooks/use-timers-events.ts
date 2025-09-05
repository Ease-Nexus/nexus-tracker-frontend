import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import type { Timer } from '@/domain';
import { socket } from '@/infrastructure/setup';

export const useTimersEvents = () => {
  const queryClient = useQueryClient();

  const updateTimerInCache = useCallback(
    (updatedTimer: Timer) => {
      queryClient.setQueryData<Timer[]>(['timers'], (prev) => {
        if (!prev) return [updatedTimer];
        const index = prev.findIndex((t) => t.id === updatedTimer.id);
        if (index !== -1) {
          const newTimers = [...prev];
          newTimers[index] = updatedTimer;
          return newTimers;
        }
        return [...prev, updatedTimer];
      });
    },
    [queryClient],
  );

  const updateAllTimersInCache = useCallback(
    (updatedTimers: Timer[]) => {
      queryClient.setQueryData<Timer[]>(['timers'], (prev) => {
        if (!prev) return updatedTimers;
        const timerMap = new Map(updatedTimers.map((t) => [t.id, t]));
        const newTimers = prev.map((t) => timerMap.get(t.id) || t);
        updatedTimers.forEach((updatedTimer) => {
          if (!prev.some((t) => t.id === updatedTimer.id)) {
            newTimers.push(updatedTimer);
          }
        });
        return newTimers;
      });
    },
    [queryClient],
  );

  useEffect(() => {
    const listeners = {
      'timer.started': (timer: Timer) => updateTimerInCache(timer),
      'timer.paused': (timer: Timer) => updateTimerInCache(timer),
      'timer.resumed': (timer: Timer) => updateTimerInCache(timer),
      'timer.completed': (timer: Timer) => updateTimerInCache(timer),
      'timer.tick': (timer: Timer) => updateTimerInCache(timer),
      'timers.tick': (timers: Timer[]) => updateAllTimersInCache(timers),
    };

    Object.entries(listeners).forEach(([event, listener]) => {
      socket.on(event, listener);
    });

    return () => {
      Object.entries(listeners).forEach(([event, listener]) => {
        socket.off(event, listener);
      });
    };
  }, [updateTimerInCache, updateAllTimersInCache]);
};
