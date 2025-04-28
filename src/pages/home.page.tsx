import { CategorySection } from "@/components/home/category-section";
import { HeroSection } from "@/components/home/hero";
import { PopularEventsSection } from "@/components/home/popular-event-section";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24">
      <HeroSection />
      <PopularEventsSection />
      <CategorySection />
    </div>
  );
}
