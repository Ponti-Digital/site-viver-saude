import { BannerCarousel } from "@/components/sections/BannerCarousel";
import { WhyViverSection } from "@/components/sections/WhyViverSection";
import { PlansCarousel } from "@/components/sections/PlansCarousel";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { QuickAccessSection } from "@/components/sections/QuickAccessSection";
import { CTASection } from "@/components/sections/CTASection";
import { getAllPlansContent } from "@/lib/supabase/plans";
import { getBanners } from "@/lib/supabase/banners";

export const revalidate = 3600;

export default async function Home() {
  const [plans, banners] = await Promise.all([
    getAllPlansContent(),
    getBanners(),
  ]);

  const carouselPlans = plans.map((p) => ({
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    image: p.image,
    color: p.color,
  }));

  return (
    <>
      <BannerCarousel initialBanners={banners} />
      <WhyViverSection />
      <PlansCarousel plans={carouselPlans} />
      <BenefitsGrid />
      <QuickAccessSection />
      <CTASection />
    </>
  );
}
