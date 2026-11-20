import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MenuItem } from "@/components/pizza-card";
import { PopularPizzasGrid } from "./popular-pizzas-grid";

interface MenuResponse {
  items: MenuItem[];
}

async function getLatestPizzas(): Promise<MenuItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  try {
    const res = await fetch(
      `${baseUrl}/api/menu-items?sort=newest&limit=6`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as MenuResponse;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function PopularPizzas() {
  const pizzas = await getLatestPizzas();

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              Popular right now
            </span>
            <h2 className="mt-2 font-[family-name:var(--font-poppins)] text-3xl font-bold sm:text-4xl">
              Customer Favorite Pizzas
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition hover:bg-muted"
          >
            View full menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        {pizzas.length > 0 ? (
          <PopularPizzasGrid items={pizzas} />
        ) : (
          <div className="rounded-2xl border border-dashed py-14 text-center">
            <p className="font-semibold">No pizzas available yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back soon, our restaurants are adding their menus.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

