"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Store, Sparkles, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBanner() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-[#2C1810] px-6 py-12 sm:px-12 md:py-16"
        >
          {/* Warm radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 85% 20%, rgba(192,57,43,0.55) 0%, rgba(192,57,43,0) 60%), radial-gradient(50% 70% at 10% 100%, rgba(230,126,34,0.35) 0%, rgba(230,126,34,0) 60%)",
            }}
          />

          {/* Dot texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(#FFF8F0 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
            {/* Left: copy */}
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-[#FFF8F0]/80">
                <Sparkles className="h-3.5 w-3.5 text-[#E67E22]" />
                For Restaurant Owners
              </span>

              <h2 className="font-[family-name:var(--font-poppins)] text-3xl font-bold leading-tight text-[#FFF8F0] sm:text-4xl md:text-[2.6rem]">
                Own a pizza restaurant?
                <br className="hidden sm:block" />
                <span className="text-[#E67E22]"> Get discovered</span> by
                hungry customers.
              </h2>

              <p className="max-w-xl text-[#FFF8F0]/70">
                Join PizzaHub as a vendor, publish your menu in minutes, and
                manage every order from one dashboard. Start free — upgrade to
                Premium when you&apos;re ready to grow.
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#FFF8F0]/60">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-[#27AE60]" />
                  Free to join
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-[#27AE60]" />
                  No setup fees
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-[#27AE60]" />
                  Cancel anytime
                </span>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2 bg-[#FFF8F0] text-[#C0392B] hover:bg-white"
                  )}
                >
                  Become a Vendor
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/menu"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "border-white/20 bg-transparent text-[#FFF8F0] hover:bg-white/10 hover:text-[#FFF8F0]"
                  )}
                >
                  Browse Menu
                </Link>
              </div>
            </div>

            {/* Right: visual accent card */}
            <div className="relative hidden md:block">
              <div className="relative mx-auto aspect-square w-full max-w-[280px]">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-white/10" />
                <div className="absolute inset-6 rounded-full border border-white/10" />
                <div className="absolute inset-12 rounded-full border border-white/10" />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C0392B] to-[#E67E22] shadow-2xl shadow-black/40">
                    <Store className="h-11 w-11 text-[#FFF8F0]" />
                  </div>
                </div>

                {/* Floating chips */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="absolute -left-4 top-6 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-[#FFF8F0] backdrop-blur"
                >
                  🍕 3 active items
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="absolute -right-2 bottom-8 rounded-xl border border-[#D4A017]/40 bg-[#D4A017]/15 px-3 py-2 text-xs font-medium text-[#F5C542] backdrop-blur"
                >
                  ⭐ Premium
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="absolute -bottom-2 left-6 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-[#FFF8F0] backdrop-blur"
                >
                  📦 Orders ready
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}