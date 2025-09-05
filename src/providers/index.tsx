import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/providers/theme-provider/theme-provider';
import { CustomSidebarProvider } from './sidebar-provider';

export const Providers = ({ children }: BaseProviderProps) => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <CustomSidebarProvider>{children}</CustomSidebarProvider>
        <Toaster position="bottom-right" expand />
      </QueryClientProvider>
    </ThemeProvider>
  );
};
