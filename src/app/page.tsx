
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
      </main>
    </div>
  );
}
