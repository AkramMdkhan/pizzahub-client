"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  isVegetarian?: boolean;
};

export default function VendorMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await apiFetch<{ items: MenuItem[] }>(
          "/api/menu-items/mine"
        );
        setItems(data.items);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load your menu"
        );
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  async function handleDelete(item: MenuItem) {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(item._id);
    try {
      await apiFetch(`/api/menu-items/${item._id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      toast.success("Menu item deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">
            My Menu
          </h1>
          <p className="mt-1 text-muted-foreground">
            {loading
              ? "Loading your pizzas..."
              : `${items.length} ${items.length === 1 ? "item" : "items"} on your menu`}
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-item"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          <PlusCircle className="h-4 w-4" />
          Add Menu Item
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No menu items yet</CardTitle>
            <CardDescription>
              Add your first pizza so customers can start ordering.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden pt-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="h-44 w-full object-cover"
              />
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{item.name}</h3>
                  <span className="font-bold text-orange-500">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-orange-600">
                    {item.category}
                  </span>
                  {item.isVegetarian && (
                    <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-green-600">
                      Vegetarian
                    </span>
                  )}
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>

                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/dashboard/vendor/edit-item/${item._id}`}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors hover:border-orange-500 hover:text-orange-500"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1 hover:border-red-500 hover:text-red-500"
                    disabled={deletingId === item._id}
                    onClick={() => handleDelete(item)}
                  >
                    {deletingId === item._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}