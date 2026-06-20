"use client";

import { useState } from "react";
import { Menu, ChevronDown, ChevronRight, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNav, type ViewKey } from "@/store/nav";
import { LOGO_URL } from "@/data/content";
import { cn } from "@/lib/utils";

function NavLink({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative text-sm font-medium transition-colors duration-200 pb-0.5",
        active
          ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary"
          : "text-gray-600 hover:text-primary"
      )}
    >
      {label}
    </button>
  );
}

export function Header() {
  const { navigate, view, homeAnchor } = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (v: ViewKey, anchor?: string) => {
    navigate(v, anchor);
    setMobileOpen(false);
  };

  const isActive = (v: ViewKey, anchor?: string) => {
    if (v !== view) return false;
    if (anchor) return homeAnchor === anchor;
    return !homeAnchor;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button onClick={() => go("home")} className="flex items-center gap-2.5 shrink-0" aria-label="Yahya Hub home">
          <img src={LOGO_URL} alt="Yahya Hub Logo" width={36} height={36} className="h-9 w-9" />
          <span className="text-lg font-bold text-primary tracking-tight">Yahya Hub</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink label="About Us" active={isActive("about")} onClick={() => go("about")} />
          <NavLink label="Workspaces" active={isActive("workspaces") || isActive("workspace-detail")} onClick={() => go("workspaces")} />
          <NavLink label="Courses" active={isActive("courses") || isActive("course-detail")} onClick={() => go("courses")} />
          <NavLink label="Events" active={isActive("events") || isActive("event-detail")} onClick={() => go("events")} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-primary">
                More
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-lg">
              <DropdownMenuItem onClick={() => go("yh-connect")} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm cursor-pointer">
                <Zap className="h-4 w-4 text-secondary" />
                YH Connect
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => go("blog")} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm cursor-pointer">
                Blog
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Button size="sm" onClick={() => go("workspaces")} className="h-9 rounded-full px-5 text-sm font-semibold shadow-sm">
            Book a Space
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-muted transition-colors md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="flex items-center gap-2">
                <img src={LOGO_URL} alt="" width={28} height={28} className="h-7 w-7" />
                <span className="text-base font-bold text-primary">Yahya Hub</span>
              </SheetTitle>
            </SheetHeader>
            <div className="p-4 space-y-1">
              {[
                { label: "About Us", v: "about" as ViewKey },
                { label: "Workspaces", v: "workspaces" as ViewKey },
                { label: "Courses", v: "courses" as ViewKey },
                { label: "Events", v: "events" as ViewKey },
                { label: "YH Connect", v: "yh-connect" as ViewKey },
                { label: "Blog", v: "blog" as ViewKey },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => go(item.v)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                    view === item.v ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-muted hover:text-primary"
                  )}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
            <div className="px-4 pt-2">
              <Button className="w-full rounded-xl" onClick={() => go("workspaces")}>
                Book a Space
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
