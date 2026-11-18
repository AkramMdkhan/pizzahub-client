"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Clock, ShieldCheck, Store } from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Trusted Local Vendors",
    description:
      "Every restaurant on PizzaHub is reviewed and approved by our admin team.",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description:
      "Vendors prepare orders right away, so your pizza arrives hot and fresh.",
  },
  {
    icon: BadgeCheck,
    title: "Quality You Can Taste",
    description:
      "Fresh ingredients and honest menus with clear sizes, prices, and details.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    description:
      "Protected accounts and secure vendor payments keep the platform safe.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left: heading */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Why PizzaHub
          </span>
          <h2 className="font-[family-name:var(--font-poppins)] text-3xl font-bold leading-tight sm:text-4xl">
            Pizza ordering that is{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              simple, fast and reliable
            </span>
          </h2>
          <p className="max-w-lg text-muted-foreground">
            Whether you are a hungry customer or a restaurant owner, PizzaHub
            gives you the tools to enjoy and sell great pizza without the
            hassle.
          </p>
        </motion.div>

        {/* Right: features */}
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-3 rounded-2xl border bg-background p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-[family-name:var(--font-poppins)] font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}