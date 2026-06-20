"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { sidebarItems } from "@/confiq/sidebar";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermission";
import { getAllowedSidebarItems } from "@/lib/sidebarAccess";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import SidebarSkeleton from "./SidebarSkeleton";

const getFirstPathSegment = href => href?.split("/").filter(Boolean)[0] || "";

const isPathActive = (pathname, href) => {
  if (!href) return false;

  return pathname === href || pathname.startsWith(`${href}/`);
};

const isPathInSection = (pathname, href) => {
  if (!href) return false;

  const firstSegment = getFirstPathSegment(href);

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    (firstSegment && getFirstPathSegment(pathname) === firstSegment)
  );
};

const getActiveSections = (items, pathname) => {
  return items.reduce((sections, section) => {
    section.items.forEach(item => {
      const hasActiveChild = item.children?.some(subItem => isPathInSection(pathname, subItem.href));

      if (hasActiveChild) {
        sections[item.title] = true;
      }
    });

    return sections;
  }, {});
};

export default function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState({});

  const toggleSection = title => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  const { allowedPermissions, isLoading } = usePermissions();
  const filteredSidebarItems = useMemo(
    () => getAllowedSidebarItems(sidebarItems, allowedPermissions),
    [allowedPermissions]
  );
  const activeSections = useMemo(
    () => getActiveSections(filteredSidebarItems, pathname),
    [filteredSidebarItems, pathname]
  );

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="group/sidebar hidden h-screen w-[280px] flex-col border-r border-border/40 bg-gradient-to-b from-background via-background to-background/95 md:flex sticky top-0 transition-all duration-300">
      {/* Company Logo */}
      <div className="h-[72px] flex items-center justify-center border-b border-border/40 px-4">
        <Link
          href="/dashboard"
          className="relative h-15 w-full overflow-hidden rounded-2xl bg-card/80 flex items-center px-4"
        >
          <Image
            src="/darkmode.webp"
            alt="Company Logo"
            width={140}
            height={32}
            className="h-auto w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Navigation - Modern Spacing & Design */}
      <div className="flex-1 overflow-y-auto px-3 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/60">
        <div className="space-y-6">
          {filteredSidebarItems.map((section, sectionIdx) => (
            <div key={section.title} className="space-y-2">
              {/* Section Header */}
              <div className="flex items-center gap-2 px-3">
                {/* <div className="h-4 w-0.5 rounded-full bg-gradient-to-b from-primary/60 to-primary/20" /> */}
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  {section.title}
                </h3>
              </div>
              {/* Section Items */}
              <div className="space-y-1.5">
                {section.items.map(item => {
                    // Dropdown with modern design
                    if (item.children) {
                      const isOpen = openSections[item.title] ?? activeSections[item.title] ?? false;
                      return (
                        <Collapsible
                          key={item.title}
                          open={isOpen}
                          onOpenChange={() => toggleSection(item.title)}
                        >
                          <CollapsibleTrigger
                            className={cn(
                              "group/trigger relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                              "hover:bg-primary/5 hover:text-primary",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                              isOpen && "text-primary bg-primary/5",
                              "before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity hover:before:opacity-100 before:pointer-events-none"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "transition-transform duration-200 group-hover/trigger:scale-105",
                                  isOpen && "text-primary"
                                )}
                              >
                                <item.icon className="h-5 w-5" />
                              </div>
                              <span className="text-sm">{item.title}</span>
                            </div>

                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-all duration-200",
                                isOpen && "rotate-180 text-primary"
                              )}
                            />
                          </CollapsibleTrigger>

                          <CollapsibleContent className="mt-1.5 space-y-1 overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                            <div className="ml-2 space-y-1 border-l border-border/40 pl-4">
                              {item.children.map(subItem => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={cn(
                                    "group/sub relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                                    "hover:bg-primary/5 hover:text-primary hover:translate-x-0.5",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                                    isPathActive(pathname, subItem.href)
                                      ? "bg-primary/10 text-primary font-medium shadow-sm"
                                      : "text-muted-foreground/80"
                                  )}
                                >
                                  {subItem.icon && (
                                    <div className="transition-transform duration-200 group-hover/sub:scale-105">
                                      <subItem.icon className="h-4 w-4" />
                                    </div>
                                  )}
                                  <span className="text-sm">{subItem.title}</span>

                                  {isPathActive(pathname, subItem.href) && (
                                    <>
                                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                      <div className="absolute left-0 h-full w-0.5 rounded-full bg-primary" />
                                    </>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    }

                    // Normal Item with modern design
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group/item relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          "hover:bg-primary/5 hover:text-primary hover:translate-x-0.5",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "transition-all duration-200",
                            "group-hover/item:scale-105 group-hover/item:rotate-0",
                            isActive && "text-primary"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>

                        <span className="text-sm">{item.title}</span>

                        {isActive && (
                          <>
                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                            <div className="absolute -left-3 h-full w-0.5 rounded-full bg-primary shadow-sm shadow-primary/30" />
                          </>
                        )}
                      </Link>
                    );
                  })}
              </div>

              {/* Divider between sections (except last) */}
              {sectionIdx !== sidebarItems.length - 1 && (
                <div className="mt-4 h-px bg-gradient-to-r from-border/40 via-border/60 to-border/40" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section - Modern Design */}
      <div className="border-t border-border/40 bg-gradient-to-t from-background to-transparent p-4">
        <button
          onClick={handleLogout}
          className="group/footer relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground/80 transition-all duration-200 hover:translate-x-0.5 hover:bg-red-500/10 hover:text-red-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 transition-opacity group-hover/footer:opacity-100" />

          <svg
            className="h-5 w-5 transition-transform group-hover/footer:-translate-x-0.5 group-hover/footer:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>

          <span className="relative">Logout</span>
        </button>
      </div>
    </aside>
  );
}
