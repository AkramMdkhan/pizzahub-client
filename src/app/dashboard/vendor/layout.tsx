import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const ROLES = ["admin", "vendor", "customer"];

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Not logged in: go to login
  if (!session) {
    redirect("/login");
  }

  // A missing or unknown role counts as customer
  const rawRole = (session.user as { role?: string }).role ?? "";
  const role = ROLES.includes(rawRole) ? rawRole : "customer";

  // Logged in with the wrong role: back to their own dashboard
  if (role !== "vendor") {
    redirect(`/dashboard/${role}?error=unauthorized`);
  }

  return <>{children}</>;
}