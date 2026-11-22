"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Star, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { value: "50+", label: "Pizza Vendors" },
  { value: "10k+", label: "Happy Customers" },
  { value: "30 min", label: "Avg. Delivery" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-500">
            <Truck className="h-4 w-4" />
            Fast delivery from local vendors
          </span>

          <h1 className="font-[family-name:var(--font-poppins)] text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Hot, Fresh Pizza <br />
            Delivered to{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Your Door
            </span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            Browse menus from the best pizza restaurants near you, customize
            your order, and track it from the oven to your doorstep.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-orange-500 text-white hover:bg-orange-600"
              )}
            >
              Order Now
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Become a Vendor
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-orange-500">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto h-72 w-72 sm:h-96 sm:w-96"
        >
          {/* Circle ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-1.5">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-background">
              <Image
                src="/images/hero-pizza-6.jpg"
                alt="Freshly baked pizza"
                fill
                priority
                sizes="(max-width: 640px) 288px, 384px"
                className="object-cover object-[75%_center]"
              />
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-4 -left-4 flex items-center gap-2 rounded-xl border bg-background px-3 py-2 shadow-lg"
          >
            <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
            <span className="text-sm font-semibold">4.9 Rating</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="absolute -right-4 bottom-8 flex items-center gap-2 rounded-xl border bg-background px-3 py-2 shadow-lg"
          >
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold">30 min delivery</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}