"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
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

interface PaymentDetails {
  paymentStatus: string;
  amount: number | null;
  currency: string | null;
  email: string | null;
}

type Activation = "checking" | "active" | "delayed";

// Check every 2 seconds, up to 30 times: 60 seconds in total
const CHECK_INTERVAL_MS = 2000;
const MAX_CHECKS = 30;

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

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [activation, setActivation] = useState<Activation>("checking");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [details, setDetails] = useState<PaymentDetails | null>(null);

  // Read-only payment details for the confirmation box
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    apiFetch<PaymentDetails>(`/api/stripe/session/${sessionId}`)
      .then((data) => {
        if (!cancelled) setDetails(data);
      })
      .catch(() => {
        // The confirmation box is optional, so a failure here is ignored
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // Wait for the verified webhook to switch the plan.
  // This page never activates Premium itself: it only reads the plan.
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    async function check() {
      try {
        const status = await apiFetch<PlanStatus>("/api/stripe/status");
        if (cancelled) return;
        if (status.isPremium) {
          setExpiresAt(status.expiresAt);
          setActivation("active");
          return;
        }
      } catch {
        // Try again on the next round
      }

      attempts += 1;
      if (attempts >= MAX_CHECKS) {
        if (!cancelled) setActivation("delayed");
        return;
      }
      timer = setTimeout(check, CHECK_INTERVAL_MS);
    }

    check();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId]);

  // Someone opened this address by hand, without paying
  if (!sessionId) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <XCircle className="mx-auto size-12 text-red-500" />
          <CardTitle>No payment found</CardTitle>
          <CardDescription>
            This page is shown after a successful payment. Start an upgrade from
            the Subscription page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/vendor/subscription">
            <Button className="bg-orange-500 text-white hover:bg-orange-600">
              Go to Subscription
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardHeader>
        {activation === "active" ? (
          <CheckCircle2 className="mx-auto size-14 text-green-600" />
        ) : activation === "delayed" ? (
          <Clock className="mx-auto size-14 text-amber-500" />
        ) : (
          <Loader2 className="mx-auto size-14 animate-spin text-orange-500" />
        )}

        <CardTitle className="text-2xl">
          {activation === "active"
            ? "You are now Premium!"
            : activation === "delayed"
              ? "Payment received"
              : "Confirming your payment..."}
        </CardTitle>

        <CardDescription>
          {activation === "active"
            ? expiresAt
              ? `Your Premium plan is active until ${formatDate(expiresAt)}.`
              : "Your Premium plan is active."
            : activation === "delayed"
              ? "Stripe has your payment, but activating Premium is taking longer than usual. Open the Subscription page and refresh it in a minute. If your plan is still Free after a few minutes, contact support."
              : "Please wait while Stripe confirms your payment. This usually takes a few seconds."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {details && (
          <div className="rounded-xl border bg-muted/40 p-4 text-left text-sm">
            <p className="mb-2 font-medium">Payment details</p>
            <div className="space-y-1 text-muted-foreground">
              <p>
                Plan: <span className="text-foreground">PizzaHub Premium</span>
              </p>
              {details.amount !== null && (
                <p>
                  Amount:{" "}
                  <span className="text-foreground">
                    {(details.amount / 100).toFixed(2)}{" "}
                    {(details.currency || "usd").toUpperCase()}
                  </span>
                </p>
              )}
              {details.email && (
                <p>
                  Receipt sent to:{" "}
                  <span className="break-all text-foreground">
                    {details.email}
                  </span>
                </p>
              )}
              <p className="capitalize">
                Payment status:{" "}
                <span className="text-foreground">{details.paymentStatus}</span>
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/vendor/add-item">
            <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 sm:w-auto">
              Add menu item
            </Button>
          </Link>
          <Link href="/dashboard/vendor/subscription">
            <Button variant="outline" className="w-full sm:w-auto">
              View subscription
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}