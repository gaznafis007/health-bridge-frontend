import { HomeHero } from "@/features/home/components/HomeHero";
import { HomeHowItWorks } from "@/features/home/components/HomeHowItWorks";
import { HomePaymentsBanner } from "@/features/home/components/HomePaymentsBanner";
import { HomeServices } from "@/features/home/components/HomeServices";
import { HomeStatsBar } from "@/features/home/components/HomeStatsBar";
import { HomeTestimonials } from "@/features/home/components/HomeTestimonials";

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeHowItWorks />
      <HomeStatsBar />
      <HomeTestimonials />
      <HomePaymentsBanner />
    </>
  );
}
