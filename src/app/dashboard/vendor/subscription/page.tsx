"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

interface PlanStatus {
  plan: "free" | "premium";
  isPremium: boolean;
  expiresAt: string | null;
}

const FREE_FEATURES = [
  "Up to 3 active menu items",
  "Basic vendor dashboard",
  "Order management",
];

const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium vendor badge",
  "Featured menu placement",
  "All Free features",
];

function formatDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function VendorSubscriptionPage() {
  const [status, setStatus] = useState<PlanStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch<PlanStatus>("/api/stripe/status")
      .then((data) => {
        if (!cancelled) setStatus(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load your plan"
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const data = await apiFetch<{ url: string }>("/api/stripe/checkout", {
        method: "POST",
      });
      // Send the vendor to Stripe's hosted payment page
      window.location.href = data.url;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not start the payment"
      );
      setUpgrading(false);
    }
  }

  const isPremium = status?.isPremium ?? false;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Subscription
        </h1>
        <p className="mt-1 text-muted-foreground">
          Choose the plan that fits your restaurant.
        </p>
      </div>

      {/* Current plan */}
      <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
          <Crown className="size-6 text-orange-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Your current plan</p>
          {loading ? (
            <Loader2 className="mt-1 size-5 animate-spin text-muted-foreground" />
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <>
              <p className="text-xl font-bold">
                {isPremium ? "Premium" : "Free"}
              </p>
              {isPremium && status?.expiresAt && (
                <p className="text-sm text-muted-foreground">
                  Active until {formatDate(status.expiresAt)}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className={!isPremium && !loading ? "border-orange-500" : ""}>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>For getting started</CardDescription>
            <p className="pt-2 text-3xl font-bold">
              $0
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / month
              </span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="outline" disabled className="w-full">
              {!isPremium && !loading ? "Current plan" : "Free plan"}
            </Button>
          </CardContent>
        </Card>

        <Card className={isPremium ? "border-orange-500" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Premium</CardTitle>
              <span className="rounded-full bg-orange-500 px-3 py-0.5 text-xs font-medium text-white">
                Recommended
              </span>
            </div>
            <CardDescription>For growing restaurants</CardDescription>
            <p className="pt-2 text-3xl font-bold">
              $19.99
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / month
              </span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {PREMIUM_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>

            {isPremium ? (
              <Button disabled className="w-full">
                Current plan
              </Button>
            ) : (
              <Button
                onClick={handleUpgrade}
                disabled={upgrading || loading || !!error}
                className="w-full bg-orange-500 text-white hover:bg-orange-600"
              >
                {upgrading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to payment...
                  </>
                ) : (
                  "Upgrade to Premium"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Payments are processed securely by Stripe. Your plan is activated only
        after Stripe confirms the payment.
      </p>
    </div>
  );
}