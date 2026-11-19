"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Utensils,
  Clock,
  CheckCircle2,
  Crown,
  PlusCircle,
  ListOrdered,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

interface MenuItemLite {
  _id: string;
  status?: "pending" | "approved" | "rejected" | "inactive";
}

interface OrderStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
}

interface Order {
  _id: string;
  itemName: string;
  itemImage: string;
  customerName?: string;
  deliveryDate: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
}

const quickActions = [
  {
    title: "Add Menu Item",
    description: "Create a new pizza for your menu",
    href: "/dashboard/vendor/add-item",
    icon: PlusCircle,
  },
  {
    title: "Manage Menu",
    description: "Edit or remove your existing items",
    href: "/dashboard/vendor/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "Incoming Orders",
    description: "Review and update order status",
    href: "/dashboard/vendor/orders",
    icon: ListOrdered,
  },
];

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  accepted: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  cancelled: "bg-muted text-muted-foreground",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function VendorOverviewPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<MenuItemLite[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      apiFetch<{ items: MenuItemLite[] }>("/api/menu-items/mine"),
      apiFetch<OrderStats>("/api/orders/stats"),
      apiFetch<{ items: Order[] }>("/api/orders/vendor"),
    ])
      .then(([itemsData, statsData, ordersData]) => {
        if (cancelled) return;
        setItems(itemsData.items);
        setStats(statsData);
        setRecentOrders(ordersData.items.slice(0, 5));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load your dashboard"
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const plan =
    (session?.user as { subscriptionPlan?: string } | undefined)
      ?.subscriptionPlan === "premium"
      ? "Premium"
      : "Free";

  const activeItems = items.filter((i) => i.status === "approved").length;
  const waitingApproval = items.filter((i) => i.status === "pending").length;

  const cards = [
    {
      title: "Total Menu Items",
      value: items.length,
      description: "All pizzas you have added",
      icon: Utensils,
    },
    {
      title: "Active Menu Items",
      value: activeItems,
      description: "Approved and visible to customers",
      icon: UtensilsCrossed,
    },
    {
      title: "Pending Orders",
      value: stats?.pending ?? 0,
      description: "Waiting for your decision",
      icon: Clock,
    },
    {
      title: "Accepted Orders",
      value: stats?.accepted ?? 0,
      description: "Orders you have accepted",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Vendor Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your menu, track orders, and grow your restaurant.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-dashed py-4 text-center text-sm text-muted-foreground">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{stat.title}</CardDescription>
              <stat.icon className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  stat.value
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Current Plan</CardDescription>
            <Crown className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {plan === "Premium"
                ? "Unlimited active items"
                : "Up to 3 active items"}
            </p>
          </CardContent>
        </Card>
      </div>

      {!loading && waitingApproval > 0 && (
        <div className="rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {waitingApproval} item{waitingApproval === 1 ? " is" : "s are"}{" "}
          waiting for admin approval and not visible to customers yet.
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="h-full transition-colors hover:border-orange-500">
                <CardHeader>
                  <action.icon className="mb-2 h-6 w-6 text-orange-500" />
                  <CardTitle className="text-base">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Your latest incoming orders appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No orders yet.
            </p>
          ) : (
            <div className="divide-y">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.itemImage}
                    alt={order.itemName}
                    className="size-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{order.itemName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName || "Customer"} · Delivery{" "}
                      {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${
                      STATUS_STYLES[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          {recentOrders.length > 0 && (
            <div className="mt-4 text-right">
              <Link
                href="/dashboard/vendor/orders"
                className="text-sm font-medium text-orange-500 hover:underline"
              >
                View all orders
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}