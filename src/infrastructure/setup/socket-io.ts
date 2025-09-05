import { io } from 'socket.io-client';
import { env } from '@/config';

export const socket = io(`${env.VITE_BACKEND_BASE_URL}/websocket`, {
  path: '/timers',
}).connect();

console.log({ socket });
