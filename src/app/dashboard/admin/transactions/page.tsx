"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Receipt, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

interface Transaction {
  _id: string;
  vendorId: string;
  vendorEmail?: string;
  vendorName?: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface ListResponse {
  items: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  succeeded: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  // Debounce search input
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

  // Fetch transactions
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    apiFetch<ListResponse>(`/api/admin/transactions?${params.toString()}`)
      .then((data) => {
        if (cancelled) return;
        setTransactions(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load transactions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page, reloadKey]);

  function reload() {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }

  function goToPage(target: number) {
    setLoading(true);
    setPage(target);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Transactions
        </h1>
        <p className="mt-1 text-muted-foreground">
          View subscription payments. These records are read-only and cannot be modified.
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by vendor email..."
            className="pl-10"
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {loading ? "Loading..." : `${total} transaction${total === 1 ? "" : "s"} found`}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed py-14 text-center">
          <p className="font-semibold">Could not load transactions</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button onClick={reload} className="mt-4 bg-orange-500 text-white hover:bg-orange-600">
            Try again
          </Button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed py-16 text-center">
          <Receipt className="mb-3 size-10 text-muted-foreground" />
          <p className="text-lg font-semibold">No transactions found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Subscription payments will appear here once vendors upgrade.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium">Vendor</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {tx._id}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{tx.vendorName || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{tx.vendorEmail || "No email"}</p>
                    </td>
                    <td className="px-4 py-3 capitalize">{tx.plan || "Premium"}</td>
                    <td className="px-4 py-3 font-semibold">
                      ${Number(tx.amount || 0).toFixed(2)} {tx.currency?.toUpperCase() || "USD"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                        ${STATUS_STYLES[tx.status] || STATUS_STYLES.pending}`}>
                        {tx.status || "paid"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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