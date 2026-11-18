import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Clock, Pizza, ShoppingBag, Truck } from "lucide-react";
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

const stats = [
  { label: "Total Orders", value: "0", icon: ShoppingBag },
  { label: "Pending", value: "0", icon: Clock },
  { label: "Delivered", value: "0", icon: Truck },
];

export default async function CustomerOverviewPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const firstName = session.user.name.split(" ")[0];

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
      <div className="grid gap-4 sm:grid-cols-3">
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
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-center">
            <Pizza className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              You have not placed any orders yet.
            </p>
            <Link href="/menu" className={buttonVariants({ variant: "outline" })}>
              Browse the menu
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}