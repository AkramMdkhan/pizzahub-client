import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PopularPizzas } from "@/components/home/popular-pizzas";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PopularPizzas />
    </>
  );
}