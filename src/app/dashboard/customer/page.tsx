import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Clock, Pizza, ShoppingBag, Truck, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

// 1. Define strict types for the data
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

// 2. Fetch real data from your Express server
async function getCustomerData(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
  
  try {
    const [statsRes, ordersRes] = await Promise.all([
      fetch(`${baseUrl}/api/orders/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/orders/mine`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    ]);

    if (!statsRes.ok || !ordersRes.ok) return null;

    const stats: StatsData = await statsRes.json();
    const ordersData: { items: Order[] } = await ordersRes.json();
    
    // Return only the 3 most recent orders for the overview
    return { stats, recentOrders: ordersData.items.slice(0, 3) };
  } catch (error) {
    return null;
  }
}

// 3. Generate a temporary JWT for the Express server
async function getExpressToken() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/token`, {
      headers: await headers(), 
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token as string;
  } catch {
    return null;
  }
}

export default async function CustomerOverviewPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const token = await getExpressToken();
  const data = token ? await getCustomerData(token) : null;

  // Fallback to 0 if the fetch fails
  const statsData: StatsData = data?.stats || { total: 0, pending: 0, accepted: 0, rejected: 0, cancelled: 0 };
  const recentOrders: Order[] = data?.recentOrders || [];

  const firstName = session.user.name.split(" ")[0];

  // 4. Map the stats to match the assignment requirements
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
                <div key={order._id} className="flex items-center gap-4 rounded-xl border p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.itemImage}
                    alt={order.itemName}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{order.itemName}</p>
                    <p className="text-sm text-muted-foreground">
                      Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize 
                      ${order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' : 
                        order.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : 
                        order.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' : 
                        'bg-muted text-muted-foreground'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link href="/dashboard/customer/orders" className="text-sm font-medium text-orange-500 hover:underline">
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