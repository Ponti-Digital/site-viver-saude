import { BannerCarousel } from "@/components/sections/BannerCarousel";
import { WhyViverSection } from "@/components/sections/WhyViverSection";
import { PlansCarousel } from "@/components/sections/PlansCarousel";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { QuickAccessSection } from "@/components/sections/QuickAccessSection";
import { CTASection } from "@/components/sections/CTASection";
import { getPlansOrder } from "@/lib/supabase/plans";
import { getBanners } from "@/lib/supabase/banners";

export default async function Home() {
  const [{ slugs, activeSlugs }, banners] = await Promise.all([
    getPlansOrder(),
    getBanners(),
  ]);
  return (
    <>
      <BannerCarousel initialBanners={banners} />
      <WhyViverSection />
      <PlansCarousel slugOrder={slugs} activeSlugs={Array.from(activeSlugs)} />
      <BenefitsGrid />
      <QuickAccessSection />
      <CTASection />
    </>
  );
}
