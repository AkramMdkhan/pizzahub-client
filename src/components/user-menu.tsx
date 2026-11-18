"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";

interface UserMenuProps {
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserMenu({ name, email, image, role }: UserMenuProps) {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    toast.success("Logged out");
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <Avatar className="h-9 w-9">
          {image && <AvatarImage src={image} alt={name} />}
          <AvatarFallback className="bg-orange-500 text-sm font-semibold text-white">
            {getInitials(name) || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="space-y-0.5">
            <span className="block truncate text-sm font-semibold">{name}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {email}
            </span>
            {role && (
              <span className="mt-1 inline-block rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium capitalize text-orange-500">
                {role}
              </span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}