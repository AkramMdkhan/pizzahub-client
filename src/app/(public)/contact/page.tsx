import { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the PizzaHub team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Top Header Section (Warm Gradient) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500/15 via-background to-red-500/10 pt-20 pb-32">
        {/* Decorative faint icons */}
        <MessageCircle className="absolute top-10 left-10 h-40 w-40 text-primary/5 -rotate-12" />
        <MapPin className="absolute bottom-10 right-10 h-40 w-40 text-primary/5 rotate-12" />
        
        <div className="container mx-auto max-w-3xl px-4 relative z-10 text-center">
          <h1 className="font-poppins text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Contact <span className="text-primary">PizzaHub</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have a question, feedback, or need help with an order? We are here for you. Reach out to our team through any of the channels below.
          </p>
        </div>
      </section>

      {/* Floating Info Cards (Overlapping the header) */}
      <section className="container mx-auto max-w-5xl px-4 -mt-20 relative z-20">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-none shadow-lg bg-card/80 backdrop-blur-md transition-transform hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-poppins text-lg font-semibold mb-1">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-3">We reply within 24h</p>
              <a href="mailto:support@pizzahub.com" className="text-sm font-medium text-primary hover:underline">
                support@pizzahub.com
              </a>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card/80 backdrop-blur-md transition-transform hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-poppins text-lg font-semibold mb-1">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-3">Mon-Fri, 9am to 5pm</p>
              <a href="tel:+15551234567" className="text-sm font-medium text-primary hover:underline">
                +880 1234 567890
              </a>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card/80 backdrop-blur-md transition-transform hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-poppins text-lg font-semibold mb-1">Visit Us</h3>
              <p className="text-sm text-muted-foreground mb-3">Come say hello</p>
              <p className="text-sm font-medium">
               House 12, Road 5,<br />Dhaka, Bangladesh
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section to fill the page */}
      <section className="container mx-auto max-w-3xl px-4 mt-20">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-poppins text-2xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-2">Quick answers to common questions about PizzaHub.</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-2">How do I track my order?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Once you place an order, you can track its status by navigating to your Customer Dashboard and clicking on &quot;My Orders&quot;.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-2">Can I cancel an order?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Yes, you can cancel an order as long as the vendor has not accepted it yet. Once accepted, you will need to contact the vendor directly.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-2">How do I become a vendor?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Click on the &quot;Sign Up&quot; button in the top right, select &quot;Vendor&quot; as your account type, and you will be able to set up your restaurant profile and menu immediately.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}