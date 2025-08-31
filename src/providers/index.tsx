import { ThemeProvider } from '@/providers/theme-provider/theme-provider';
import { CustomSidebarProvider } from './sidebar-provider';

export const Providers = ({ children }: BaseProviderProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <CustomSidebarProvider>{children}</CustomSidebarProvider>
    </ThemeProvider>
  );
};
