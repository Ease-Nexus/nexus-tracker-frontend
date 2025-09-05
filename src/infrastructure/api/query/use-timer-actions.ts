import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Timer } from '@/domain';
import { getRepository } from '../repository';

export const useAddTimerMutation = () => {
  const queryClient = useQueryClient();
  const timersRepository = getRepository();
  return useMutation({
    mutationFn: ({
      badgeNumber,
      minutes,
    }: {
      badgeNumber: string;
      minutes: number;
    }) => timersRepository.addTimer(badgeNumber, minutes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timers'] });
    },
  });
};

export const useUpdateTimerMutation = () => {
  const queryClient = useQueryClient();
  const timersRepository = getRepository();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Timer> }) =>
      timersRepository.updateTimer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timers'] });
    },
  });
};

export const useDeleteTimerMutation = () => {
  const queryClient = useQueryClient();
  const timersRepository = getRepository();
  return useMutation({
    mutationFn: (id: string) => timersRepository.deleteTimer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timers'] });
    },
  });
};

export const useClearCompletedTimersMutation = () => {
  const queryClient = useQueryClient();
  const timersRepository = getRepository();
  return useMutation({
    mutationFn: () => timersRepository.clearCompletedTimers(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timers'] });
    },
  });
};
