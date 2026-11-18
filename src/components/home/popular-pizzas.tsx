"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Pizza, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pizzas = [
  {
    id: "1",
    name: "Margherita Classic",
    vendor: "Napoli Oven",
    description: "Tomato sauce, fresh mozzarella, basil, and olive oil.",
    price: 9.99,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Pepperoni Feast",
    vendor: "Slice House",
    description: "Loaded with spicy pepperoni and melted mozzarella.",
    price: 12.49,
    rating: 4.9,
  },
  {
    id: "3",
    name: "BBQ Chicken",
    vendor: "Fire & Crust",
    description: "Grilled chicken, smoky BBQ sauce, onions, and cheese.",
    price: 13.99,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Veggie Supreme",
    vendor: "Green Slice",
    description: "Bell peppers, olives, mushrooms, onions, and sweet corn.",
    price: 10.99,
    rating: 4.6,
  },
];

export function PopularPizzas() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              Popular right now
            </span>
            <h2 className="mt-2 font-[family-name:var(--font-poppins)] text-3xl font-bold sm:text-4xl">
              Customer Favorite Pizzas
            </h2>
          </div>
          <Link
            href="/menu"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "gap-2"
            )}
          >
            View full menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pizzas.map((pizza, index) => (
            <motion.div
              key={pizza.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group overflow-hidden rounded-2xl border bg-background transition-shadow hover:shadow-lg"
            >
              {/* Image placeholder */}
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-orange-500/20 to-red-500/10">
                <Pizza className="h-16 w-16 text-orange-500 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-[family-name:var(--font-poppins)] font-semibold">
                      {pizza.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      by {pizza.vendor}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                    {pizza.rating}
                  </span>
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {pizza.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-[family-name:var(--font-poppins)] text-lg font-bold text-orange-500">
                    ${pizza.price.toFixed(2)}
                  </span>
                  <Link
                    href="/menu"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "bg-orange-500 text-white hover:bg-orange-600"
                    )}
                  >
                    Order
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}