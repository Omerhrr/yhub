"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
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
import { useNav, type ViewKey } from "@/store/nav";
import { LOGO_URL, SITE } from "@/data/content";
import { cn } from "@/lib/utils";

function NavItem({
  label,
  onClick,
  href,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  return (
    <a
      href={href ?? "#"}
      onClick={(e) => {
        if (!href) {
          e.preventDefault();
          onClick?.();
        } else {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="font-medium text-gray-700 transition-colors hover:text-[#013756] hover:underline hover:underline-offset-4"
    >
      {label}
    </a>
  );
}

export function Header() {
  const { navigate, view } = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (v: ViewKey, anchor?: string) => {
    navigate(v, anchor);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2"
          aria-label="Yahya Hub home"
        >
          <img
            src={LOGO_URL}
            alt="Yahya Hub Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-primary">Yahya Hub</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center space-x-6 md:flex">
          <NavItem label="About Us" onClick={() => go("about")} />
          <NavItem
            label="Workspaces"
            onClick={() => go("home", "workspaces")}
          />
          <NavItem label="Programs" onClick={() => go("home", "programs")} />
          <NavItem label="Events" onClick={() => go("home", "events")} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex items-center gap-1 font-medium text-gray-700 transition-colors hover:text-[#013756]">
                Products
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => go("yh-connect")}>
                YH Connect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-muted md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <img
                  src={LOGO_URL}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="text-lg font-bold text-primary">Yahya Hub</span>
              </SheetTitle>
            </SheetHeader>
            <ul className="mt-6 space-y-1">
              {[
                { label: "About Us", v: "about" as ViewKey },
                {
                  label: "Workspaces",
                  v: "home" as ViewKey,
                  anchor: "workspaces",
                },
                { label: "Programs", v: "home" as ViewKey, anchor: "programs" },
                { label: "Events", v: "home" as ViewKey, anchor: "events" },
                { label: "Products", v: "products" as ViewKey },
                { label: "YH Connect", v: "yh-connect" as ViewKey },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => go(item.v, item.anchor)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-muted hover:text-[#013756]"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
