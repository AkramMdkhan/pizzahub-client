import type { Metadata } from "next";
import { Pizza } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your PizzaHub account.",
};

export default function LoginPage() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md px-4">
        <Card>
          <CardHeader className="items-center text-center">
            <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
              <Pizza className="h-6 w-6" />
            </span>
            <CardTitle className="font-[family-name:var(--font-poppins)] text-2xl font-bold">
              Welcome back
            </CardTitle>
            <CardDescription>
              Log in to order pizza or manage your restaurant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}