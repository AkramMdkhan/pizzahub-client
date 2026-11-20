"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Search,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

type ItemStatus = "pending" | "approved" | "rejected" | "inactive";

interface AdminItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  location?: string;
  vendorEmail?: string;
  status?: ItemStatus;
  createdAt?: string;
}

interface ListResponse {
  items: AdminItem[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "inactive", label: "Inactive" },
];

const STATUS_STYLES: Record<ItemStatus, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  inactive: "bg-muted text-muted-foreground",
};

const PAGE_SIZE = 10;

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Wait a moment after typing stops before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim();
      if (value !== search) {
        setLoading(true);
        setSearch(value);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  // Loads the list whenever the filters, the page or reloadKey change
  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    apiFetch<ListResponse>(`/api/admin/menu-items?${params.toString()}`)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load items");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, status, page, reloadKey]);

  function reload() {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }

  function changeStatusFilter(value: string) {
    setLoading(true);
    setStatus(value);
    setPage(1);
  }

  function goToPage(target: number) {
    setLoading(true);
    setPage(target);
  }

  async function updateStatus(id: string, newStatus: ItemStatus) {
    setSavingId(id);
    try {
      const updated = await apiFetch<AdminItem>(
        `/api/admin/menu-items/${id}/status`,
        { method: "PATCH", body: { status: newStatus } }
      );
      setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
      toast.success(`Item marked as ${newStatus}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update item"
      );
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(id: string) {
    setSavingId(id);
    try {
      await apiFetch(`/api/menu-items/${id}`, { method: "DELETE" });
      toast.success("Menu item deleted");
      setConfirmDeleteId(null);
      reload();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete item"
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Manage Menu Items
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review submitted pizzas, approve or reject them, and remove
          inappropriate items.
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, vendor email or location..."
            className="pl-10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => changeStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value} className="text-black">
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-muted-foreground">
        {loading ? "Loading..." : `${total} item${total === 1 ? "" : "s"} found`}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed py-14 text-center">
          <p className="font-semibold">Could not load items</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={reload}
            className="mt-4 bg-orange-500 text-white hover:bg-orange-600"
          >
            Try again
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed py-16 text-center">
          <UtensilsCrossed className="mb-3 size-10 text-muted-foreground" />
          <p className="text-lg font-semibold">No items found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const itemStatus: ItemStatus = item.status ?? "pending";
            const saving = savingId === item._id;
            const confirmingDelete = confirmDeleteId === item._id;

            return (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-32 w-full shrink-0 rounded-xl object-cover sm:h-24 sm:w-32"
                  />

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-semibold">{item.name}</h2>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[itemStatus]}`}
                      >
                        {itemStatus}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.category} · ${item.price.toFixed(2)}
                    </p>
                    <p className="break-all text-sm text-muted-foreground">
                      Vendor: {item.vendorEmail || "Not available"}
                    </p>
                    {item.location && (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0" />
                        {item.location}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 sm:w-44 sm:flex-col">
                    {(itemStatus === "pending" ||
                      itemStatus === "rejected" ||
                      itemStatus === "inactive") && (
                      <Button
                        size="sm"
                        disabled={saving}
                        onClick={() => updateStatus(item._id, "approved")}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        {itemStatus === "pending" ? "Approve" : "Re-approve"}
                      </Button>
                    )}
                    {itemStatus === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => updateStatus(item._id, "inactive")}
                      >
                        Set inactive
                      </Button>
                    )}
                    {(itemStatus === "pending" || itemStatus === "approved") && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => updateStatus(item._id, "rejected")}
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Reject
                      </Button>
                    )}
                    {!confirmingDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => setConfirmDeleteId(item._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>

                {confirmingDelete && (
                  <div className="flex flex-col gap-3 border-t bg-red-50 px-4 py-3 text-sm dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Delete this item permanently? This cannot be undone.
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={saving}
                        onClick={() => deleteItem(item._id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Yes, delete"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Keep item
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            <ChevronLeft className="mr-1 size-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}