import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (milliseconds: number) => {
  const seconds = milliseconds / 1000;
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = Math.floor(absSeconds % 60);

  let timeString = '';

  if (hours > 0) {
    timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    timeString = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return isNegative ? `-${timeString}` : timeString;
};
