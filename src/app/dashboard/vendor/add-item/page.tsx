"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { uploadToImgBB } from "@/lib/imgbb";

const categories = [
  "Classic",
  "Vegetarian",
  "Meat Lovers",
  "Spicy",
  "Seafood",
  "Specialty",
];

export default function AddMenuItemPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setIngredients("");
    setIsVegetarian(false);
    setImageFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image for your pizza");
      return;
    }
    if (!category) {
      toast.error("Please choose a category");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadToImgBB(imageFile);

      await apiFetch("/api/menu-items", {
        method: "POST",
        body: {
          name,
          description,
          category,
          price: Number(price),
          image: imageUrl,
          isVegetarian,
          ingredients: ingredients
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        },
      });

      toast.success("Menu item added successfully");
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add menu item"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Add Menu Item
        </h1>
        <p className="mt-1 text-muted-foreground">
          Create a new pizza for your restaurant menu.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pizza details</CardTitle>
          <CardDescription>
            All fields are required except ingredients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Margherita Classica"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={80}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the taste, crust and toppings (10-500 characters)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                minLength={10}
                maxLength={500}
                rows={4}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="text-black">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1000"
                  placeholder="12.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Input
                id="ingredients"
                placeholder="Tomato, Mozzarella, Basil (separate with commas)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={(e) => setIsVegetarian(e.target.checked)}
                className="h-4 w-4 accent-orange-500"
              />
              This pizza is vegetarian
            </label>

            <div className="space-y-2">
              <Label htmlFor="image">Pizza image</Label>
              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-sm text-muted-foreground transition-colors hover:border-orange-500"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Selected pizza preview"
                    className="h-48 w-full rounded-md object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-orange-500" />
                    <span>Click to choose an image (max 5MB)</span>
                  </>
                )}
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Menu Item"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}