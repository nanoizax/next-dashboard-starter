import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
import { UserTable } from "@/components/dashboard/UserTable";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage user accounts",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage and monitor all user accounts
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <UserTable />
    </div>
  );
}
