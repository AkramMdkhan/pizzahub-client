"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MapPin,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

interface Order {
  _id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  itemPrice?: number;
  vendorEmail?: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
}

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  accepted: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  cancelled: "bg-muted text-muted-foreground",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetches on first load and again whenever reloadKey changes.
  // State is only set after the request finishes, never directly in the effect.
  useEffect(() => {
    let cancelled = false;

    apiFetch<{ items: Order[] }>("/api/orders/mine")
      .then((data) => {
        if (cancelled) return;
        setOrders(data.items);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load orders");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Called from buttons (not from the effect), so setting state here is fine
  function reload() {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }

  async function handleCancel(id: string) {
    setCancellingId(id);
    try {
      const updated = await apiFetch<Order>(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: { status: "cancelled" },
      });
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      setConfirmId(null);
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel order");
      // The order may have changed in the meantime, so show the latest data
      reload();
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          My Orders
        </h1>
        <p className="mt-1 text-muted-foreground">
          {loading
            ? "Loading your orders..."
            : `${orders.length} order${orders.length === 1 ? "" : "s"} placed`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed py-14 text-center">
          <p className="font-semibold">Could not load your orders</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={reload}
            className="mt-4 bg-orange-500 text-white hover:bg-orange-600"
          >
            Try again
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed py-16 text-center">
          <PackageOpen className="mb-3 size-10 text-muted-foreground" />
          <p className="text-lg font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a pizza from the menu and place your first order.
          </p>
          <Link
            href="/menu"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-orange-500 px-5 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const expanded = expandedId === order._id;
            const confirming = confirmId === order._id;
            const cancelling = cancellingId === order._id;

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.itemImage}
                    alt={order.itemName}
                    className="h-32 w-full shrink-0 rounded-xl object-cover sm:h-28 sm:w-32"
                  />

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-semibold">
                        {order.itemName}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${
                          STATUS_STYLES[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Vendor: {order.vendorEmail || "Not available"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Delivery: {formatDate(order.deliveryDate)}
                    </p>
                    <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 size-4 shrink-0" />
                      <span className="line-clamp-2">
                        {order.deliveryAddress}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpandedId(expanded ? null : order._id)
                      }
                    >
                      {expanded ? "Hide details" : "View details"}
                      {expanded ? (
                        <ChevronUp className="ml-1 size-4" />
                      ) : (
                        <ChevronDown className="ml-1 size-4" />
                      )}
                    </Button>

                    {order.status === "pending" && !confirming && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setConfirmId(order._id)}
                      >
                        Cancel order
                      </Button>
                    )}
                  </div>
                </div>

                {/* Inline confirmation instead of a browser confirm box */}
                {order.status === "pending" && confirming && (
                  <div className="flex flex-col gap-3 border-t bg-red-50 px-4 py-3 text-sm dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between">
                    <span>Cancel this order? This cannot be undone.</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={cancelling}
                        onClick={() => handleCancel(order._id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        {cancelling ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          "Yes, cancel"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={cancelling}
                        onClick={() => setConfirmId(null)}
                      >
                        Keep order
                      </Button>
                    </div>
                  </div>
                )}

                {expanded && (
                  <div className="grid gap-4 border-t bg-muted/40 px-4 py-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="font-medium">Full delivery address</p>
                      <p className="mt-1 whitespace-pre-line text-muted-foreground">
                        {order.deliveryAddress}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Your message</p>
                      <p className="mt-1 whitespace-pre-line text-muted-foreground">
                        {order.message || "No message"}
                      </p>
                    </div>
                    {typeof order.itemPrice === "number" && (
                      <div>
                        <p className="font-medium">Price</p>
                        <p className="mt-1 text-muted-foreground">
                          ${order.itemPrice.toFixed(2)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">Item</p>
                      <Link
                        href={`/menu/${order.itemId}`}
                        className="mt-1 inline-block text-orange-500 hover:underline"
                      >
                        View pizza
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}