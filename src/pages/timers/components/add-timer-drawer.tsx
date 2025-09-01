import { useForm } from '@tanstack/react-form';
import { Plus } from 'lucide-react';
import { useId, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface AddTimerDrawerProps {
  onAddTimer: (badgeNumber: string, minutes: number) => void;
}

export function AddTimerDrawer({ onAddTimer }: AddTimerDrawerProps) {
  const [open, setOpen] = useState<boolean>();
  const presetOptions = [
    { label: '30 min', value: 30 },
    { label: '1 hora', value: 60 },
    { label: '2 horas', value: 120 },
    { label: '4 horas', value: 240 },
    { label: '8 horas', value: 480 },
    { label: '12 horas', value: 720 },
  ];
  const customTimer = useId();

  const form = useForm({
    validators: {
      onChange: z.object({
        badgeNumber: z.string().min(1),
        minutes: z.number().min(1),
      }),
      onMount: z.object({
        badgeNumber: z.string().min(1),
        minutes: z.number().min(1),
      }),
    },
    defaultValues: {
      badgeNumber: '',
      minutes: 0,
    },
    onSubmitInvalid: ({ value }) => {
      console.log('invalid', { value });
    },

    onSubmit: ({ value: data, formApi }) => {
      onAddTimer(data.badgeNumber, data.minutes);
      formApi.reset();
      setOpen(false);
    },
  });

  const { Field } = form;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Timer
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold text-foreground">
              Novo Timer
            </SheetTitle>
            <SheetDescription>Descrição do form</SheetDescription>
          </SheetHeader>

          {/* Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              await form.handleSubmit();
            }}
            className="flex-1 p-6 space-y-6"
          >
            {/* Badge Number */}
            <div className="space-y-2">
              <Field
                name={'badgeNumber'}
                children={(field) => (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Número do Crachá
                    </Label>
                    <Input
                      type="text"
                      placeholder="Ex: 001, A15, etc."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full"
                    />
                  </div>
                )}
              />
            </div>

            {/* Time Presets */}
            <Field
              name="minutes"
              children={(field) => (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Tempo Pré-definido
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {presetOptions.map((preset) => (
                        <Button
                          key={preset.value}
                          type="button"
                          variant={
                            field.state.value === preset.value
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => {
                            field.form.setFieldValue('minutes', preset.value);
                            field.handleChange(preset.value);
                          }}
                          className="w-full justify-start"
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom" className="text-sm font-medium">
                      Tempo Personalizado (minutos)
                    </Label>
                    <Input
                      id={customTimer}
                      type="number"
                      placeholder="Ex: 45, 90, etc."
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.valueAsNumber)
                      }
                      onBlur={field.handleBlur}
                      min="1"
                      className="w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </>
              )}
            />

            {/* Submit Button */}

            <Button
              type="submit"
              className="w-full"
              // disabled={
              //   !form.state.values.badgeNumber || !form.state.values.minutes
              // }
            >
              Criar Timer
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
