export interface Timer {
  id: string;
  badgeNumber: string;
  totalMinutes: number;
  remainingTime: number;
  status: 'running' | 'paused' | 'stopped' | 'completed';
  createdAt: Date;
  history: TimerBlock[];
}

export interface TimerBlock {
  start: Date;
  end?: Date;
  elapsed: number;
}
