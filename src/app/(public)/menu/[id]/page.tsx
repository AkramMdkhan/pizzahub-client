import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft, Crown, Leaf, MapPin, Store } from "lucide-react";
import type { MenuItem } from "@/components/pizza-card";
import OrderForm from "@/components/order-form";
import { auth } from "@/lib/auth";

type MenuItemWithLocation = MenuItem & {
  location?: string;
  isPremiumVendor?: boolean;
};

interface PizzaDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function getItem(id: string): Promise<MenuItemWithLocation | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  try {
    const res = await fetch(`${baseUrl}/api/menu-items/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as MenuItemWithLocation;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PizzaDetailsPageProps) {
  const { id } = await params;
  const item = await getItem(id);

  return {
    // The root layout adds "| PizzaHub" to every title
    title: item ? item.name : "Pizza not found",
    description: item?.description,
  };
}

export default async function PizzaDetailsPage({
  params,
}: PizzaDetailsPageProps) {
  const { id } = await params;

  // This page is private: logged-out visitors are sent to Sign In
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/menu/${id}`)}`);
  }

  // Missing, rejected or pending items show the 404 page
  const item = await getItem(id);
  if (!item) notFound();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/menu"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to menu
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="aspect-square h-full w-full object-cover"
          />
          {item.isPremiumVendor && (
            <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-yellow-500 px-4 py-1.5 text-sm font-bold text-black shadow-md">
              <Crown className="h-4 w-4" />
              Premium Vendor
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {item.category}
            </span>
            {item.isVegetarian && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                <Leaf className="size-3.5" />
                Vegetarian
              </span>
            )}
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">
            {item.name}
          </h1>

          <p className="mt-3 text-3xl font-bold text-primary">
            ${item.price.toFixed(2)}
          </p>

          <p className="mt-5 leading-relaxed text-muted-foreground">
            {item.description}
          </p>

          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-semibold">Ingredients</h2>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-full border bg-background px-3 py-1 text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            {item.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span>{item.location}</span>
              </div>
            )}
            {item.vendorEmail && (
              <div className="flex items-center gap-2">
                <Store className="size-4" />
                <span>Sold by {item.vendorEmail}</span>
              </div>
            )}
          </div>

          <OrderForm itemId={item._id} itemName={item.name} />
        </div>
      </div>
    </section>
  );
}