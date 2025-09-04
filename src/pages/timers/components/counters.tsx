import { CheckCircle, Timer as LucidTimer, Pause, Play, X } from 'lucide-react';

export const Counters = ({
  getTimerStats,
}: {
  getTimerStats: () => {
    active: number;
    paused: number;
    stopped: number;
    completed: number;
    total: number;
    totalTimeHours: number;
    averageTime: number;
  };
}) => {
  const stats = getTimerStats();

  /* Total Timers */
  const totals = (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-2 md:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <LucidTimer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <div className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded-full">
          TOTAL
        </div>
      </div>
      <div className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">
        {stats.total}
      </div>
      <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400">
        Total de timers
      </p>
    </div>
  );

  /* Active Timers */
  const active = (
    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 rounded-lg p-2 md:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
        <div className="text-xs font-medium text-green-700 dark:text-green-300 bg-green-200 dark:bg-green-800 px-2 py-1 rounded-full">
          ATIVO
        </div>
      </div>
      <div className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-300">
        {stats.active}
      </div>
      <p className="text-xs md:text-sm text-green-600 dark:text-green-400">
        Em execução
      </p>
    </div>
  );

  /* Paused Timers */
  const paused = (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 md:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <Pause className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <div className="text-xs font-medium text-yellow-700 dark:text-yellow-300 bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded-full">
          PAUSADO
        </div>
      </div>
      <div className="text-xl md:text-2xl font-bold text-yellow-700 dark:text-yellow-300">
        {stats.paused}
      </div>
      <p className="text-xs md:text-sm text-yellow-600 dark:text-yellow-400">
        Pausados
      </p>
    </div>
  );

  // Stopped Timers
  const stopped = (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800 rounded-lg p-2 md:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <X className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        <div className="text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded-full">
          PARADO
        </div>
      </div>
      <div className="text-xl md:text-2xl font-bold text-orange-700 dark:text-orange-300">
        {stats.stopped}
      </div>
      <p className="text-xs md:text-sm text-orange-600 dark:text-orange-400">
        Parados
      </p>
    </div>
  );

  // Finalized Timers
  const finished = (
    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-red-200 dark:border-red-800 rounded-lg p-2 md:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        <div className="text-xs font-medium text-red-700 dark:text-red-300 bg-red-200 dark:bg-red-800 px-2 py-1 rounded-full">
          FINALIZADO
        </div>
      </div>
      <div className="text-xl md:text-2xl font-bold text-red-700 dark:text-red-300">
        {stats.completed}
      </div>
      <p className="text-xs md:text-sm text-red-600 dark:text-red-400">
        Finalizados
      </p>
    </div>
  );

  return (
    <>
      {totals}
      {active}
      {paused}
      {stopped}
      {finished}
    </>
  );
};
