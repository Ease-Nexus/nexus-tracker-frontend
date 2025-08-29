'use client';

import { Clock, Pause, Play, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Timer } from '@/types';

interface TimerDetailsModalProps {
	timer: Timer | null;
	isOpen: boolean;
	onClose: () => void;
}

export function TimerDetailsModal({
	timer,
	isOpen,
	onClose,
}: TimerDetailsModalProps) {
	if (!timer) return null;

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		}
		return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const formatDateTime = (date: Date) => {
		return new Intl.DateTimeFormat('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}).format(date);
	};

	const totalElapsed = timer.history.reduce(
		(sum, block) => sum + block.elapsed,
		0,
	);
	const remainingMinutes = Math.ceil(timer.remainingTime / 60);
	const totalMinutes = timer.totalMinutes;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[80vh]">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<DialogTitle className="text-xl font-bold">
							Detalhes do Timer
						</DialogTitle>
						{/* <Button
							variant="ghost"
							size="sm"
							onClick={onClose}
							className="h-8 w-8 p-0"
						>
							<X className="h-4 w-4" />
						</Button> */}
					</div>
				</DialogHeader>

				<div className="space-y-6">
					{/* Timer Info */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="text-sm text-muted-foreground">Crachá</div>
							<Badge
								variant="secondary"
								className="font-mono text-base px-3 py-1"
							>
								#{timer.badgeNumber}
							</Badge>
						</div>
						<div className="space-y-2">
							<div className="text-sm text-muted-foreground">Status</div>
							<Badge
								variant={timer.status === 'running' ? 'default' : 'outline'}
								className="capitalize text-base px-3 py-1"
							>
								{timer.status === 'running'
									? 'Ativo'
									: timer.status === 'paused'
										? 'Pausado'
										: 'Parado'}
							</Badge>
						</div>
					</div>

					{/* Time Summary */}
					<div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
						<div className="text-center">
							<div className="text-2xl font-bold font-mono">{totalMinutes}</div>
							<div className="text-sm text-muted-foreground">Total (min)</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold font-mono text-green-600">
								{Math.floor(totalElapsed / 60)}
							</div>
							<div className="text-sm text-muted-foreground">Usado (min)</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold font-mono text-blue-600">
								{remainingMinutes}
							</div>
							<div className="text-sm text-muted-foreground">
								Restante (min)
							</div>
						</div>
					</div>

					{/* Creation Info */}
					<div className="space-y-2">
						<div className="text-sm text-muted-foreground">Criado em</div>
						<div className="font-mono text-sm">
							{formatDateTime(timer.createdAt)}
						</div>
					</div>

					{/* History */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4" />
							<h3 className="font-semibold">Histórico de Execução</h3>
						</div>

						{timer.history.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<div className="rounded-full bg-muted p-4 mx-auto mb-3 w-fit">
									<Clock className="h-6 w-6" />
								</div>
								<p>Nenhum histórico de execução ainda</p>
								<p className="text-sm">
									O histórico será criado quando o timer for iniciado
								</p>
							</div>
						) : (
							<ScrollArea className="h-64 w-full">
								<div className="space-y-3">
									{timer.history.map((block, index) => (
										<div
											key={index}
											className="border border-border rounded-lg p-4 space-y-2"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 bg-green-500 rounded-full" />
													<span className="font-medium">Bloco {index + 1}</span>
												</div>
												<Badge variant="outline" className="font-mono">
													{formatTime(block.elapsed)}
												</Badge>
											</div>

											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<div className="text-muted-foreground flex items-center gap-1">
														<Play className="h-3 w-3" />
														Início
													</div>
													<div className="font-mono">
														{formatDateTime(block.start)}
													</div>
												</div>
												{block.end && (
													<div>
														<div className="text-muted-foreground flex items-center gap-1">
															<Pause className="h-3 w-3" />
															Fim
														</div>
														<div className="font-mono">
															{formatDateTime(block.end)}
														</div>
													</div>
												)}
											</div>

											{!block.end && (
												<div className="text-sm text-blue-600 font-medium">
													⏳ Bloco em andamento
												</div>
											)}
										</div>
									))}
								</div>
							</ScrollArea>
						)}

						{/* Summary */}
						{timer.history.length > 0 && (
							<div className="border-t border-border pt-3 mt-4">
								<div className="flex justify-between items-center text-sm">
									<span className="text-muted-foreground">
										Total de blocos:
									</span>
									<span className="font-medium">{timer.history.length}</span>
								</div>
								<div className="flex justify-between items-center text-sm">
									<span className="text-muted-foreground">
										Tempo total usado:
									</span>
									<span className="font-mono font-medium">
										{formatTime(totalElapsed)}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
