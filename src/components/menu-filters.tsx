"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X, MapPin } from "lucide-react";

const CATEGORIES = [
  "all",
  "Classic",
  "Vegetarian",
  "Meat Lovers",
  "Spicy",
  "Seafood",
  "Specialty",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function MenuFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "all";
  const currentLocation = searchParams.get("location") ?? "all"; // Added location
  const currentSort = searchParams.get("sort") ?? "newest";
  const urlSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(urlSearch);
  const [locations, setLocations] = useState<string[]>([]); // State for locations

  // Fetch unique locations on mount
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
    fetch(`${baseUrl}/api/menu-items/locations`)
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Failed to load locations", err));
  }, []);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "sort" && value === "newest")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.delete("page"); // Reset to page 1 on filter change

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Debounce the search box
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== urlSearch) {
        updateParams({ search: search.trim() });
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasFilters =
    urlSearch !== "" ||
    currentCategory !== "all" ||
    currentLocation !== "all" ||
    currentSort !== "newest";

  function clearAll() {
    setSearch("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pizzas by name or description..."
            className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={currentLocation}
            onChange={(e) => updateParams({ location: e.target.value })}
            className="h-11 w-full appearance-none rounded-lg border bg-background pl-10 pr-8 text-sm outline-none transition focus:ring-2 focus:ring-primary/40 sm:w-auto"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="h-11 rounded-lg border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/40"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const active = currentCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => updateParams({ category: cat })}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          );
        })}

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-1 inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <X className="size-4" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}