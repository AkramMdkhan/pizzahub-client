import Link from "next/link";
import { Crown } from "lucide-react";

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  ingredients?: string[];
  isVegetarian?: boolean;
  vendorEmail?: string;
  createdAt?: string;
  isPremiumVendor?: boolean; // Added this
}

export default function PizzaCard({ item }: { item: MenuItem }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        
        {/* Category Badge */}
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium capitalize backdrop-blur">
          {item.category}
        </span>

        {/* Premium Badge */}
        {item.isPremiumVendor && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black shadow-sm">
            <Crown className="h-3 w-3" />
            Premium
          </span>
        )}

        {/* Vegetarian Badge (moved to bottom right to avoid overlapping Premium) */}
        {item.isVegetarian && (
          <span className="absolute bottom-3 right-3 rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
            Veg
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold">{item.name}</h3>
          <span className="text-lg font-bold text-primary">
            ${item.price.toFixed(2)}
          </span>
        </div>

        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
          {item.description}
        </p>

        <Link
          href={`/menu/${item._id}`}
          className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}