import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PopularPizzas } from "@/components/home/popular-pizzas";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PopularPizzas />
      <WhyChooseUs />
    </>
  );
}