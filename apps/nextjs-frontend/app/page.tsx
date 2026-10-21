import { VerificationWidget } from "@/components/verification-widget";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { PointerHighlightEffect } from "@/components/pointer-highlight";
import { HeroSection, FloatingCameraLink } from "@/components/hero-section";
import { MissionSection, WiseProcessSection, ClassroomSection } from "@/components/content-sections";
import { SpreadSimulatorSection } from "@/components/spread-simulator";
import { PillarsSection } from "@/components/pillars-section";
import { VerificationLabSection } from "@/components/verification-lab";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <PointerHighlightEffect />
      <main id="top">
        <VerificationWidget />
        <HeroSection />
        <MissionSection />
        <SpreadSimulatorSection />
        <PillarsSection />
        <WiseProcessSection />
        <VerificationLabSection />
        <ClassroomSection />
      </main>
      <SiteFooter />
      <FloatingCameraLink />
    </>
  );
}
