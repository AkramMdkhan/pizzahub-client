"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  CreditCard,
  Home,
  LayoutDashboard,
  Menu,
  Pizza,
  Receipt,
  ShoppingBag,
  UserRound,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

type Role = "customer" | "vendor" | "admin";

interface NavItem {
  label: string;
  href: string;
  icon: typeof Home;
}

const navByRole: Record<Role, NavItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
    { label: "Profile", href: "/dashboard/customer/profile", icon: UserRound },
  ],
  vendor: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "My Menu", href: "/dashboard/vendor/menu", icon: UtensilsCrossed },
    { label: "Orders", href: "/dashboard/vendor/orders", icon: ClipboardList },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Manage Menu Items",
      href: "/dashboard/admin/menu-items",
      icon: UtensilsCrossed,
    },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
  ],
};

interface DashboardShellProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  };
  children: React.ReactNode;
}

function SidebarLinks({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  // Overview links match exactly; others match their sub-pages too.
  const isActive = (href: string) => {
    const isOverview = items[0]?.href === href;
    return isOverview ? pathname === href : pathname.startsWith(href);
  };

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive(item.href)
              ? "bg-orange-500 text-white"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarBody({
  role,
  onNavigate,
}: {
  role: Role;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/" className="flex items-center gap-2 px-2" onClick={onNavigate}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
          <Pizza className="h-5 w-5" />
        </span>
        <span className="font-[family-name:var(--font-poppins)] text-xl font-bold">
          Pizza<span className="text-orange-500">Hub</span>
        </span>
      </Link>

      <div className="space-y-2">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {role} panel
        </p>
        <SidebarLinks items={navByRole[role]} onNavigate={onNavigate} />
      </div>

      <div className="mt-auto border-t pt-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          Back to site
        </Link>
      </div>
    </div>
  );
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [open, setOpen] = useState(false);

  const role: Role =
    user.role === "admin" || user.role === "vendor" ? user.role : "customer";

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-muted/30 lg:block">
        <SidebarBody role={role} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur sm:px-6">
          {/* Mobile menu */}
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button variant="outline" size="icon" aria-label="Open menu" />
                }
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
                <SidebarBody role={role} onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          <p className="hidden text-sm font-medium capitalize text-muted-foreground lg:block">
            {role} dashboard
          </p>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu
              name={user.name}
              email={user.email}
              image={user.image}
              role={user.role}
            />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}