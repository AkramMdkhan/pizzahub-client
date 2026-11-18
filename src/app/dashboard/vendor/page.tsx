"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  Crown,
  PlusCircle,
  ListOrdered,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

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

export default function VendorOverviewPage() {
  const [menuCount, setMenuCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiFetch<{ total: number }>("/api/menu-items/mine");
        setMenuCount(data.total);
      } catch {
        setMenuCount(0);
      }
    }

    loadStats();
  }, []);

  const stats = [
    {
      title: "Menu Items",
      value: menuCount === null ? "..." : String(menuCount),
      description: "Pizzas on your menu",
      icon: UtensilsCrossed,
    },
    {
      title: "Total Orders",
      value: "0",
      description: "Orders received",
      icon: ShoppingBag,
    },
    {
      title: "Revenue",
      value: "$0.00",
      description: "From completed orders",
      icon: DollarSign,
    },
    {
      title: "Plan",
      value: "Free",
      description: "Upgrade to Premium",
      icon: Crown,
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{stat.title}</CardDescription>
              <stat.icon className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

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
            Your latest incoming orders will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-6 text-center text-sm text-muted-foreground">
            No orders yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}