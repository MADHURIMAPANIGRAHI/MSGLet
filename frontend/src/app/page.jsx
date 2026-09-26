
'use client';

import {Navbar} from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { DashboardPreview } from "@/components/DashboardPreview";
import {DeveloperSection} from "@/components/DeveloperSection";
import { SecuritySection } from "@/components/SecuritySection";
import { CTASection } from "@/components/CTASection";
import {Footer} from "@/components/Footer";
export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar/>
      <HeroSection />
      <FeaturesSection/>
      <HowItWorksSection/>
      <DashboardPreview/>
      <DeveloperSection/>
      <SecuritySection/>
      <CTASection/>
      <Footer/>
    </main>
  );
}
