"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

type UserRole = "customer" | "vendor" | "admin";

interface AdminUser {
  _id: string;
  name?: string;
  email?: string;
  image?: string | null;
  role?: UserRole;
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string | null;
  createdAt?: string;
}

interface ListResponse {
  items: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

const ROLE_FILTERS = [
  { value: "", label: "All roles" },
  { value: "customer", label: "Customers" },
  { value: "vendor", label: "Vendors" },
  { value: "admin", label: "Admins" },
];

const ROLE_STYLES: Record<UserRole, string> = {
  customer: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  vendor: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
};

const PAGE_SIZE = 10;

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name?: string, email?: string) {
  const source = (name || email || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  const letters =
    parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    if (role) params.set("role", role);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    apiFetch<ListResponse>(`/api/admin/users?${params.toString()}`)
      .then((data) => {
        if (cancelled) return;
        setUsers(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load users");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, role, page, reloadKey]);

  function reload() {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }

  function changeRole(value: string) {
    setLoading(true);
    setRole(value);
    setPage(1);
  }

  function goToPage(target: number) {
    setLoading(true);
    setPage(target);
    setExpandedId(null);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Manage Users
        </h1>
        <p className="mt-1 text-muted-foreground">
          See everyone registered on PizzaHub and look up their details.
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-10"
          />
        </div>
        <select
          value={role}
          onChange={(e) => changeRole(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          {ROLE_FILTERS.map((f) => (
            <option key={f.value} value={f.value} className="text-black">
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-muted-foreground">
        {loading ? "Loading..." : `${total} user${total === 1 ? "" : "s"} found`}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed py-14 text-center">
          <p className="font-semibold">Could not load users</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={reload}
            className="mt-4 bg-orange-500 text-white hover:bg-orange-600"
          >
            Try again
          </Button>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed py-16 text-center">
          <Users className="mb-3 size-10 text-muted-foreground" />
          <p className="text-lg font-semibold">No users found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or role filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const userRole: UserRole = user.role ?? "customer";
            const expanded = expandedId === user._id;

            return (
              <div
                key={user._id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      referrerPolicy="no-referrer"
                      className="size-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
                      {getInitials(user.name, user.email)}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold">
                        {user.name || "Unnamed user"}
                      </p>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${ROLE_STYLES[userRole]}`}
                      >
                        {userRole}
                      </span>
                      {user.isBlocked && (
                        <span className="rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-400">
                          Blocked
                        </span>
                      )}
                    </div>
                    <p className="break-all text-sm text-muted-foreground">
                      {user.email || "No email"}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedId(expanded ? null : user._id)}
                  >
                    {expanded ? "Hide details" : "View details"}
                    {expanded ? (
                      <ChevronUp className="ml-1 size-4" />
                    ) : (
                      <ChevronDown className="ml-1 size-4" />
                    )}
                  </Button>
                </div>

                {expanded && (
                  <div className="grid gap-4 border-t bg-muted/40 px-4 py-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="font-medium">Joined</p>
                      <p className="mt-1 text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Account status</p>
                      <p className="mt-1 text-muted-foreground">
                        {user.isBlocked ? "Blocked" : "Active"}
                      </p>
                    </div>
                    {userRole === "vendor" && (
                      <>
                        <div>
                          <p className="font-medium">Business name</p>
                          <p className="mt-1 text-muted-foreground">
                            {user.businessName || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Subscription</p>
                          <p className="mt-1 text-muted-foreground capitalize">
                            {user.subscriptionPlan || "free"}
                            {user.subscriptionPlan === "premium" &&
                              user.subscriptionExpiresAt &&
                              ` until ${formatDate(user.subscriptionExpiresAt)}`}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="sm:col-span-2">
                      <p className="font-medium">User ID</p>
                      <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                        {user._id}
                      </p>
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