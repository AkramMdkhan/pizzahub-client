import { Metadata } from "next";
import { Pizza, Flame, Users, Store, ShieldCheck, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about PizzaHub and our mission.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Top Header Section (Warm Gradient) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500/15 via-background to-red-500/10 pt-20 pb-32">
        {/* Decorative faint icons */}
        <Pizza className="absolute top-10 left-10 h-40 w-40 text-primary/5 -rotate-12" />
        <Flame className="absolute bottom-10 right-10 h-40 w-40 text-primary/5 rotate-12" />
        
        <div className="container mx-auto max-w-3xl px-4 relative z-10 text-center">
          <h1 className="font-poppins text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            About <span className="text-primary">PizzaHub</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We connect hungry customers with the best local pizza vendors, making it easier than ever to get your favorite slice delivered hot and fresh.
          </p>
        </div>
      </section>

      {/* Floating Info Cards (Overlapping the header) */}
      <section className="container mx-auto max-w-5xl px-4 -mt-20 relative z-20">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-none shadow-lg bg-card/80 backdrop-blur-md transition-transform hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-poppins text-lg font-semibold mb-2">For Customers</h3>
              <p className="text-sm text-muted-foreground">
                Discover local pizzerias, browse menus, and track your orders from the moment you click &quot;Order&quot; to the moment it arrives at your door.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card/80 backdrop-blur-md transition-transform hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="font-poppins text-lg font-semibold mb-2">For Vendors</h3>
              <p className="text-sm text-muted-foreground">
                Grow your restaurant business with a powerful dashboard to manage your menu, accept orders, and reach more hungry customers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card/80 backdrop-blur-md transition-transform hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-poppins text-lg font-semibold mb-2">Our Promise</h3>
              <p className="text-sm text-muted-foreground">
                We verify every vendor and review every menu item to ensure you get exactly what you expect, safely and reliably.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Story Section (Now inside a Card with Primary Color Icon) */}
      <section className="container mx-auto max-w-3xl px-4 mt-20">
        <div className="text-center mb-8">
          {/* Changed to primary color */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-7 w-7 text-primary fill-primary/20" />
          </div>
          <h2 className="font-poppins text-2xl font-bold">Our Story</h2>
        </div>

        <Card className="border-border/50 shadow-md">
          <CardContent className="p-8 sm:p-10">
            <div className="text-muted-foreground leading-relaxed text-center space-y-6">
              <p>
                PizzaHub started with a simple idea: ordering a great pizza should be as easy as eating one. We noticed that discovering local, high-quality pizzerias often meant digging through outdated websites or relying on word of mouth.
              </p>
              <p>
                Today, PizzaHub is a complete platform that brings together the best local restaurants in one place. Whether you are a customer craving a late-night slice or a restaurant owner looking to expand your reach, PizzaHub provides the tools and the audience to make it happen.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}