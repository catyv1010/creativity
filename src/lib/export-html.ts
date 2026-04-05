import type {
  Presentation,
  Scene,
  SceneElement,
  ElementContent,
  TextContent,
  ImageContent,
  ShapeContent,
  IconContent,
  DividerContent,
  AnimationDescriptor,
} from "@/core/types";
import { ANIMATION_PRESETS } from "@/core/animation/easing-presets";

type AnimationPresetKey = keyof typeof ANIMATION_PRESETS;

// ---------------------------------------------------------------------------
// Element rendering helpers
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderElementStyle(el: SceneElement): string {
  const t = el.transform;
  const s = el.style;

  const parts: string[] = [
    "position:absolute",
    `left:${t.x}px`,
    `top:${t.y}px`,
    `width:${t.width}px`,
    `height:${t.height}px`,
    `opacity:${t.opacity}`,
    `transform:rotate(${t.rotation}deg) scaleX(${t.scaleX}) scaleY(${t.scaleY})`,
    `transform-origin:${t.originX * 100}% ${t.originY * 100}%`,
    `z-index:${el.zIndex}`,
  ];

  if (s.backgroundColor) parts.push(`background-color:${s.backgroundColor}`);
  if (s.borderRadius) parts.push(`border-radius:${s.borderRadius}px`);
  if (s.borderWidth && s.borderColor)
    parts.push(`border:${s.borderWidth}px solid ${s.borderColor}`);
  if (s.boxShadow) parts.push(`box-shadow:${s.boxShadow}`);
  if (s.filter) parts.push(`filter:${s.filter}`);
  if (s.backdropFilter) parts.push(`backdrop-filter:${s.backdropFilter}`);
  if (s.clipPath) parts.push(`clip-path:${s.clipPath}`);
  if (s.mixBlendMode) parts.push(`mix-blend-mode:${s.mixBlendMode}`);

  return parts.join(";");
}

function renderContentHTML(content: ElementContent): string {
  switch (content.type) {
    case "text": {
      const c = content as TextContent;
      const style = [
        `font-family:${c.fontFamily},Inter,sans-serif`,
        `font-size:${c.fontSize}px`,
        `font-weight:${c.fontWeight}`,
        `color:${c.color}`,
        `text-align:${c.textAlign}`,
        c.lineHeight ? `line-height:${c.lineHeight}` : "",
        c.letterSpacing ? `letter-spacing:${c.letterSpacing}px` : "",
        "width:100%",
        "height:100%",
        "overflow:hidden",
        "word-wrap:break-word",
      ]
        .filter(Boolean)
        .join(";");
      // html content is already rich-text HTML from Tiptap
      return `<div style="${style}">${c.html}</div>`;
    }

    case "image": {
      const c = content as ImageContent;
      return `<img src="${escapeHtml(c.src)}" alt="${escapeHtml(c.alt)}" style="width:100%;height:100%;object-fit:${c.objectFit};display:block;" />`;
    }

    case "shape": {
      const c = content as ShapeContent;
      const styles: string[] = [
        "width:100%",
        "height:100%",
        `background:${c.fill}`,
      ];
      if (c.stroke)
        styles.push(`border:${c.strokeWidth ?? 2}px solid ${c.stroke}`);
      if (c.shape === "circle") styles.push("border-radius:50%");
      if (c.shape === "triangle")
        styles.push(
          "clip-path:polygon(50% 0%, 0% 100%, 100% 100%)",
          "background:" + c.fill
        );
      return `<div style="${styles.join(";")}"></div>`;
    }

    case "icon": {
      const c = content as IconContent;
      return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:${c.color};font-size:2em;font-weight:600;">${escapeHtml(c.iconName)}</div>`;
    }

    case "divider": {
      const c = content as DividerContent;
      const isHorizontal = c.direction === "horizontal";
      const borderProp = isHorizontal ? "border-top" : "border-left";
      return `<div style="width:100%;height:100%;${borderProp}:${c.thickness}px ${c.style} ${c.color};"></div>`;
    }

    case "video":
      return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#111;color:#666;font-family:Inter,sans-serif;">Video (not supported in export)</div>`;

    case "group":
      return "";

    default:
      return "";
  }
}

function renderElement(el: SceneElement): string {
  if (!el.visible) return "";

  const animAttrs = el.animations.length > 0
    ? ` data-animations='${JSON.stringify(el.animations).replace(/'/g, "&#39;")}'`
    : "";

  return `<div data-element-id="${el.id}" style="${renderElementStyle(el)}"${animAttrs}>${renderContentHTML(el.content)}</div>`;
}

// ---------------------------------------------------------------------------
// Scene rendering
// ---------------------------------------------------------------------------

function renderScene(scene: Scene, settings: { width: number; height: number }): string {
  const wt = scene.worldTransform;
  const tr = scene.transition;

  // Scene background
  const bgParts: string[] = [
    `background-color:${scene.backgroundColor || "#0a0a0a"}`,
  ];
  if (scene.backgroundGradient) bgParts.push(`background-image:${scene.backgroundGradient}`);
  if (scene.backgroundImage) bgParts.push(`background-image:url(${scene.backgroundImage})`);
  if (scene.backgroundBlur) bgParts.push(`filter:blur(${scene.backgroundBlur}px)`);

  const sceneStyle = [
    "position:absolute",
    `left:${wt.x}px`,
    `top:${wt.y}px`,
    `width:${settings.width}px`,
    `height:${settings.height}px`,
    ...bgParts,
    "overflow:hidden",
    "border-radius:8px",
  ].join(";");

  const overlay = scene.backgroundOverlay
    ? `<div style="position:absolute;inset:0;background:${scene.backgroundOverlay};pointer-events:none;"></div>`
    : "";

  const elements = scene.elements.map(renderElement).join("\n      ");

  return `    <div class="scene" data-scene="true" data-scene-id="${scene.id}"
         data-x="${wt.x}" data-y="${wt.y}" data-z="${wt.z}" data-rotation="${wt.rotation}" data-scale="${wt.scale}"
         data-transition-type="${tr.type}" data-transition-duration="${tr.duration}" data-transition-easing="${tr.easing}"
         style="${sceneStyle}">
      ${overlay}
      ${elements}
    </div>`;
}

// ---------------------------------------------------------------------------
// Animation presets serialization for inline script
// ---------------------------------------------------------------------------

function serializePresets(): string {
  const obj: Record<string, { properties: Record<string, unknown>; easing: string; duration: number }> = {};
  for (const [key, value] of Object.entries(
    ANIMATION_PRESETS as Record<string, { properties: Record<string, unknown>; easing: string; duration: number }>
  )) {
    obj[key] = {
      properties: value.properties,
      easing: value.easing,
      duration: value.duration,
    };
  }
  return JSON.stringify(obj);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generates a self-contained HTML string for a presentation.
 * Includes GSAP from CDN, all scenes in world-space, camera system, and navigation.
 */
export function exportToHTML(presentation: Presentation): string {
  const { settings, scenes } = presentation;
  const sceneMarkup = scenes.map((s) => renderScene(s, settings)).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(presentation.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"><\/script>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%;
      overflow: hidden;
      background: #000;
      font-family: 'Inter', sans-serif;
      color: #fff;
      cursor: pointer;
      user-select: none;
    }
    #viewport {
      position: absolute;
      top: 50%; left: 50%;
      width: ${settings.width}px; height: ${settings.height}px;
      transform-origin: center center;
      perspective: 1200px;
      overflow: visible;
    }
    #world {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      transform-origin: 0 0;
      will-change: transform;
    }
    .scene {
      box-shadow: 0 0 80px rgba(0,0,0,0.5);
    }
    #fade-overlay {
      position: fixed; inset: 0;
      background: #000;
      opacity: 0;
      pointer-events: none;
      z-index: 9998;
    }
    #blur-overlay {
      position: fixed; inset: 0;
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
      pointer-events: none;
      z-index: 9997;
    }
    /* HUD */
    #hud {
      position: fixed;
      bottom: 24px; left: 50%;
      transform: translateX(-50%);
      display: flex; gap: 8px;
      z-index: 10000;
      align-items: center;
    }
    .dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      transition: background 0.4s, transform 0.4s;
      cursor: pointer;
    }
    .dot.active {
      background: rgba(255,255,255,0.9);
      transform: scale(1.3);
    }
    #scene-counter {
      position: fixed;
      bottom: 24px; right: 32px;
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      font-variant-numeric: tabular-nums;
      z-index: 10000;
    }
  </style>
</head>
<body>
  <div id="viewport">
    <div id="world">
${sceneMarkup}
    </div>
  </div>
  <div id="fade-overlay"></div>
  <div id="blur-overlay"></div>
  <div id="hud">
${scenes.map((_, i) => `    <div class="dot${i === 0 ? " active" : ""}" data-dot="${i}"></div>`).join("\n")}
  </div>
  <div id="scene-counter">1 / ${scenes.length}</div>
  <script>
(function() {
  // --- Presets ---
  var PRESETS = ${serializePresets()};

  // --- Elements ---
  var viewport = document.getElementById('viewport');
  var world = document.getElementById('world');
  var fadeOverlay = document.getElementById('fade-overlay');
  var blurOverlay = document.getElementById('blur-overlay');
  var counter = document.getElementById('scene-counter');
  var dots = document.querySelectorAll('.dot');
  var sceneEls = document.querySelectorAll('[data-scene="true"]');
  var totalScenes = sceneEls.length;
  var currentIndex = 0;
  var isAnimating = false;

  // --- Viewport scaling ---
  var BASE_W = ${settings.width};
  var BASE_H = ${settings.height};

  function resizeViewport() {
    var ww = window.innerWidth;
    var wh = window.innerHeight;
    var scale = Math.min(ww / BASE_W, wh / BASE_H);
    viewport.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
  }
  window.addEventListener('resize', resizeViewport);
  resizeViewport();

  // --- Scene data ---
  var scenes = [];
  sceneEls.forEach(function(el) {
    scenes.push({
      el: el,
      x: parseFloat(el.dataset.x),
      y: parseFloat(el.dataset.y),
      z: parseFloat(el.dataset.z) || 0,
      rotation: parseFloat(el.dataset.rotation) || 0,
      scale: parseFloat(el.dataset.scale) || 1,
      transitionType: el.dataset.transitionType || 'camera-move',
      transitionDuration: parseFloat(el.dataset.transitionDuration) || 1.2,
      transitionEasing: el.dataset.transitionEasing || 'power2.inOut',
    });
  });

  // --- Camera helpers ---
  // Inverse transform: camera at scene means world moves inversely
  function getCameraTransform(scene) {
    var invScale = 1 / scene.scale;
    var cx = BASE_W / 2;
    var cy = BASE_H / 2;
    return {
      x: -scene.x * invScale - cx * (invScale - 1),
      y: -scene.y * invScale - cy * (invScale - 1),
      rotation: -scene.rotation,
      scale: invScale,
    };
  }

  function applyCameraSnap(scene) {
    var cam = getCameraTransform(scene);
    gsap.set(world, {
      x: cam.x,
      y: cam.y,
      rotation: cam.rotation,
      scale: cam.scale,
    });
  }

  // --- Snap to first scene ---
  if (scenes.length > 0) {
    applyCameraSnap(scenes[0]);
  }

  // --- Run entrance animations for a scene ---
  function runEntranceAnimations(sceneIndex) {
    var sceneEl = scenes[sceneIndex].el;
    var elements = sceneEl.querySelectorAll('[data-animations]');
    elements.forEach(function(el) {
      try {
        var anims = JSON.parse(el.dataset.animations);
        anims.forEach(function(anim) {
          if (anim.type !== 'entrance') return;

          var preset = anim.preset && PRESETS[anim.preset] ? PRESETS[anim.preset] : null;
          var duration = anim.timing.duration || (preset ? preset.duration : 0.8);
          var easing = anim.easing || (preset ? preset.easing : 'power2.out');
          var delay = (anim.trigger.delay || 0) + (anim.timing.startTime || 0);

          // Build from/to objects
          var fromVars = {};
          var toVars = { duration: duration, ease: easing, delay: delay };

          if (anim.timing.repeat) {
            toVars.repeat = anim.timing.repeat;
            if (anim.timing.yoyo) toVars.yoyo = true;
          }

          // Merge preset properties
          var props = preset ? preset.properties : {};
          // Override with descriptor properties
          if (anim.properties) {
            for (var k in anim.properties) {
              props[k] = anim.properties[k];
            }
          }

          for (var key in props) {
            var val = props[key];
            if (val && typeof val === 'object' && 'from' in val && 'to' in val) {
              fromVars[key] = val.from;
              toVars[key] = val.to;
            } else {
              toVars[key] = val;
            }
          }

          gsap.fromTo(el, fromVars, toVars);
        });
      } catch(e) { /* skip malformed */ }
    });
  }

  // Run entrance animations for first scene
  if (scenes.length > 0) {
    runEntranceAnimations(0);
  }

  // --- Update HUD ---
  function updateHUD() {
    counter.textContent = (currentIndex + 1) + ' / ' + totalScenes;
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // --- Transitions ---
  function transitionCameraMove(target, duration, easing) {
    var cam = getCameraTransform(target);
    return gsap.to(world, {
      x: cam.x,
      y: cam.y,
      rotation: cam.rotation,
      scale: cam.scale,
      duration: duration,
      ease: easing,
    });
  }

  function transitionFade(target, duration, easing) {
    var tl = gsap.timeline();
    tl.to(fadeOverlay, { opacity: 1, duration: duration * 0.45, ease: 'power2.in' });
    tl.call(function() { applyCameraSnap(target); });
    tl.to(fadeOverlay, { opacity: 0, duration: duration * 0.55, ease: 'power2.out' });
    return tl;
  }

  function transitionZoomBlur(target, duration, easing) {
    var tl = gsap.timeline();
    tl.to(world, { scale: '+=0.3', duration: duration * 0.4, ease: 'power2.in' });
    tl.to(blurOverlay, { backdropFilter: 'blur(20px)', webkitBackdropFilter: 'blur(20px)', duration: duration * 0.3, ease: 'power2.in' }, '<');
    tl.call(function() { applyCameraSnap(target); });
    tl.to(blurOverlay, { backdropFilter: 'blur(0px)', webkitBackdropFilter: 'blur(0px)', duration: duration * 0.4, ease: 'power2.out' });
    return tl;
  }

  function transitionWhipPan(target, duration, easing) {
    var tl = gsap.timeline();
    var cam = getCameraTransform(target);
    // Fast pan in exit direction with blur, then arrive
    tl.to(world, { x: '+=300', duration: duration * 0.25, ease: 'power3.in' });
    tl.to(blurOverlay, { backdropFilter: 'blur(30px)', webkitBackdropFilter: 'blur(30px)', duration: duration * 0.15, ease: 'power2.in' }, '<');
    tl.call(function() { applyCameraSnap(target); gsap.set(world, { x: cam.x - 300 }); });
    tl.to(world, { x: cam.x, duration: duration * 0.35, ease: 'power3.out' });
    tl.to(blurOverlay, { backdropFilter: 'blur(0px)', webkitBackdropFilter: 'blur(0px)', duration: duration * 0.25, ease: 'power2.out' }, '<');
    return tl;
  }

  function transitionDollyZoom(target, duration, easing) {
    // Hitchcock effect: scale in opposite direction of camera movement
    var tl = gsap.timeline();
    var cam = getCameraTransform(target);
    tl.to(world, {
      x: cam.x, y: cam.y, rotation: cam.rotation, scale: cam.scale * 1.6,
      duration: duration * 0.5, ease: 'power2.in'
    });
    tl.to(world, {
      scale: cam.scale,
      duration: duration * 0.5, ease: 'power2.out'
    });
    return tl;
  }

  function transitionIris(target, duration, easing) {
    // Circular iris wipe reveal
    var overlay = document.getElementById('iris-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'iris-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9999;pointer-events:none;';
      document.body.appendChild(overlay);
    }
    var tl = gsap.timeline();
    // Close iris (circle shrinks to 0)
    tl.fromTo(overlay,
      { clipPath: 'circle(75% at 50% 50%)', opacity: 1 },
      { clipPath: 'circle(0% at 50% 50%)', duration: duration * 0.45, ease: 'power2.in' }
    );
    tl.call(function() { applyCameraSnap(target); });
    // Open iris (circle expands from 0)
    tl.fromTo(overlay,
      { clipPath: 'circle(0% at 50% 50%)', opacity: 1 },
      { clipPath: 'circle(75% at 50% 50%)', duration: duration * 0.45, ease: 'power2.out' }
    );
    tl.to(overlay, { opacity: 0, duration: 0.1 });
    return tl;
  }

  function transitionFilmGrainCut(target, duration, easing) {
    // Instant cut with retro film grain flash
    var grain = document.getElementById('grain-overlay');
    if (!grain) {
      grain = document.createElement('canvas');
      grain.id = 'grain-overlay';
      grain.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:0;mix-blend-mode:overlay;';
      grain.width = BASE_W; grain.height = BASE_H;
      document.body.appendChild(grain);
    }
    // Draw noise on canvas
    var ctx = grain.getContext('2d');
    var imgData = ctx.createImageData(BASE_W, BASE_H);
    for (var i = 0; i < imgData.data.length; i += 4) {
      var v = Math.random() * 255;
      imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = v;
      imgData.data[i+3] = 200;
    }
    ctx.putImageData(imgData, 0, 0);
    var tl = gsap.timeline();
    tl.to(grain, { opacity: 0.8, duration: 0.05 });
    tl.call(function() { applyCameraSnap(target); });
    tl.to(grain, { opacity: 0, duration: duration * 0.6, ease: 'power2.out' });
    return tl;
  }

  function transitionParallaxShift(target, duration, easing) {
    // Deep parallax: world moves with slight overshoot and depth rotation
    var tl = gsap.timeline();
    var cam = getCameraTransform(target);
    tl.to(world, {
      x: cam.x * 1.05,
      y: cam.y * 1.05,
      rotation: (cam.rotation || 0) + 1.5,
      scale: cam.scale,
      duration: duration * 0.6,
      ease: 'power2.inOut'
    });
    tl.to(world, {
      x: cam.x, y: cam.y, rotation: cam.rotation || 0,
      duration: duration * 0.4, ease: 'power1.out'
    });
    return tl;
  }

  function goToScene(index) {
    if (isAnimating || index === currentIndex || index < 0 || index >= totalScenes) return;
    isAnimating = true;

    var target = scenes[index];
    var type = target.transitionType;
    var duration = target.transitionDuration;
    var easing = target.transitionEasing;

    var anim;
    switch (type) {
      case 'fade':
        anim = transitionFade(target, duration, easing);
        break;
      case 'zoom-blur':
        anim = transitionZoomBlur(target, duration, easing);
        break;
      case 'whip-pan':
        anim = transitionWhipPan(target, duration, easing);
        break;
      case 'dolly-zoom':
        anim = transitionDollyZoom(target, duration, easing);
        break;
      case 'iris':
        anim = transitionIris(target, duration, easing);
        break;
      case 'film-grain-cut':
        anim = transitionFilmGrainCut(target, duration, easing);
        break;
      case 'parallax-shift':
        anim = transitionParallaxShift(target, duration, easing);
        break;
      case 'camera-move':
      default:
        anim = transitionCameraMove(target, duration, easing);
        break;
    }

    currentIndex = index;
    updateHUD();

    // When transition completes, run entrance animations
    if (anim && anim.then) {
      anim.then(function() {
        isAnimating = false;
        runEntranceAnimations(currentIndex);
      });
    } else if (anim && anim.eventCallback) {
      anim.eventCallback('onComplete', function() {
        isAnimating = false;
        runEntranceAnimations(currentIndex);
      });
    } else {
      isAnimating = false;
      runEntranceAnimations(currentIndex);
    }
  }

  // --- Keyboard navigation ---
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToScene(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToScene(currentIndex - 1);
    }
    // Escape: do nothing
  });

  // --- Click to advance ---
  document.addEventListener('click', function(e) {
    // Don't advance if clicking a dot
    if (e.target.classList && e.target.classList.contains('dot')) return;
    goToScene(currentIndex + 1);
  });

  // --- Dot navigation ---
  dots.forEach(function(dot) {
    dot.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(dot.dataset.dot, 10);
      goToScene(idx);
    });
  });
})();
  <\/script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Download helper
// ---------------------------------------------------------------------------

/**
 * Triggers a browser download of the presentation as a standalone HTML file.
 */
export function downloadHTML(presentation: Presentation) {
  const html = exportToHTML(presentation);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${presentation.title.replace(/[^a-zA-Z0-9]/g, "-")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Sends the presentation HTML to the PDF export API route and triggers download.
 * Throws on failure so callers can show feedback.
 */
export async function downloadPDF(presentation: Presentation): Promise<void> {
  const html = exportToHTML(presentation);

  const res = await fetch("/api/export-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      html,
      title: presentation.title,
      width: presentation.settings.width,
      height: presentation.settings.height,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? "PDF generation failed");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${presentation.title.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
