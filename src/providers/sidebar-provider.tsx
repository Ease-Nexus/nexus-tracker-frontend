import { SidebarProvider } from '@/components/ui/sidebar';

export const CustomSidebarProvider = ({ children }: BaseProviderProps) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};
