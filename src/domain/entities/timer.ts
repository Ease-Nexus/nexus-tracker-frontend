export interface TimerHistoryBlock {
  startedAt: Date;
  endedAt?: Date;
  elapsed: number;
}

export const timerStatuses = [
  'CREATED',
  'RUNNING',
  'PAUSED',
  'COMPLETED',
  'CANCELED',
] as const;

export type TimerStatus = (typeof timerStatuses)[number];

export interface Timer {
  id: string;
  badge: string;
  duration: number;
  elapsed: number;
  status: TimerStatus;
  overDue?: boolean;
  lastStartedAt?: Date;
  startedAt?: Date;
  history: TimerHistoryBlock[];
}
