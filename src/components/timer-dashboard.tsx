import type { Timer } from '@/types';
import { TimerCard } from './timer-card';

interface TimerDashboardProps {
	timers: Timer[];
	onUpdateTimer: (id: string, updates: Partial<Timer>) => void;
	onDeleteTimer: (id: string) => void;
}

export function TimerDashboard({
	timers,
	onUpdateTimer,
	onDeleteTimer,
}: TimerDashboardProps) {
	if (timers.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<div className="rounded-full bg-muted p-6 mb-4">
					<svg
						className="h-12 w-12 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>clock icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h3 className="text-lg font-semibold text-foreground mb-2">
					Nenhum timer ativo
				</h3>
				<p className="text-muted-foreground max-w-sm">
					Clique em "Novo Timer" para adicionar o primeiro temporizador de
					crachá.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{timers.map((timer) => (
				<TimerCard
					key={timer.id}
					timer={timer}
					onUpdate={onUpdateTimer}
					onDelete={onDeleteTimer}
				/>
			))}
		</div>
	);
}
