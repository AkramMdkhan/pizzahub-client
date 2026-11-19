"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MenuPaginationProps {
  page: number;
  totalPages: number;
}

// Builds the list of page numbers to show, with "..." gaps for long ranges.
// Example: 1 ... 4 5 6 ... 12
function getPageNumbers(page: number, totalPages: number) {
  const pages: (number | "...")[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const isEdge = i === 1 || i === totalPages;
    const isNearCurrent = Math.abs(i - page) <= 1;

    if (isEdge || isNearCurrent) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
}

export default function MenuPagination({
  page,
  totalPages,
}: MenuPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (targetPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(targetPage));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const baseBtn =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition";
  const disabledBtn = "pointer-events-none opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={buildHref(page - 1)}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={`${baseBtn} gap-1 bg-background hover:bg-muted ${
          page <= 1 ? disabledBtn : ""
        }`}
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">Previous</span>
      </Link>

      {getPageNumbers(page, totalPages).map((p, index) =>
        p === "..." ? (
          <span
            key={`gap-${index}`}
            className="px-1 text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${baseBtn} ${
              p === page
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={buildHref(page + 1)}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
        className={`${baseBtn} gap-1 bg-background hover:bg-muted ${
          page >= totalPages ? disabledBtn : ""
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}