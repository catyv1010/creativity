import { gsap } from "gsap";

// --- Core Plugins ---
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Flip } from "gsap/dist/Flip";

// --- Premium Plugins (included free in gsap 3.12+) ---
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { CustomEase } from "gsap/CustomEase";
import { InertiaPlugin } from "gsap/InertiaPlugin";

// --- Re-export everything so the rest of the app can import from here ---
export {
  gsap,
  ScrollTrigger,
  ScrollToPlugin,
  MotionPathPlugin,
  Flip,
  DrawSVGPlugin,
  MorphSVGPlugin,
  SplitText,
  ScrambleTextPlugin,
  TextPlugin,
  CustomEase,
  InertiaPlugin,
};

// Register all GSAP plugins once at app startup.
// Import this file in the root layout or a top-level client component.

let registered = false;

export function registerGSAPPlugins() {
  if (registered) return;

  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    MotionPathPlugin,
    Flip,
    DrawSVGPlugin,
    MorphSVGPlugin,
    SplitText,
    ScrambleTextPlugin,
    TextPlugin,
    CustomEase,
    InertiaPlugin,
  );

  // Custom ease curves for cinematic feel
  CustomEase.create("cinematic", "M0,0 C0.25,0.1 0.25,1 1,1");
  CustomEase.create("dramaticSnap", "M0,0 C0.7,0 0.3,1 1,1");
  CustomEase.create("elasticPop", "M0,0 C0.5,1.6 0.4,1 1,1");
  CustomEase.create("smoothStop", "M0,0 C0.1,0.9 0.2,1 1,1");

  // Global GSAP defaults
  gsap.defaults({
    ease: "power2.inOut",
    duration: 0.8,
  });

  registered = true;
}
