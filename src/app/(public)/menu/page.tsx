import { Suspense } from "react";
import { SearchX } from "lucide-react";
import PizzaCard, { MenuItem } from "@/components/pizza-card";
import MenuFilters from "@/components/menu-filters";
import MenuPagination from "@/components/menu-pagination";

export const metadata = {
  title: "Menu",
  description: "Browse, search and filter pizzas from all our restaurants.",
};

interface MenuResponse {
  items: MenuItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface MenuPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string; // Added location
    sort?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 9;

async function getMenu(params: {
  search?: string;
  category?: string;
  location?: string; // Added location
  sort?: string;
  page?: string;
}): Promise<MenuResponse | null> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.location) query.set("location", params.location); // Added location
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", params.page);
  query.set("limit", String(PAGE_SIZE));

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  try {
    const res = await fetch(`${baseUrl}/api/menu-items?${query.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as MenuResponse;
  } catch {
    return null;
  }
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const data = await getMenu(params);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">
          Our <span className="text-primary">Menu</span>
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Browse pizzas from all our partner restaurants. Search, filter by
          category, location and sort by price to find your favorite.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-28" />}>
          <MenuFilters />
        </Suspense>
      </div>

      {/* Results */}
      {data === null ? (
        <div className="rounded-2xl border border-dashed py-16 text-center">
          <p className="text-lg font-semibold">Could not load the menu</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please check that the server is running and try again.
          </p>
        </div>
      ) : data.items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed py-16 text-center">
          <SearchX className="mb-3 size-10 text-muted-foreground" />
          <p className="text-lg font-semibold">No pizzas found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or clear your filters.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {data.items.length} of {data.total} pizza
            {data.total === 1 ? "" : "s"}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <PizzaCard key={item._id} item={item} />
            ))}
          </div>

          <div className="mt-10">
            <Suspense fallback={null}>
              <MenuPagination page={data.page} totalPages={data.totalPages} />
            </Suspense>
          </div>
        </>
      )}
    </section>
  );
}