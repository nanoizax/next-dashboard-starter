import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { AuthUser } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user: AuthUser = {
    id: session.user.id,
    name: session.user.name!,
    email: session.user.email!,
    role: session.user.role,
    image: session.user.image,
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
