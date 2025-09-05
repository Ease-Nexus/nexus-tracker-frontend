import axios from 'axios';
import { env } from '@/config';

export const httpClient = axios.create({
  baseURL: `${env.VITE_BACKEND_BASE_URL}/api`,
  headers: {
    'x-tenant-code': 'home',
  },
});
