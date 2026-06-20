"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { ChevronDown, Menu } from "lucide-react";

import { sidebarItems } from "@/confiq/sidebar";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermission";
import { getAllowedSidebarItems } from "@/lib/sidebarAccess";
import { cn } from "@/lib/utils";

export default function MobileSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { allowedPermissions, isLoading } = usePermissions();

  const filteredSidebarItems = getAllowedSidebarItems(sidebarItems, allowedPermissions);

  return (
    <Sheet>
      {/* Trigger */}
      <SheetTrigger asChild>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      {/* Sidebar */}
      <SheetContent side="left" className="w-[280px] border-r border-border bg-sidebar p-0">
        {/* Accessibility */}
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile Navigation Menu</SheetTitle>
        </SheetHeader>

        {/* Profile */}
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Admin</p>
              <h2 className="font-semibold text-sm">{user?.staff_name}</h2>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="space-y-8 p-4">
          {isLoading &&
            Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 rounded-2xl px-3 py-3">
                <div className="h-5 w-5 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-36 animate-pulse rounded-full bg-muted" />
              </div>
            ))}

          {!isLoading && filteredSidebarItems.map(section => (
            <div key={section.title}>
              <h3 className="mb-3 px-3 text-xs font-semibold uppercase text-muted-foreground">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map(item => {
                  // Dropdown
                  if (item.children) {
                    return (
                      <Collapsible key={item.title} defaultOpen>
                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />

                            {item.title}
                          </div>

                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-1 space-y-1 pl-6">
                          {item.children.map(subItem => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary",
                                pathname === subItem.href &&
                                  "bg-primary/10 text-primary font-medium"
                              )}
                            >
                              {subItem.icon && <subItem.icon className="h-4 w-4" />}

                              {subItem.title}
                            </Link>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  }

                  // Normal Item
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary",
                        pathname === item.href ? "bg-primary/10 text-primary" : "text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />

                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
