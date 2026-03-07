"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import type { AuthUser } from "@/types";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/users": "Users",
  "/dashboard/settings": "Settings",
};

interface DashboardShellProps {
  children: React.ReactNode;
  user: AuthUser;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Find the most specific matching title
  const title =
    Object.entries(pageTitles)
      .sort(([a], [b]) => b.length - a.length)
      .find(([path]) => pathname === path || pathname.startsWith(path + "/"))?.[1] ??
    "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} title={title} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
