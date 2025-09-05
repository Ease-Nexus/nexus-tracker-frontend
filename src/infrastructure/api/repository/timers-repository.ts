import type { Timer } from '@/domain';
import { httpClient } from '../../setup';

export class TimersRepository {
  getTimers = async () => {
    const response = await httpClient.get<Timer[]>('/timers');

    return response.data;
  };

  addTimer = async (badgeNumber: string, minutes: number) => {
    const response = await httpClient.post('/timers', {
      badgeNumber,
      minutes,
    });

    return response.data;
  };

  updateTimer = async (id: string, updates: Partial<Timer>) => {
    const response = await httpClient.patch(`/timers/${id}`, updates);

    return response.data;
  };

  deleteTimer = async (id: string) => {
    const response = await httpClient.delete(`/timers/${id}`);

    return response.data;
  };

  clearCompletedTimers = async () => {
    const response = await httpClient.delete('/timers/completed');

    return response.data;
  };
}
