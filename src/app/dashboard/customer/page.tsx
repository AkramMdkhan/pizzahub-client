"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Loader2, Pizza, ShoppingBag, Truck, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Order {
  _id: string;
  itemName: string;
  itemImage: string;
  deliveryDate: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
}

interface StatsData {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
}

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

export default function CustomerOverviewPage() {
  const { data: session, isPending } = useSession();

  const [statsData, setStatsData] = useState<StatsData>({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      apiFetch<StatsData>("/api/orders/stats"),
      apiFetch<{ items: Order[] }>("/api/orders/mine"),
    ])
      .then(([stats, ordersData]) => {
        if (cancelled) return;
        setStatsData(stats);
        setRecentOrders(ordersData.items.slice(0, 3));
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isPending || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0] || "Customer";

  const stats = [
    { label: "Total Orders", value: statsData.total, icon: ShoppingBag },
    { label: "Pending", value: statsData.pending, icon: Clock },
    { label: "Accepted", value: statsData.accepted, icon: Truck },
    { label: "Rejected", value: statsData.rejected, icon: XCircle },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-[family-name:var(--font-poppins)] text-2xl font-bold sm:text-3xl">
            Welcome back, {firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here is a quick look at your PizzaHub orders.
          </p>
        </div>
        <Link
          href="/menu"
          className={cn(
            buttonVariants(),
            "gap-2 bg-orange-500 text-white hover:bg-orange-600"
          )}
        >
          <Pizza className="h-4 w-4" />
          Order a pizza
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <stat.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-[family-name:var(--font-poppins)] text-2xl font-bold">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>
            Your latest orders will show up here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-center">
              <Pizza className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                You have not placed any orders yet.
              </p>
              <Link href="/menu" className={buttonVariants({ variant: "outline" })}>
                Browse the menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center gap-4 rounded-xl border p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.itemImage}
                    alt={order.itemName}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{order.itemName}</p>
                    <p className="text-sm text-muted-foreground">
                      Delivery: {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        STATUS_STYLES[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link
                  href="/dashboard/customer/orders"
                  className="text-sm font-medium text-orange-500 hover:underline"
                >
                  View all orders
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}