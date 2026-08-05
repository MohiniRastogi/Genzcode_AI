import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { ToolsMenu } from "@/components/layout/ToolsMenu";
import { BackToTop } from "@/components/layout/BackToTop";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { GitHubLink } from "@/components/layout/GitHubLink";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CodeMateAI — AI Coding Assistant for Code, APIs, SQL & Docs" },
      {
        name: "description",
        content:
          "CodeMateAI is an AI coding assistant that generates production-ready code, reviews pull requests, fixes bugs, and produces APIs, SQL, regex, README files and technical documentation — right in the browser.",
      },
      { name: "author", content: "CodeMateAI" },
      {
        name: "theme-color",
        content: "#f7f8fb",
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: "#111726",
        media: "(prefers-color-scheme: dark)",
      },
      { property: "og:title", content: "CodeMateAI — AI Coding Assistant for Code, APIs, SQL & Docs" },
      {
        property: "og:description",
        content:
          "CodeMateAI is an AI coding assistant that generates production-ready code, reviews pull requests, fixes bugs, and produces APIs, SQL, regex, README files and technical documentation — right in the browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CodeMateAI — AI Coding Assistant for Code, APIs, SQL & Docs" },
      { name: "twitter:description", content: "CodeMateAI is an AI coding assistant that generates production-ready code, reviews pull requests, fixes bugs, and produces APIs, SQL, regex, README files and technical documentation — right in the browser." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8cef277e-43aa-4008-a6b6-078d10bee4e8/id-preview-384abd34--a225df56-741c-4bd1-9f56-9f405c5163ac.lovable.app-1785256403956.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8cef277e-43aa-4008-a6b6-078d10bee4e8/id-preview-384abd34--a225df56-741c-4bd1-9f56-9f405c5163ac.lovable.app-1785256403956.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },

      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark'){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=t;document.documentElement.setAttribute('data-color-scheme',t);}catch(e){}})();`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex min-w-0 flex-1 flex-col">
            <header
              className={
                "sticky top-0 z-30 flex flex-col gap-2 px-3 py-2 transition-all duration-300 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-4 sm:py-0 " +
                (scrolled
                  ? "border-b border-border/60 bg-background/95 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
                  : "border-b border-transparent bg-background/40 backdrop-blur-md supports-[backdrop-filter]:bg-background/30")
              }
            >
              <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="h-[38px] w-[38px] shrink-0" />
                <Link to="/" className="flex items-center md:hidden">
                  <BrandLogo showSubtitle={false} />
                </Link>
                <ToolsMenu />
                <div className="flex-1" />
              </div>
            </header>
            <div className="fixed right-3 top-3 z-50 flex items-center gap-2.5 sm:right-4 sm:top-4 sm:gap-3">
              <GlobalSearch iconOnly />
              <GitHubLink />
              <ThemeToggle />
            </div>

            <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">
              <Breadcrumbs />
              <Outlet />
            </main>
          </SidebarInset>
        </div>
        <BackToTop />

        <Toaster richColors position="top-right" />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
