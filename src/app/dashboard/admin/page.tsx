"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ClipboardCheck,
  Loader2,
  Receipt,
  Store,
  UserRound,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;
}

const ROLE_COLORS = ["#f97316", "#ef4444", "#f59e0b"];
const ITEM_COLORS = ["#f59e0b", "#22c55e"];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    apiFetch<AdminStats>("/api/admin/stats")
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load admin stats"
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      description: "All registered accounts",
      icon: Users,
    },
    {
      title: "Total Vendors",
      value: stats?.totalVendors ?? 0,
      description: "Restaurant owners",
      icon: Store,
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers ?? 0,
      description: "Pizza lovers ordering",
      icon: UserRound,
    },
    {
      title: "Total Menu Items",
      value: stats?.totalMenuItems ?? 0,
      description: "Submitted by vendors",
      icon: UtensilsCrossed,
    },
    {
      title: "Pending Menu Items",
      value: stats?.pendingMenuItems ?? 0,
      description: "Waiting for review",
      icon: ClipboardCheck,
    },
    {
      title: "Total Transactions",
      value: stats?.totalTransactions ?? 0,
      description: "Subscription payments",
      icon: Receipt,
    },
  ];

  const admins = stats
    ? Math.max(0, stats.totalUsers - stats.totalVendors - stats.totalCustomers)
    : 0;

  const roleData = stats
    ? [
        { name: "Customers", value: stats.totalCustomers },
        { name: "Vendors", value: stats.totalVendors },
        { name: "Admins", value: admins },
      ].filter((d) => d.value > 0)
    : [];

  const itemData = stats
    ? [
        { name: "Pending review", value: stats.pendingMenuItems },
        {
          name: "Reviewed",
          value: Math.max(0, stats.totalMenuItems - stats.pendingMenuItems),
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          A quick look at users, menu items and payments across PizzaHub.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-dashed py-4 text-center text-sm text-muted-foreground">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      </div>

      {/* Pending items shortcut */}
      {!loading && stats && stats.pendingMenuItems > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border bg-muted/40 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground">
            {stats.pendingMenuItems} menu item
            {stats.pendingMenuItems === 1 ? " is" : "s are"} waiting for your
            review.
          </span>
          <Link
            href="/dashboard/admin/menu-items"
            className="font-medium text-orange-500 hover:underline"
          >
            Review now
          </Link>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Users by role</CardTitle>
            <CardDescription>How accounts are split on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
              </div>
            ) : roleData.length === 0 ? (
              <p className="py-20 text-center text-sm text-muted-foreground">
                No users yet.
              </p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {roleData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={ROLE_COLORS[index % ROLE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menu items by review status</CardTitle>
            <CardDescription>
              Items still waiting for approval versus items already reviewed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={itemData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {itemData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={ITEM_COLORS[index % ITEM_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}