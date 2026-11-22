"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

function ToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      toast.error("Access Denied", {
        description: "You do not have permission to view that page.",
      });

      // Clean up the URL so the toast doesn't show again on refresh
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router, pathname]);

  return null;
}

export function RoleGuardToast() {
  return (
    <Suspense fallback={null}>
      <ToastListener />
    </Suspense>
  );
}