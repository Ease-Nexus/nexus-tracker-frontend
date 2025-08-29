import { X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddTimerDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onAddTimer: (badgeNumber: string, minutes: number) => void;
}

export function AddTimerDrawer({
	isOpen,
	onClose,
	onAddTimer,
}: AddTimerDrawerProps) {
	const [badgeNumber, setBadgeNumber] = useState('');
	const [customMinutes, setCustomMinutes] = useState('');
	const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

	const presetOptions = [
		{ label: '30 min', value: 30 },
		{ label: '1 hora', value: 60 },
		{ label: '2 horas', value: 120 },
	];

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!badgeNumber.trim()) return;

		const minutes = selectedPreset || Number.parseInt(customMinutes) || 0;
		if (minutes <= 0) return;

		onAddTimer(badgeNumber.trim(), minutes);

		// Reset form
		setBadgeNumber('');
		setCustomMinutes('');
		setSelectedPreset(null);
	};

	const handlePresetClick = (value: number) => {
		setSelectedPreset(value);
		setCustomMinutes('');
	};

	const handleCustomChange = (value: string) => {
		setCustomMinutes(value);
		setSelectedPreset(null);
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay */}
			<div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

			{/* Drawer */}
			<div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-50 shadow-lg">
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-border">
						<h2 className="text-lg font-semibold text-foreground">
							Novo Timer
						</h2>
						<Button
							variant="ghost"
							size="sm"
							onClick={onClose}
							className="h-8 w-8 p-0"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
						{/* Badge Number */}
						<div className="space-y-2">
							<Label htmlFor="badge" className="text-sm font-medium">
								Número do Crachá
							</Label>
							<Input
								id="badge"
								type="text"
								placeholder="Ex: 001, A15, etc."
								value={badgeNumber}
								onChange={(e) => setBadgeNumber(e.target.value)}
								className="w-full"
							/>
						</div>

						{/* Time Presets */}
						<div className="space-y-3">
							<Label className="text-sm font-medium">Tempo Pré-definido</Label>
							<div className="grid grid-cols-1 gap-2">
								{presetOptions.map((preset) => (
									<Button
										key={preset.value}
										type="button"
										variant={
											selectedPreset === preset.value ? 'default' : 'outline'
										}
										onClick={() => handlePresetClick(preset.value)}
										className="w-full justify-start"
									>
										{preset.label}
									</Button>
								))}
							</div>
						</div>

						{/* Custom Time */}
						<div className="space-y-2">
							<Label htmlFor="custom" className="text-sm font-medium">
								Tempo Personalizado (minutos)
							</Label>
							<Input
								id="custom"
								type="number"
								placeholder="Ex: 45, 90, etc."
								value={customMinutes}
								onChange={(e) => handleCustomChange(e.target.value)}
								min="1"
								className="w-full"
							/>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full"
							disabled={
								!badgeNumber.trim() || (!selectedPreset && !customMinutes)
							}
						>
							Criar Timer
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
