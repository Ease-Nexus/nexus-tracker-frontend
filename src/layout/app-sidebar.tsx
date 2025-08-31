import { Icon } from '@iconify/react';
import { Link, type LinkProps } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ModeToggle } from '@/providers/theme-provider';

interface MenuItem {
  title: string;
  icon: string;
  to: LinkProps['to'];
}

export const AppSidebar = () => {
  const menuItems: MenuItem[] = [
    {
      icon: 'basil:clock-outline',
      title: 'Dashboard',
      to: '/',
    },
    {
      icon: 'bx:file',
      title: 'Relatórios',
      to: '/reports',
    },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <Icon icon={'et:clock'} className="!size-5" />
                <span className="text-base font-semibold">Nexus Tracker</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={`${item.title}-${index}`}>
                  <SidebarMenuButton asChild>
                    <Link to={item.to}>
                      <Icon icon={item.icon} />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-1">
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
