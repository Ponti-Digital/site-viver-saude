import { BannerCarousel } from "@/components/sections/BannerCarousel";
import { WhyViverSection } from "@/components/sections/WhyViverSection";
import { PlansCarousel } from "@/components/sections/PlansCarousel";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { QuickAccessSection } from "@/components/sections/QuickAccessSection";
import { CTASection } from "@/components/sections/CTASection";
import { getPlansOrder } from "@/lib/supabase/plans";

export default async function Home() {
  const { slugs, activeSlugs } = await getPlansOrder();
  return (
    <>
      <BannerCarousel />
      <WhyViverSection />
      <PlansCarousel slugOrder={slugs} activeSlugs={Array.from(activeSlugs)} />
      <BenefitsGrid />
      <QuickAccessSection />
      <CTASection />
    </>
  );
}
