import { useEffect } from "react";
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
  useSidebar,
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
  const { isMobile, setOpenMobile, setOpen } = useSidebar();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  // Tablet widths (768–1023px): collapse to icon-only rail with tooltips.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const apply = () => {
      if (mql.matches) setOpen(false);
    };
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [setOpen]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link to="/" className="flex min-h-11 items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold tracking-tight">CodeMateAI</span>
            <span className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">
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
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={isMobile ? "min-h-11" : undefined}
                      >
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
