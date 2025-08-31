import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { routeTree } from '@/route-tree.gen';
import './index.css';
import TimerDashboard from './pages/timers/timer-dashboard';
import { Providers } from './providers';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const showRouter = true;

createRoot(rootElement).render(
  <StrictMode>
    <Providers>
      {showRouter ? <RouterProvider router={router} /> : <TimerDashboard />}
    </Providers>
  </StrictMode>,
);
