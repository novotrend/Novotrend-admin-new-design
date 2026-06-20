"use client";

import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/services/notification/notification.mutation";
import MobileSidebar from "../sidebar/MobileSidebar";

export default function Header() {
  const { notifications, unreadCount } = useNotifications();
  const markNotificationAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllNotificationsAsReadMutation = useMarkAllNotificationsAsReadMutation();
  const { user } = useAuth();
  const initials = user?.staff_name?.substring(0, 2).toUpperCase() || "Uk";

  const handleReadNotification = notification => {
    if (!notification?.id || !notification.unread || markNotificationAsReadMutation.isPending) {
      return;
    }

    markNotificationAsReadMutation.mutate({
      notification_id: notification.id,
    });
  };

  const handleReadAllNotifications = () => {
    if (!unreadCount || markAllNotificationsAsReadMutation.isPending) {
      return;
    }

    markAllNotificationsAsReadMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4 md:px-8">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileSidebar />
        </div>

        {/* Logo/Brand */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <div>
            <h1 className="text-2xl leading-tight font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Welcome back, {user?.staff_name}
            </h1>
            <div className="flex items-center gap-1.5"></div>
          </div>
        </div>
        {/* Mobile Title */}
        <div className="md:hidden">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Welcome {user?.staff_name}
          </p>
        </div>
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative group flex h-11 w-11 items-center justify-center rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
              <Bell className="h-5 w-5 transition-transform group-hover:scale-105" />

              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-lg ring-2 ring-background">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[380px] rounded-2xl border border-border/40 bg-card/95 backdrop-blur-xl p-0 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
              <div>
                <h3 className="text-base font-semibold">Notifications</h3>
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                type="button"
                disabled={!unreadCount || markAllNotificationsAsReadMutation.isPending}
                onClick={handleReadAllNotifications}
                className="text-xs font-medium text-primary hover:underline disabled:pointer-events-none disabled:text-muted-foreground"
              >
                {markAllNotificationsAsReadMutation.isPending ? "Marking..." : "Mark all as read"}
              </button>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto">
              {notifications?.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onSelect={event => {
                      event.preventDefault();
                      handleReadNotification(notification);
                    }}
                    className={`relative flex items-start gap-3 rounded-none border-b border-border/20 px-4 py-4 cursor-pointer transition-all ${
                      notification.unread
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "bg-white hover:bg-muted/40"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        notification.unread
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Bell className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-3">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.time || notification.date}
                        </span>

                        {notification.unread && (
                          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>

                      <p className="text-sm leading-6 text-foreground whitespace-normal break-words">
                        {notification.description || notification.message}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Bell className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm font-medium">No notifications</p>
                  <p className="text-xs text-muted-foreground">You&apos;re all caught up.</p>
                </div>
              )}
            </div>

          </DropdownMenuContent>
        </DropdownMenu>
        {/* Profile Dropdown - Premium Version */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm px-2 py-1.5 transition-all hover:bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 md:px-3">
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg ring-2 ring-primary/20 transition-transform group-hover:scale-105 md:h-10 md:w-10">
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                    {initials}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
              </div>
              <div className="hidden text-left md:block">
                <h3 className="text-sm font-semibold">{user?.staff_name}</h3>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </header>
  );
}
