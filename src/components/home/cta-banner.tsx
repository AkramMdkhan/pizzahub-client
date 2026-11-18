"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Pizza } from "lucide-react";
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 px-6 py-14 text-center text-white sm:px-12 md:py-20"
        >
          {/* Decorative icons */}
          <Pizza className="pointer-events-none absolute -top-6 -left-6 h-32 w-32 rotate-12 text-white/10" />
          <Pizza className="pointer-events-none absolute -right-8 -bottom-8 h-44 w-44 -rotate-12 text-white/10" />

          <div className="relative mx-auto max-w-2xl space-y-5">
            <h2 className="font-[family-name:var(--font-poppins)] text-3xl font-bold sm:text-4xl">
              Own a Pizza Restaurant?
            </h2>
            <p className="text-white/90">
              Join PizzaHub as a vendor, list your menu, manage orders from one
              dashboard, and reach hungry customers in your area.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 bg-white text-orange-600 hover:bg-white/90"
                )}
              >
                Become a Vendor
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/menu"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white"
                )}
              >
                Browse Menu
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}