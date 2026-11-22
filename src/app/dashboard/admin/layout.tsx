import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  // 1. Not logged in -> standard redirect
  if (!session) {
    redirect("/login");
  }

  const user = session.user as { role?: string };
  
  // 2. Logged in, but wrong role -> redirect with error message
  if (user.role !== "admin") {
    redirect(`/dashboard/${user.role}?error=unauthorized`);
  }

  return <>{children}</>;
}