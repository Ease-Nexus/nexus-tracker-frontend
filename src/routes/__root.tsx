import { createRootRoute, Outlet } from '@tanstack/react-router';
import { RootLayout } from '@/layout';

export const Route = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});
