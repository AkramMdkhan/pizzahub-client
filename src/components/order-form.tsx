"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

interface OrderFormProps {
  itemId: string;
  itemName: string;
}

// Today's date in the visitor's own time zone, formatted as YYYY-MM-DD
function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function OrderForm({ itemId, itemName }: OrderFormProps) {
  const { data: session, isPending } = useSession();

  const [open, setOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const role = (session?.user as { role?: string } | undefined)?.role;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/api/orders", {
        method: "POST",
        body: {
          itemId,
          deliveryDate,
          deliveryAddress: deliveryAddress.trim(),
          message: message.trim(),
        },
      });

      toast.success("Order placed. The vendor will review it shortly.");
      setDeliveryDate("");
      setDeliveryAddress("");
      setMessage("");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  }

  const buttonClass =
    "mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg bg-orange-500 px-6 text-base font-medium text-white transition hover:bg-orange-600 sm:w-auto";

  // 1. Still checking the session
  if (isPending) {
    return (
      <div className="mt-8 h-12 w-full animate-pulse rounded-lg bg-muted sm:w-40" />
    );
  }

  // 2. Not logged in
  if (!session) {
    return (
      <div className="mt-8 space-y-2">
        <Link href="/login" className={`${buttonClass} mt-0`}>
          Log in to order
        </Link>
        <p className="text-sm text-muted-foreground">
          You need a customer account to place an order.
        </p>
      </div>
    );
  }

  // 3. Logged in as vendor or admin
  if (role !== "customer") {
    return (
      <div className="mt-8 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Only customer accounts can place orders. Vendors and admins cannot
        order items.
      </div>
    );
  }

  // 4. Customer: button first, then the form
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={buttonClass}>
        Order Now
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-2xl border bg-card p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">Order {itemName}</h2>
        <p className="text-sm text-muted-foreground">
          Tell us when and where to deliver. Payment is handled on delivery.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryDate">Delivery date</Label>
        <Input
          id="deliveryDate"
          type="date"
          min={getToday()}
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">Delivery address</Label>
        <Textarea
          id="deliveryAddress"
          placeholder="House, road, area, city"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          required
          minLength={5}
          maxLength={200}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orderMessage">Additional message (optional)</Label>
        <Textarea
          id="orderMessage"
          placeholder="Special instructions, e.g. no onions, ring the bell twice"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={300}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white hover:bg-orange-600 sm:flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Placing order...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}