import Link from "next/link";
import { Pizza, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/10">
        <Pizza className="h-12 w-12 text-orange-500" />
      </div>
      
      <h1 className="font-poppins text-4xl font-bold tracking-tight sm:text-5xl">
        404 - Page Not Found
      </h1>
      
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Oops! It looks like this slice of pizza is missing. The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      
      <div className="mt-8 flex gap-4">
        <Button 
          render={<Link href="/" />} 
          nativeButton={false} 
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <Button 
          variant="outline" 
          render={<Link href="/menu" />} 
          nativeButton={false}
        >
          Browse Menu
        </Button>
      </div>
    </div>
  );
}