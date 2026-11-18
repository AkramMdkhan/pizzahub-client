import type { Metadata } from "next";
import { Pizza } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your PizzaHub account as a customer or a vendor.",
};

export default function RegisterPage() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md px-4">
        <Card>
          <CardHeader className="items-center text-center">
            <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
              <Pizza className="h-6 w-6" />
            </span>
            <CardTitle className="font-[family-name:var(--font-poppins)] text-2xl font-bold">
              Create your account
            </CardTitle>
            <CardDescription>
              Join PizzaHub to order pizza or sell your own.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}