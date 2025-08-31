import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './app-sidebar';

export const RootLayout = ({ children }: BaseProviderProps) => {
  return (
    <>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
        <TanStackRouterDevtools />
      </main>
    </>
  );
};
