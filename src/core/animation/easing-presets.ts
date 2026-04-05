// ============================================================
// Cinematic easing presets for GSAP
// These go beyond standard easing — they feel like camera movements in film.
// ============================================================

export const CINEMATIC_EASINGS = {
  // Smooth film-like movements
  "film-smooth": "power2.inOut",
  "gentle-drift": "sine.inOut",

  // Dramatic entrances/exits
  "dramatic-enter": "power4.out",
  "dramatic-exit": "power4.in",
  "slow-reveal": "expo.out",
  "suspense-build": "power1.in",

  // Fast/snappy
  "whip": "power4.inOut",
  "snap": "back.out(1.7)",

  // Organic/physical
  "bounce-settle": "bounce.out",
  "elastic-pop": "elastic.out(1, 0.3)",
  "elastic-gentle": "elastic.out(0.5, 0.5)",

  // Camera-specific
  "dolly-ease": "power3.inOut",
  "crane-shot": "sine.inOut",
  "rack-focus": "power2.out",

  // Custom (registered in gsap-register.ts)
  "cinematic": "cinematic",
  "dramatic-snap": "dramaticSnap",
  "elastic-pop-custom": "elasticPop",
  "smooth-stop": "smoothStop",
  "gentle-bounce": "gentleBounce",
  "attention-wiggle": "attentionWiggle",
} as const;

export type CinematicEasing = keyof typeof CINEMATIC_EASINGS;

// ============================================================
// Animation Presets — predefined GSAP property maps
// ============================================================
// Each preset defines { properties, easing, duration }.
// AnimationEngine merges these with per-element overrides.
//
// Presets marked [PLUGIN] require premium GSAP plugins
// (SplitText, DrawSVG, MorphSVG, etc.) — registered in gsap-register.ts
// ============================================================

export const ANIMATION_PRESETS = {
  // ============ ENTRANCES ============

  fadeIn: {
    properties: { opacity: { from: 0, to: 1 } },
    easing: "power2.out",
    duration: 0.8,
  },
  slideInLeft: {
    properties: { x: { from: -200, to: 0 }, opacity: { from: 0, to: 1 } },
    easing: "power3.out",
    duration: 0.8,
  },
  slideInRight: {
    properties: { x: { from: 200, to: 0 }, opacity: { from: 0, to: 1 } },
    easing: "power3.out",
    duration: 0.8,
  },
  slideInUp: {
    properties: { y: { from: 150, to: 0 }, opacity: { from: 0, to: 1 } },
    easing: "power3.out",
    duration: 0.8,
  },
  slideInDown: {
    properties: { y: { from: -150, to: 0 }, opacity: { from: 0, to: 1 } },
    easing: "power3.out",
    duration: 0.8,
  },
  scaleIn: {
    properties: { scale: { from: 0, to: 1 }, opacity: { from: 0, to: 1 } },
    easing: "back.out(1.7)",
    duration: 0.7,
  },
  rotateIn: {
    properties: { rotation: { from: -90, to: 0 }, opacity: { from: 0, to: 1 } },
    easing: "power3.out",
    duration: 0.8,
  },

  // --- New entrances ---

  flipInX: {
    properties: { rotationX: { from: 90, to: 0 }, opacity: { from: 0, to: 1 } },
    easing: "back.out(1.4)",
    duration: 0.9,
  },
  flipInY: {
    properties: { rotationY: { from: 90, to: 0 }, opacity: { from: 0, to: 1 } },
    easing: "back.out(1.4)",
    duration: 0.9,
  },
  zoomBounceIn: {
    properties: { scale: { from: 0, to: 1 }, opacity: { from: 0, to: 1 } },
    easing: "elastic.out(1, 0.4)",
    duration: 1.2,
  },
  spiralIn: {
    properties: {
      scale: { from: 0, to: 1 },
      rotation: { from: 360, to: 0 },
      opacity: { from: 0, to: 1 },
    },
    easing: "power3.out",
    duration: 1.0,
  },
  dropIn: {
    properties: { y: { from: -400, to: 0 }, opacity: { from: 0, to: 1 } },
    easing: "bounce.out",
    duration: 1.2,
  },
  riseUp: {
    properties: {
      y: { from: 80, to: 0 },
      opacity: { from: 0, to: 1 },
      scale: { from: 0.95, to: 1 },
    },
    easing: "cinematic",
    duration: 1.0,
  },
  swoopIn: {
    properties: {
      x: { from: -300, to: 0 },
      rotation: { from: -15, to: 0 },
      opacity: { from: 0, to: 1 },
    },
    easing: "power4.out",
    duration: 0.8,
  },
  expandIn: {
    properties: {
      scaleX: { from: 0, to: 1 },
      scaleY: { from: 0, to: 1 },
      opacity: { from: 0, to: 1 },
    },
    easing: "expo.out",
    duration: 0.9,
  },
  unfoldX: {
    properties: {
      scaleX: { from: 0, to: 1 },
      opacity: { from: 0, to: 1 },
      transformOrigin: "left center",
    },
    easing: "power3.out",
    duration: 0.8,
  },
  unfoldY: {
    properties: {
      scaleY: { from: 0, to: 1 },
      opacity: { from: 0, to: 1 },
      transformOrigin: "center top",
    },
    easing: "power3.out",
    duration: 0.8,
  },

  // --- Clip-path reveals (Genially-style) ---

  revealFromLeft: {
    properties: {
      clipPath: { from: "inset(0 100% 0 0)", to: "inset(0 0% 0 0)" },
    },
    easing: "power3.inOut",
    duration: 0.9,
  },
  revealFromRight: {
    properties: {
      clipPath: { from: "inset(0 0 0 100%)", to: "inset(0 0 0 0%)" },
    },
    easing: "power3.inOut",
    duration: 0.9,
  },
  revealFromTop: {
    properties: {
      clipPath: { from: "inset(0 0 100% 0)", to: "inset(0 0 0% 0)" },
    },
    easing: "power3.inOut",
    duration: 0.9,
  },
  revealFromBottom: {
    properties: {
      clipPath: { from: "inset(100% 0 0 0)", to: "inset(0% 0 0 0)" },
    },
    easing: "power3.inOut",
    duration: 0.9,
  },
  circleReveal: {
    properties: {
      clipPath: { from: "circle(0% at 50% 50%)", to: "circle(75% at 50% 50%)" },
    },
    easing: "expo.out",
    duration: 1.2,
  },
  diamondReveal: {
    properties: {
      clipPath: { from: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)", to: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
    },
    easing: "power3.out",
    duration: 1.0,
  },
  splitReveal: {
    properties: {
      clipPath: { from: "inset(0 50% 0 50%)", to: "inset(0 0% 0 0%)" },
      opacity: { from: 0, to: 1 },
    },
    easing: "power3.out",
    duration: 0.9,
  },
  dramaticReveal: {
    properties: {
      clipPath: { from: "inset(100% 0% 0% 0%)", to: "inset(0% 0% 0% 0%)" },
      y: { from: 30, to: 0 },
    },
    easing: "power4.out",
    duration: 1.0,
  },

  // ============ CINEMATIC SPECIALS ============

  cinematicZoom: {
    properties: {
      scale: { from: 0.3, to: 1 },
      opacity: { from: 0, to: 1 },
      filter: { from: "blur(20px)", to: "blur(0px)" },
    },
    easing: "expo.out",
    duration: 1.2,
  },
  glitchIn: {
    properties: {
      opacity: { from: 0, to: 1 },
      x: { from: -10, to: 0 },
      skewX: { from: 20, to: 0 },
    },
    easing: "power4.out",
    duration: 0.4,
  },
  blurIn: {
    properties: {
      opacity: { from: 0, to: 1 },
      filter: { from: "blur(30px)", to: "blur(0px)" },
    },
    easing: "power2.out",
    duration: 1.0,
  },
  blurOut: {
    properties: {
      opacity: { from: 1, to: 0 },
      filter: { from: "blur(0px)", to: "blur(30px)" },
    },
    easing: "power2.in",
    duration: 0.8,
  },
  zoomBlurIn: {
    properties: {
      scale: { from: 1.5, to: 1 },
      opacity: { from: 0, to: 1 },
      filter: { from: "blur(15px)", to: "blur(0px)" },
    },
    easing: "power3.out",
    duration: 1.0,
  },
  matrixDrop: {
    properties: {
      y: { from: -100, to: 0 },
      rotationX: { from: 45, to: 0 },
      opacity: { from: 0, to: 1 },
      filter: { from: "brightness(3)", to: "brightness(1)" },
    },
    easing: "expo.out",
    duration: 1.0,
  },
  neonFlicker: {
    properties: {
      opacity: { from: 0, to: 1 },
      filter: {
        from: "drop-shadow(0 0 0px rgba(0,255,255,0)) brightness(1)",
        to: "drop-shadow(0 0 20px rgba(0,255,255,0.8)) brightness(1.2)",
      },
    },
    easing: "steps(6)",
    duration: 0.6,
  },
  stampIn: {
    properties: {
      scale: { from: 3, to: 1 },
      opacity: { from: 0, to: 1 },
    },
    easing: "power4.out",
    duration: 0.4,
  },
  perspectiveTilt: {
    properties: {
      rotationY: { from: -45, to: 0 },
      rotationX: { from: 15, to: 0 },
      opacity: { from: 0, to: 1 },
      scale: { from: 0.8, to: 1 },
    },
    easing: "power3.out",
    duration: 1.0,
  },

  // ============ EXITS ============

  fadeOut: {
    properties: { opacity: { from: 1, to: 0 } },
    easing: "power2.in",
    duration: 0.6,
  },
  scaleOut: {
    properties: { scale: { from: 1, to: 0 }, opacity: { from: 1, to: 0 } },
    easing: "power2.in",
    duration: 0.5,
  },
  rotateOut: {
    properties: { rotation: { from: 0, to: 90 }, opacity: { from: 1, to: 0 } },
    easing: "power3.in",
    duration: 0.8,
  },
  slideOutLeft: {
    properties: { x: { from: 0, to: -200 }, opacity: { from: 1, to: 0 } },
    easing: "power3.in",
    duration: 0.6,
  },
  slideOutRight: {
    properties: { x: { from: 0, to: 200 }, opacity: { from: 1, to: 0 } },
    easing: "power3.in",
    duration: 0.6,
  },
  slideOutUp: {
    properties: { y: { from: 0, to: -200 }, opacity: { from: 1, to: 0 } },
    easing: "power3.in",
    duration: 0.6,
  },
  slideOutDown: {
    properties: { y: { from: 0, to: 200 }, opacity: { from: 1, to: 0 } },
    easing: "power3.in",
    duration: 0.6,
  },
  shrinkOut: {
    properties: {
      scale: { from: 1, to: 0.5 },
      opacity: { from: 1, to: 0 },
      filter: { from: "blur(0px)", to: "blur(10px)" },
    },
    easing: "power3.in",
    duration: 0.7,
  },
  collapseX: {
    properties: {
      scaleX: { from: 1, to: 0 },
      opacity: { from: 1, to: 0 },
    },
    easing: "power3.in",
    duration: 0.6,
  },
  collapseY: {
    properties: {
      scaleY: { from: 1, to: 0 },
      opacity: { from: 1, to: 0 },
    },
    easing: "power3.in",
    duration: 0.6,
  },

  // ============ EMPHASIS / LOOPING ============

  float: {
    properties: { y: { from: 0, to: -15 } },
    easing: "sine.inOut",
    duration: 2.0,
  },
  pulse: {
    properties: { scale: { from: 1, to: 1.05 } },
    easing: "sine.inOut",
    duration: 1.0,
  },
  shake: {
    properties: { x: { from: -5, to: 5 } },
    easing: "sine.inOut",
    duration: 0.1,
  },
  glow: {
    properties: {
      filter: {
        from: "drop-shadow(0 0 0px rgba(255,255,255,0))",
        to: "drop-shadow(0 0 20px rgba(255,255,255,0.8))",
      },
    },
    easing: "sine.inOut",
    duration: 1.5,
  },
  heartbeat: {
    properties: { scale: { from: 1, to: 1.15 } },
    easing: "power2.inOut",
    duration: 0.3,
  },
  wobble: {
    properties: { rotation: { from: -3, to: 3 } },
    easing: "sine.inOut",
    duration: 0.4,
  },
  breathe: {
    properties: {
      scale: { from: 1, to: 1.03 },
      opacity: { from: 1, to: 0.85 },
    },
    easing: "sine.inOut",
    duration: 3.0,
  },
  jello: {
    properties: {
      skewX: { from: 0, to: 8 },
      skewY: { from: 0, to: -3 },
    },
    easing: "elastic.out(0.6, 0.3)",
    duration: 0.8,
  },
  swing: {
    properties: { rotation: { from: -10, to: 10 }, transformOrigin: "top center" },
    easing: "sine.inOut",
    duration: 1.2,
  },
  rubberBand: {
    properties: {
      scaleX: { from: 1, to: 1.25 },
      scaleY: { from: 1, to: 0.75 },
    },
    easing: "elastic.out(1, 0.3)",
    duration: 0.8,
  },
  tada: {
    properties: {
      scale: { from: 1, to: 1.1 },
      rotation: { from: -3, to: 3 },
    },
    easing: "elastic.out(1, 0.4)",
    duration: 0.6,
  },
  hoverFloat: {
    properties: {
      y: { from: 0, to: -8 },
      filter: {
        from: "drop-shadow(0 5px 10px rgba(0,0,0,0.2))",
        to: "drop-shadow(0 15px 30px rgba(0,0,0,0.15))",
      },
    },
    easing: "sine.inOut",
    duration: 2.5,
  },
  colorShift: {
    properties: {
      filter: { from: "hue-rotate(0deg)", to: "hue-rotate(360deg)" },
    },
    easing: "none",
    duration: 5.0,
  },
  flickerGlow: {
    properties: {
      opacity: { from: 0.7, to: 1 },
      filter: {
        from: "drop-shadow(0 0 5px rgba(255,200,0,0.5))",
        to: "drop-shadow(0 0 25px rgba(255,200,0,1))",
      },
    },
    easing: "steps(3)",
    duration: 0.3,
  },

  // ============ MOTION-PATH (requires MotionPathPlugin) ============

  orbitCircle: {
    properties: {
      motionPath: {
        from: 0,
        to: 1, // AnimationEngine must handle motionPath specially
      },
    },
    easing: "none",
    duration: 4.0,
  },

  // ============ TEXT SPECIALS (these are handled by AnimationEngine using SplitText) ============

  typewriter: {
    properties: { opacity: { from: 0, to: 1 } },
    easing: "none",
    duration: 2.0,
    // AnimationEngine interprets this: uses TextPlugin to type text character by character
  },
  scrambleIn: {
    properties: { opacity: { from: 0, to: 1 } },
    easing: "none",
    duration: 1.5,
    // AnimationEngine interprets this: uses ScrambleTextPlugin
  },
  letterByLetter: {
    properties: { opacity: { from: 0, to: 1 }, y: { from: 20, to: 0 } },
    easing: "power3.out",
    duration: 1.2,
    // AnimationEngine interprets this: uses SplitText to animate each letter
  },
  wordByWord: {
    properties: { opacity: { from: 0, to: 1 }, y: { from: 30, to: 0 } },
    easing: "power2.out",
    duration: 1.5,
    // AnimationEngine interprets this: uses SplitText to animate each word
  },
  lineByLine: {
    properties: { opacity: { from: 0, to: 1 }, x: { from: -40, to: 0 } },
    easing: "power3.out",
    duration: 1.8,
    // AnimationEngine interprets this: uses SplitText to animate each line
  },

  // ============ SVG SPECIALS (DrawSVGPlugin / MorphSVGPlugin) ============

  drawSVG: {
    properties: {
      drawSVG: { from: "0%", to: "100%" },
    },
    easing: "power2.inOut",
    duration: 2.0,
  },
  drawSVGReverse: {
    properties: {
      drawSVG: { from: "100%", to: "0%" },
    },
    easing: "power2.inOut",
    duration: 2.0,
  },

  // ============ PHYSICS (requires Physics2DPlugin) ============

  explodeOut: {
    properties: {
      // AnimationEngine handles: creates Physics2D with velocity and angle spread
      opacity: { from: 1, to: 0 },
      scale: { from: 1, to: 0.5 },
    },
    easing: "power2.out",
    duration: 1.5,
  },

  // Convenience alias so "none" is always valid
  none: {
    properties: {},
    easing: "none",
    duration: 0,
  },
} as const;

export type AnimationPresetKey = keyof typeof ANIMATION_PRESETS;

// ============================================================
// Helper: get all preset keys grouped by category
// ============================================================
export const PRESET_CATEGORIES = {
  entrances: [
    "fadeIn", "slideInLeft", "slideInRight", "slideInUp", "slideInDown",
    "scaleIn", "rotateIn", "flipInX", "flipInY", "zoomBounceIn", "spiralIn",
    "dropIn", "riseUp", "swoopIn", "expandIn", "unfoldX", "unfoldY",
    "revealFromLeft", "revealFromRight", "revealFromTop", "revealFromBottom",
    "circleReveal", "diamondReveal", "splitReveal", "dramaticReveal",
    "cinematicZoom", "glitchIn", "blurIn", "zoomBlurIn", "matrixDrop",
    "neonFlicker", "stampIn", "perspectiveTilt",
  ],
  exits: [
    "fadeOut", "scaleOut", "rotateOut", "blurOut",
    "slideOutLeft", "slideOutRight", "slideOutUp", "slideOutDown",
    "shrinkOut", "collapseX", "collapseY",
  ],
  emphasis: [
    "float", "pulse", "shake", "glow", "heartbeat", "wobble", "breathe",
    "jello", "swing", "rubberBand", "tada", "hoverFloat", "colorShift", "flickerGlow",
  ],
  text: [
    "typewriter", "scrambleIn", "letterByLetter", "wordByWord", "lineByLine",
  ],
  svg: [
    "drawSVG", "drawSVGReverse",
  ],
  physics: [
    "explodeOut",
  ],
} as const;
