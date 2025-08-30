'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Timer, TimerBlock } from '@/types';

const STORAGE_KEY = 'timer-dashboard-data';
const COMPLETED_TIMERS_KEY = 'completed-timers-data';

export interface CompletedTimer {
	id: string;
	badgeNumber: string;
	totalMinutes: number;
	startTime: Date;
	endTime: Date;
	totalElapsed: number;
	date: Date;
}

export function useTimerManager() {
	const [timers, setTimers] = useState<Timer[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load timers from localStorage on mount
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsedTimers = (JSON.parse(saved) as Timer[]).map(
					(timer: Timer) => ({
						...timer,
						createdAt: new Date(timer.createdAt),
						history: timer.history.map((block: TimerBlock) => ({
							...block,
							start: new Date(block.start),
							end: block.end ? new Date(block.end) : undefined,
						})),
					}),
				);
				setTimers(parsedTimers);
			}
		} catch (error) {
			console.error('Failed to load timers from localStorage:', error);
		} finally {
			setIsLoaded(true);
		}
	}, []);

	// Save timers to localStorage whenever they change
	useEffect(() => {
		if (isLoaded) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
			} catch (error) {
				console.error('Failed to save timers to localStorage:', error);
			}
		}
	}, [timers, isLoaded]);

	const saveCompletedTimer = useCallback(
		(timer: Timer, finalHistory: TimerBlock[]) => {
			const totalElapsed = finalHistory.reduce(
				(sum, block) => sum + block.elapsed,
				0,
			);
			const startTime = finalHistory[0]?.start || timer.createdAt;
			const endTime = finalHistory[finalHistory.length - 1]?.end || new Date();

			const completedTimer: CompletedTimer = {
				id: timer.id,
				badgeNumber: timer.badgeNumber,
				totalMinutes: timer.totalMinutes,
				startTime,
				endTime,
				totalElapsed: Math.floor(totalElapsed / 60), // Convert to minutes
				date: new Date(
					startTime.getFullYear(),
					startTime.getMonth(),
					startTime.getDate(),
				),
			};

			try {
				const existing = localStorage.getItem(COMPLETED_TIMERS_KEY);
				const completedTimers = existing ? JSON.parse(existing) : [];
				completedTimers.push(completedTimer);
				localStorage.setItem(
					COMPLETED_TIMERS_KEY,
					JSON.stringify(completedTimers),
				);
			} catch (error) {
				console.error('Failed to save completed timer:', error);
			}
		},
		[],
	);

	// Update running timers every second
	useEffect(() => {
		const interval = setInterval(() => {
			setTimers((prevTimers) =>
				prevTimers.map((timer) => {
					if (timer.status === 'running' && timer.remainingTime > 0) {
						const newRemainingTime = Math.max(0, timer.remainingTime - 1);

						// Auto-stop timer when it reaches zero
						if (newRemainingTime === 0) {
							const now = new Date();
							const currentBlock = timer.history[timer.history.length - 1];

							if (currentBlock && !currentBlock.end) {
								const elapsed = Math.floor(
									(now.getTime() - currentBlock.start.getTime()) / 1000,
								);
								const updatedHistory = [...timer.history];
								updatedHistory[updatedHistory.length - 1] = {
									...currentBlock,
									end: now,
									elapsed: currentBlock.elapsed + elapsed,
								};

								saveCompletedTimer(timer, updatedHistory);

								return {
									...timer,
									remainingTime: 0,
									status: 'stopped' as const,
									history: updatedHistory,
								};
							}
						}

						return { ...timer, remainingTime: newRemainingTime };
					}
					return timer;
				}),
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [saveCompletedTimer]);

	const addTimer = useCallback((badgeNumber: string, minutes: number) => {
		const newTimer: Timer = {
			id: crypto.randomUUID(),
			badgeNumber,
			totalMinutes: minutes,
			remainingTime: minutes * 60,
			status: 'stopped',
			createdAt: new Date(),
			history: [],
		};
		setTimers((prev) => [...prev, newTimer]);
	}, []);

	const updateTimer = useCallback(
		(id: string, updates: Partial<Timer>) => {
			setTimers((prev) =>
				prev.map((timer) => {
					if (timer.id === id) {
						const updatedTimer = { ...timer, ...updates };

						// Handle status changes with proper history tracking
						if (updates.status && updates.status !== timer.status) {
							const now = new Date();

							if (updates.status === 'running') {
								// Starting or resuming timer
								const newBlock: TimerBlock = {
									start: now,
									elapsed: 0,
								};
								updatedTimer.history = [...timer.history, newBlock];
							} else if (
								timer.status === 'running' &&
								(updates.status === 'paused' || updates.status === 'stopped')
							) {
								// Pausing or stopping running timer
								const currentBlock = timer.history[timer.history.length - 1];
								if (currentBlock && !currentBlock.end) {
									const elapsed = Math.floor(
										(now.getTime() - currentBlock.start.getTime()) / 1000,
									);
									const updatedHistory = [...timer.history];
									updatedHistory[updatedHistory.length - 1] = {
										...currentBlock,
										end: now,
										elapsed: currentBlock.elapsed + elapsed,
									};
									updatedTimer.history = updatedHistory;

									if (updates.status === 'stopped') {
										saveCompletedTimer(timer, updatedHistory);
									}
								}
							}
						}

						return updatedTimer;
					}
					return timer;
				}),
			);
		},
		[saveCompletedTimer],
	);

	const deleteTimer = useCallback((id: string) => {
		setTimers((prev) => prev.filter((timer) => timer.id !== id));
	}, []);

	const resetTimer = useCallback((id: string) => {
		setTimers((prev) =>
			prev.map((timer) => {
				if (timer.id === id) {
					return {
						...timer,
						remainingTime: timer.totalMinutes * 60,
						status: 'stopped' as const,
						history: [],
					};
				}
				return timer;
			}),
		);
	}, []);

	const getTimerStats = useCallback(() => {
		const activeTimers = timers.filter((t) => t.status === 'running').length;
		const totalTimers = timers.length;
		const completedTimers = timers.filter((t) => t.remainingTime === 0).length;

		return {
			active: activeTimers,
			total: totalTimers,
			completed: completedTimers,
			paused: timers.filter((t) => t.status === 'paused').length,
		};
	}, [timers]);

	const getCompletedTimers = useCallback((): CompletedTimer[] => {
		try {
			const saved = localStorage.getItem(COMPLETED_TIMERS_KEY);
			if (saved) {
				return (JSON.parse(saved) as CompletedTimer[]).map(
					(timer: CompletedTimer) => ({
						...timer,
						startTime: new Date(timer.startTime),
						endTime: new Date(timer.endTime),
						date: new Date(timer.date),
					}),
				);
			}
		} catch (error) {
			console.error('Failed to load completed timers:', error);
		}
		return [];
	}, []);

	return {
		timers,
		isLoaded,
		addTimer,
		updateTimer,
		deleteTimer,
		resetTimer,
		getTimerStats,
		getCompletedTimers,
	};
}
