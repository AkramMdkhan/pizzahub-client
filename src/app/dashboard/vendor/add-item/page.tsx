


// "use client";

// import { useState } from "react";
// import { toast } from "sonner";
// import { ImageIcon, Loader2, UploadCloud } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { apiFetch } from "@/lib/api";


// const categories = [
//   "Classic",
//   "Vegetarian",
//   "Meat Lovers",
//   "Spicy",
//   "Seafood",
//   "Specialty",
// ];

// export default function AddMenuItemPage() {

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [price, setPrice] = useState("");
//   const [location, setLocation] = useState("");
//   const [ingredients, setIngredients] = useState("");
//   const [isVegetarian, setIsVegetarian] = useState(false);
  
//   // Changed from imageUrl to imageFile + imagePreview
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   function resetForm() {
//     setName("");
//     setDescription("");
//     setCategory("");
//     setPrice("");
//     setLocation("");
//     setIngredients("");
//     setIsVegetarian(false);
//     setImageFile(null);
//     setImagePreview("");
//   }

//   // Handle local file selection and preview
//   function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       // Create a temporary local URL for the preview
//       setImagePreview(URL.createObjectURL(file));
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     if (!category) {
//       toast.error("Please choose a category");
//       return;
//     }
//     if (!imageFile) {
//       toast.error("Please select an image for the pizza");
//       return;
//     }

//     setLoading(true);
//     try {
//       // STEP 1: Upload image to ImgBB via our Next.js API route
//       const formData = new FormData();
//       formData.append("image", imageFile);

//       const uploadRes = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const uploadData = await uploadRes.json();

//       if (!uploadRes.ok) {
//         throw new Error(uploadData.error || "Failed to upload image");
//       }

//       const uploadedImageUrl = uploadData.url;

//       // STEP 2: Send the rest of the form data to the Express server
//       await apiFetch("/api/menu-items", {
//         method: "POST",
//         body: {
//           name,
//           description,
//           category,
//           price: Number(price),
//           location: location.trim(),
//           image: uploadedImageUrl, // Send the ImgBB URL
//           isVegetarian,
//           ingredients: ingredients
//             .split(",")
//             .map((i) => i.trim())
//             .filter(Boolean),
//         },
//       });

//       toast.success("Menu item submitted. It will appear once an admin approves it.");
//       resetForm();
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Failed to add menu item"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-3xl space-y-6">
//       <div>
//         <h1 className="font-heading text-2xl font-bold sm:text-3xl">
//           Add Menu Item
//         </h1>
//         <p className="mt-1 text-muted-foreground">
//           Create a new pizza for your restaurant menu.
//         </p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Pizza details</CardTitle>
//           <CardDescription>
//             All fields are required except ingredients. New items are reviewed
//             by an admin before they go live.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 placeholder="e.g. Margherita Classica"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 minLength={2}
//                 maxLength={80}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Describe the taste, crust and toppings (10-500 characters)"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//                 minLength={10}
//                 maxLength={500}
//                 rows={4}
//               />
//             </div>

//             <div className="grid gap-5 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="category">Category</Label>
//                 <select
//                   id="category"
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   required
//                   className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
//                 >
//                   <option value="" disabled>
//                     Select a category
//                   </option>
//                   {categories.map((c) => (
//                     <option key={c} value={c} className="text-black">
//                       {c}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="price">Price ($)</Label>
//                 <Input
//                   id="price"
//                   type="number"
//                   step="0.01"
//                   min="0.01"
//                   max="1000"
//                   placeholder="12.99"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="location">Location (area / city)</Label>
//               <Input
//                 id="location"
//                 placeholder="e.g. Gulshan, Dhaka"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 required
//                 minLength={2}
//                 maxLength={100}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="ingredients">Ingredients</Label>
//               <Input
//                 id="ingredients"
//                 placeholder="Tomato, Mozzarella, Basil (separate with commas)"
//                 value={ingredients}
//                 onChange={(e) => setIngredients(e.target.value)}
//               />
//             </div>

//             <label className="flex items-center gap-2 text-sm">
//               <input
//                 type="checkbox"
//                 checked={isVegetarian}
//                 onChange={(e) => setIsVegetarian(e.target.checked)}
//                 className="h-4 w-4 accent-orange-500"
//               />
//               This pizza is vegetarian
//             </label>

//             {/* Changed to File Upload */}
//             <div className="space-y-2">
//               <Label htmlFor="image">Pizza Image File</Label>
//               <Input
//                 id="image"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 required={!imageFile} // Required only if a file isn't already selected
//                 className="cursor-pointer"
//               />

//               <div className="mt-2 flex h-48 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/20 text-sm text-muted-foreground">
//                 {imagePreview ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={imagePreview}
//                     alt="Pizza preview"
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex flex-col items-center gap-2">
//                     <UploadCloud className="h-8 w-8 text-orange-500" />
//                     <span>Select an image from your computer</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-orange-500 text-white hover:bg-orange-600"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Uploading & Saving...
//                 </>
//               ) : (
//                 "Add Menu Item"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Added useRouter
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react"; // Removed ImageIcon
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

const categories = [
  "Classic",
  "Vegetarian",
  "Meat Lovers",
  "Spicy",
  "Seafood",
  "Specialty",
];

export default function AddMenuItemPage() {
  const router = useRouter(); // Initialized router

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setLocation("");
    setIngredients("");
    setIsVegetarian(false);
    setImageFile(null);
    setImagePreview("");
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!category) {
      toast.error("Please choose a category");
      return;
    }
    if (!imageFile) {
      toast.error("Please select an image for the pizza");
      return;
    }

    setLoading(true);
    try {
      // STEP 1: Upload image to ImgBB
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      const uploadedImageUrl = uploadData.url;

      // STEP 2: Send data to Express server
      await apiFetch("/api/menu-items", {
        method: "POST",
        body: {
          name,
          description,
          category,
          price: Number(price),
          location: location.trim(),
          image: uploadedImageUrl,
          isVegetarian,
          ingredients: ingredients
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        },
      });

      toast.success("Menu item submitted. It will appear once an admin approves it.");
      resetForm();
      
      // Refresh the dashboard data in the background
      router.refresh(); 
      
      // Optionally, redirect them back to the dashboard so they see the new stats
      // router.push("/dashboard/vendor"); 
      
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
            All fields are required except ingredients. New items are reviewed
            by an admin before they go live.
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
              <Label htmlFor="location">Location (area / city)</Label>
              <Input
                id="location"
                placeholder="e.g. Gulshan, Dhaka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                minLength={2}
                maxLength={100}
              />
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
              <Label htmlFor="image">Pizza Image File</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!imageFile}
                className="cursor-pointer"
              />

              <div className="mt-2 flex h-48 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/20 text-sm text-muted-foreground">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Pizza preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="h-8 w-8 text-orange-500" />
                    <span>Select an image from your computer</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading & Saving...
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