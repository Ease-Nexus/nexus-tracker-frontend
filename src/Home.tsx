'use client';

import { Clock, FileText, Play, Plus } from 'lucide-react';
import { useState } from 'react';
import { AddTimerDrawer } from '@/components/add-timer-drawer';
import { ReportsScreen } from '@/components/reports-screen';
import { TimerDashboard } from '@/components/timer-dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTimerManager } from '@/hooks/use-timer-manager';

export interface Timer {
	id: string;
	badgeNumber: string;
	totalMinutes: number;
	remainingTime: number;
	status: 'running' | 'paused' | 'stopped';
	createdAt: Date;
	history: TimerBlock[];
}

export interface TimerBlock {
	start: Date;
	end?: Date;
	elapsed: number;
}

export default function Home() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('dashboard');
	const {
		timers,
		isLoaded,
		addTimer,
		updateTimer,
		deleteTimer,
		getTimerStats,
		getCompletedTimers,
	} = useTimerManager();

	const handleAddTimer = (badgeNumber: string, minutes: number) => {
		addTimer(badgeNumber, minutes);
		setIsDrawerOpen(false);
	};

	const stats = getTimerStats();

	if (!isLoaded) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
					<p className="text-muted-foreground">Carregando timers...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b border-border bg-card">
				<div className="flex items-center justify-between px-6 py-4">
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							Gerenciador de Temporizadores
						</h1>
						<p className="text-sm text-muted-foreground">
							Pista de Patinação - Controle de Crachás
						</p>
					</div>

					<div className="flex items-center gap-4">
						{stats.total > 0 && (
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-1">
									<Play className="h-4 w-4 text-green-600" />
									<Badge
										variant="secondary"
										className="bg-green-100 text-green-800"
									>
										{stats.active} ativo{stats.active !== 1 ? 's' : ''}
									</Badge>
								</div>

								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4 text-blue-600" />
									<Badge variant="outline">{stats.total} total</Badge>
								</div>

								{stats.completed > 0 && (
									<Badge
										variant="secondary"
										className="bg-red-100 text-red-800"
									>
										{stats.completed} finalizado
										{stats.completed !== 1 ? 's' : ''}
									</Badge>
								)}
							</div>
						)}

						{activeTab === 'dashboard' && (
							<Button
								onClick={() => setIsDrawerOpen(true)}
								className="flex items-center gap-2"
							>
								<Plus className="h-4 w-4" />
								Novo Timer
							</Button>
						)}
					</div>
				</div>
			</header>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
				<div className="border-b border-border bg-muted/30">
					<TabsList className="ml-6 bg-transparent">
						<TabsTrigger value="dashboard" className="flex items-center gap-2">
							<Clock className="h-4 w-4" />
							Dashboard
						</TabsTrigger>
						<TabsTrigger value="reports" className="flex items-center gap-2">
							<FileText className="h-4 w-4" />
							Relatórios
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="dashboard" className="mt-0">
					<main className="p-6">
						<TimerDashboard
							timers={timers}
							onUpdateTimer={updateTimer}
							onDeleteTimer={deleteTimer}
						/>
					</main>
				</TabsContent>

				<TabsContent value="reports" className="mt-0">
					<main className="p-6">
						<ReportsScreen completedTimers={getCompletedTimers()} />
					</main>
				</TabsContent>
			</Tabs>

			<AddTimerDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onAddTimer={handleAddTimer}
			/>
		</div>
	);
}
