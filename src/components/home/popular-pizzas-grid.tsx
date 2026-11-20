"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/components/pizza-card";

export function PopularPizzasGrid({ items }: { items: MenuItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((pizza, index) => (
        <motion.div
          key={pizza._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group flex flex-col overflow-hidden rounded-2xl border bg-background transition-shadow hover:shadow-lg"
        >
          {/* Image */}
          <div className="relative h-44 overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pizza.image}
              alt={pizza.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
              {pizza.category}
            </span>
          </div>

          <div className="flex flex-1 flex-col space-y-3 p-5">
            <h3 className="line-clamp-1 font-[family-name:var(--font-poppins)] font-semibold">
              {pizza.name}
            </h3>

            <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
              {pizza.description}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="font-[family-name:var(--font-poppins)] text-lg font-bold text-orange-500">
                ${pizza.price.toFixed(2)}
              </span>
              <Link
                href={`/menu/${pizza._id}`}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-orange-500 text-white hover:bg-orange-600"
                )}
              >
                View Details
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}