import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  LayoutDashboard,
  Wand2,
  ShieldCheck,
  GitCompare,
  Wrench,
  History,
  Star,
  Settings,
  Sparkles,
  FolderCode,
} from "lucide-react";
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
} from "@/components/ui/sidebar";

const NAV = [
  {
    label: "Overview",
    items: [
      { title: "Home", to: "/", icon: Home },
      { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    ],
  },

  {
    label: "AI Tools",
    items: [
      { title: "Code Generator", to: "/tools/code-generator", icon: Wand2 },
      { title: "Code Reviewer", to: "/tools/code-reviewer", icon: ShieldCheck },
      { title: "Bug Solver", to: "/tools/bug-solver", icon: Sparkles },
      { title: "Code Converter", to: "/tools/code-converter", icon: GitCompare },
    ],
  },
  {
    label: "Generators",
    items: [
      { title: "Documentation", to: "/tools/documentation-generator", icon: FolderCode },
      { title: "Regex", to: "/tools/regex-generator", icon: FolderCode },
      { title: "SQL", to: "/tools/sql-generator", icon: FolderCode },
      { title: "API", to: "/tools/api-generator", icon: FolderCode },
      { title: "README", to: "/tools/readme-generator", icon: FolderCode },
      { title: "Flowchart", to: "/tools/flowchart-generator", icon: FolderCode },
    ],
  },
  {
    label: "Utilities",
    items: [
      { title: "JSON Formatter", to: "/utilities/json-formatter", icon: Wrench },
      { title: "Base64", to: "/utilities/base64", icon: Wrench },
      { title: "JWT Decoder", to: "/utilities/jwt-decoder", icon: Wrench },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "History", to: "/history", icon: History },
      { title: "Favorites", to: "/favorites", icon: Star },
      { title: "Settings", to: "/settings", icon: Settings },
    ],
  },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">CodeMateAI</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Dev Toolkit
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {NAV.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.to;
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link to={item.to} className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
