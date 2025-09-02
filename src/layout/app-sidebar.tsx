import { Icon } from '@iconify/react';
import { Link, type LinkProps } from '@tanstack/react-router';
import image from '@/assets/b0d1ad65-f816-41c2-a8e2-4169cc36d74c-removebg-preview 1.svg';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

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
              <Link to="/" className="flex items-center gap-2">
                {/* <Icon icon={'et:clock'} className="!size-5" /> */}
                <img src={image} alt="" className="w-8 h-8" />
                <span className="text-base font-semibold">CBDG Timer</span>
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

      {/* <SidebarFooter>
        <div className="p-1">
          <ModeToggle />
        </div>
      </SidebarFooter> */}
    </Sidebar>
  );
};

export default AppSidebar;
