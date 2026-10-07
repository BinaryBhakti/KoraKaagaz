import { Chrome } from "@/components/Chrome";
import { Contact } from "@/components/Contact";
import { Featured } from "@/components/Featured";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Journal } from "@/components/Journal";
import { Marquee } from "@/components/Marquee";
import { MotionProvider } from "@/components/MotionProvider";
import { People } from "@/components/People";
import { Services } from "@/components/Services";
import { Studio } from "@/components/Studio";
import { Values } from "@/components/Values";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <MotionProvider>
      <div data-progress="" aria-hidden="true" style={{ transform: "scaleX(0)" }} className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-periwinkle shadow-[0_0_12px_rgba(138,168,255,.8)]" />
      <a href="#main" className="absolute top-2 -left-[9999px] z-[100] bg-paper px-3.5 py-2.5 text-[13px] text-ink focus:left-2">
        Skip to content
      </a>
      <Chrome>
        <main id="main" className="overflow-x-clip">
          <Hero />
          <Services />
          <Work />
          <Marquee />
          <Featured />
          <People />
          <Studio />
          <Values />
          <Journal />
          <Contact />
        </main>
        <Footer />
      </Chrome>
    </MotionProvider>
  );
}
