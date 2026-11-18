"use client";

import { motion } from "framer-motion";
import { ChefHat, MapPin, Pizza, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Menus",
    description:
      "Explore pizzas from local vendors and filter by size, price, or category.",
  },
  {
    icon: Pizza,
    title: "Pick Your Pizza",
    description:
      "Choose your favorite, check the ingredients, and select the size you want.",
  },
  {
    icon: ChefHat,
    title: "Place Your Order",
    description:
      "Confirm your details and send the order straight to the vendor's kitchen.",
  },
  {
    icon: MapPin,
    title: "Track Delivery",
    description:
      "Follow your order from the oven to your doorstep with live status updates.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            How it works
          </span>
          <h2 className="mt-2 font-[family-name:var(--font-poppins)] text-3xl font-bold sm:text-4xl">
            From Craving to Doorstep in 4 Steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ordering your favorite pizza takes less than a minute.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
            >
              <span className="absolute top-4 right-5 font-[family-name:var(--font-poppins)] text-4xl font-extrabold text-orange-500/15">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-[family-name:var(--font-poppins)] text-lg font-semibold">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}