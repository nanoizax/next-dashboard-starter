import type { Metadata } from "next";
import { Users, UserCheck, Shield, TrendingUp } from "lucide-react";
import { getDashboardStats } from "@/server/actions/users";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          description="All registered accounts"
          icon={Users}
          iconClassName="bg-blue-100"
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          description="Currently active accounts"
          icon={UserCheck}
          iconClassName="bg-green-100"
          trend={{
            value: stats.totalUsers
              ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
              : 0,
            isPositive: true,
          }}
        />
        <StatsCard
          title="Administrators"
          value={stats.adminUsers}
          description="Users with admin access"
          icon={Shield}
          iconClassName="bg-purple-100"
        />
        <StatsCard
          title="New This Month"
          value={stats.newUsersThisMonth}
          description="Registrations this month"
          icon={TrendingUp}
          iconClassName="bg-orange-100"
        />
      </div>

      {/* Quick overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/dashboard/users"
              className="flex items-center gap-3 rounded-md border border-border p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Users className="h-4 w-4 text-primary" />
              Manage Users
            </a>
            <a
              href="/dashboard/users"
              className="flex items-center gap-3 rounded-md border border-border p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Shield className="h-4 w-4 text-primary" />
              Review Permissions
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Current platform status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">User Activation Rate</span>
              <span className="text-sm font-semibold">
                {stats.totalUsers
                  ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%`
                  : "N/A"}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: stats.totalUsers
                    ? `${(stats.activeUsers / stats.totalUsers) * 100}%`
                    : "0%",
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Admin Ratio</span>
              <span className="text-sm font-semibold">
                {stats.totalUsers
                  ? `${Math.round((stats.adminUsers / stats.totalUsers) * 100)}%`
                  : "N/A"}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-purple-500 transition-all"
                style={{
                  width: stats.totalUsers
                    ? `${(stats.adminUsers / stats.totalUsers) * 100}%`
                    : "0%",
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
