import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleGuardToast } from "@/components/role-guard-toast"; // <-- Added import
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { name, email, image, role } = session.user;

  return (
    <DashboardShell user={{ name, email, image, role }}>
      <RoleGuardToast /> {/* <-- Added here */}
      {children}
    </DashboardShell>
  );
}