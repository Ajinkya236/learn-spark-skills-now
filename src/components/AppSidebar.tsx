
import {
  BarChart3,
  Brain,
  Building2,
  ChevronRight,
  Lightbulb,
  Network,
  Settings2,
  TrendingUp,
  Users,
  Home,
  GitBranch,
  Target,
  BookOpen,
  UserCheck,
  MapPin,
  Award,
  Route,
  Briefcase,
  UserPlus
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "./Logo";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Skills Management",
    icon: Brain,
    items: [
      { title: "Taxonomy Management", url: "/skills/taxonomy", icon: GitBranch },
      { title: "Skill Relationships", url: "/skills/relationships", icon: Network },
      { title: "Proficiency Levels", url: "/skills/proficiency", icon: Target },
    ],
  },
  {
    title: "Organization",
    icon: Building2,
    items: [
      { title: "Structure & Roles", url: "/organization/structure", icon: Building2 },
      { title: "Employee Profiles", url: "/organization/profiles", icon: Users },
    ],
  },
  {
    title: "Workforce Intelligence",
    icon: BarChart3,
    items: [
      { title: "Forecasting & Deployment", url: "/workforce/forecasting", icon: TrendingUp },
      { title: "Gap Analysis", url: "/workforce/gaps", icon: BarChart3 },
      { title: "Progress Tracking", url: "/workforce/progress", icon: Award },
    ],
  },
  {
    title: "Talent Mobility",
    icon: Route,
    items: [
      { title: "Career Journeys", url: "/talent/journeys", icon: MapPin },
      { title: "Job Matching", url: "/talent/matching", icon: UserCheck },
      { title: "Internal Marketplace", url: "/talent/marketplace", icon: Briefcase },
    ],
  },
  {
    title: "Smart Recommendations",
    icon: Lightbulb,
    items: [
      { title: "Learning Paths", url: "/recommendations/learning", icon: BookOpen },
      { title: "Mentors & Projects", url: "/recommendations/mentors", icon: UserPlus },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items: any[]) => items.some(item => isActive(item.url));

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible defaultOpen={isGroupActive(item.items)}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between">
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
                              <NavLink to={subItem.url}>
                                <subItem.icon className="mr-2 h-4 w-4" />
                                <span>{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
