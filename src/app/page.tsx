import AnimatedHero from '@/components/ui/AnimatedHero';
import FeaturesSection from '@/components/ui/FeaturesSection';
import DestinationsCarousel from '@/components/ui/Destinations';

export default function HomePage() {
  return (
    <div>
      <AnimatedHero />
      <DestinationsCarousel />
      <FeaturesSection />
    </div>
  );
}