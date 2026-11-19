"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipboardList, Loader2, Mail, MapPin, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

interface Order {
  _id: string;
  itemName: string;
  itemImage: string;
  itemPrice?: number;
  customerName?: string;
  customerEmail?: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
}

type Decision = "accepted" | "rejected";

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

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    decision: Decision;
  } | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    apiFetch<{ items: Order[] }>("/api/orders/vendor")
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

  function reload() {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }

  async function handleDecision(id: string, decision: Decision) {
    setSavingId(id);
    try {
      const updated = await apiFetch<Order>(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: { status: decision },
      });
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      setPendingAction(null);
      toast.success(
        decision === "accepted" ? "Order accepted" : "Order rejected"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order");
      // The customer may have cancelled in the meantime, so show the latest data
      setPendingAction(null);
      reload();
    } finally {
      setSavingId(null);
    }
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Customer Orders
        </h1>
        <p className="mt-1 text-muted-foreground">
          {loading
            ? "Loading orders..."
            : `${orders.length} order${orders.length === 1 ? "" : "s"} in total, ${pendingCount} waiting for your decision`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed py-14 text-center">
          <p className="font-semibold">Could not load orders</p>
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
          <ClipboardList className="mb-3 size-10 text-muted-foreground" />
          <p className="text-lg font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders for your pizzas will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const action =
              pendingAction?.id === order._id ? pendingAction.decision : null;
            const saving = savingId === order._id;

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.itemImage}
                    alt={order.itemName}
                    className="h-36 w-full shrink-0 rounded-xl object-cover sm:h-28 sm:w-36"
                  />

                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{order.itemName}</h2>
                      {typeof order.itemPrice === "number" && (
                        <span className="text-sm font-medium text-orange-500">
                          ${order.itemPrice.toFixed(2)}
                        </span>
                      )}
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${
                          STATUS_STYLES[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <User className="size-4 shrink-0" />
                        {order.customerName || "Customer"}
                      </p>
                      <p className="flex items-center gap-2 break-all">
                        <Mail className="size-4 shrink-0" />
                        {order.customerEmail || "Not available"}
                      </p>
                      <p className="flex items-start gap-2 sm:col-span-2">
                        <MapPin className="mt-0.5 size-4 shrink-0" />
                        <span className="whitespace-pre-line">
                          {order.deliveryAddress}
                        </span>
                      </p>
                      <p className="flex items-start gap-2 sm:col-span-2">
                        <MessageSquare className="mt-0.5 size-4 shrink-0" />
                        <span className="whitespace-pre-line">
                          {order.message || "No message from the customer"}
                        </span>
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Delivery date: {formatDate(order.deliveryDate)} · Requested
                      on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {order.status === "pending" && !action && (
                    <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                      <Button
                        size="sm"
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() =>
                          setPendingAction({
                            id: order._id,
                            decision: "accepted",
                          })
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() =>
                          setPendingAction({
                            id: order._id,
                            decision: "rejected",
                          })
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>

                {/* Inline confirmation: a decision can only be made once */}
                {order.status === "pending" && action && (
                  <div className="flex flex-col gap-3 border-t bg-muted/60 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      {action === "accepted" ? "Accept" : "Reject"} this order?
                      This cannot be changed afterwards.
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={saving}
                        onClick={() => handleDecision(order._id, action)}
                        className={
                          action === "accepted"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : action === "accepted" ? (
                          "Yes, accept"
                        ) : (
                          "Yes, reject"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => setPendingAction(null)}
                      >
                        Go back
                      </Button>
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