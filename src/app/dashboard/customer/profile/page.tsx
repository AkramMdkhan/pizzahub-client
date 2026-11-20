"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 1. Define the user type to fix TypeScript errors
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
}

export default function ProfileSettingsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user as ExtendedUser | undefined;

  // 2. Initialize the form state
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 3. Track if we have loaded the initial user data into the form
  const [initialized, setInitialized] = useState(false);

  // 4. Sync state safely without useEffect (fixes the cascading render error)
  if (user && !initialized) {
    setName(user.name || "");
    setImage(user.image || "");
    setInitialized(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/api/profile", {
        method: "PATCH",
        body: { name, image: image.trim() },
      });

      toast.success("Profile updated successfully!");
      
      // Reload to update the Navbar immediately
      window.location.reload(); 
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Profile Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Update your personal information. You cannot change your role or subscription here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Update your name and profile picture.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Avatar Preview */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-muted">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium">{user?.email}</p>
                <p className="text-sm capitalize text-muted-foreground">
                  Role: {user?.role || "Customer"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image URL (Optional)</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Paste a link to an image. Leave blank to remove your photo.
              </p>
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
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}