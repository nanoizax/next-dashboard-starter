"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { AuthUser } from "@/types";

interface HeaderProps {
  user: AuthUser;
  onMenuToggle?: () => void;
  title?: string;
}

export function Header({ user, onMenuToggle, title = "Dashboard" }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-background px-6">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role.toLowerCase().replace("_", " ")}
            </p>
          </div>
          <Avatar name={user.name} image={user.image} size="sm" />
        </div>
      </div>
    </header>
  );
}
