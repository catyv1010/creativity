import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  Presentation,
  Scene,
  SceneElement,
  AnimationDescriptor,
  CameraKeyframe,
  TransitionDescriptor,
  ParallaxConfig,
  WorldTransform,
} from "@/core/types";
import {
  createDefaultPresentation,
  createScene,
  createTextElement,
  createShapeElement,
  createImageElement,
  createAnimation,
  createCameraKeyframe,
  type SceneLayout,
} from "@/core/scene";

interface PresentationState {
  presentation: Presentation;

  // Scene actions
  addScene: (layout?: SceneLayout) => void;
  deleteScene: (sceneId: string) => void;
  duplicateScene: (sceneId: string) => void;
  reorderScenes: (fromIndex: number, toIndex: number) => void;
  updateScene: (sceneId: string, patch: Partial<Scene>) => void;
  updateSceneWorldTransform: (sceneId: string, transform: Partial<WorldTransform>) => void;
  updateSceneTransition: (sceneId: string, transition: Partial<TransitionDescriptor>) => void;
  updateSceneParallax: (sceneId: string, parallax: Partial<ParallaxConfig>) => void;

  // Element actions
  addTextElement: (sceneId: string) => void;
  addShapeElement: (sceneId: string, shape?: "rect" | "circle" | "triangle") => void;
  addImageElement: (sceneId: string, src: string) => void;
  updateElement: (sceneId: string, elementId: string, patch: Partial<SceneElement>) => void;
  deleteElement: (sceneId: string, elementId: string) => void;
  reorderElement: (sceneId: string, fromIndex: number, toIndex: number) => void;

  // Animation actions
  addAnimation: (sceneId: string, elementId: string) => void;
  updateAnimation: (sceneId: string, elementId: string, animId: string, patch: Partial<AnimationDescriptor>) => void;
  deleteAnimation: (sceneId: string, elementId: string, animId: string) => void;

  // Camera actions
  updateCameraKeyframe: (keyframeId: string, patch: Partial<CameraKeyframe>) => void;
  rebuildCameraPath: () => void;

  // Persistence
  loadPresentation: (data: Presentation) => void;
  updateTitle: (title: string) => void;
}

const initialPresentation = createDefaultPresentation("horizontal");

export const usePresentationStore = create<PresentationState>()(
  immer((set, get) => ({
    presentation: initialPresentation,

    // --- SCENES ---

    addScene: (layout = "horizontal") => set((s) => {
      const { scenes, camera } = s.presentation;
      const index = scenes.length;

      // Position the new scene using the layout function
      const { SCENE_LAYOUTS } = require("@/core/scene");
      const layoutFn = SCENE_LAYOUTS[layout];
      const worldTransform = layoutFn(index);

      const scene = createScene({ worldTransform });
      scenes.push(scene);

      // Add camera keyframe
      let time = 0;
      for (const sc of scenes) time += sc.duration;
      camera.keyframes.push(
        createCameraKeyframe(scene.id, worldTransform, time - scene.duration)
      );

      s.presentation.updatedAt = new Date().toISOString();
    }),

    deleteScene: (sceneId) => set((s) => {
      const { scenes, camera } = s.presentation;
      if (scenes.length <= 1) return;

      const idx = scenes.findIndex((sc) => sc.id === sceneId);
      if (idx === -1) return;

      scenes.splice(idx, 1);
      camera.keyframes = camera.keyframes.filter((kf) => kf.sceneId !== sceneId);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    duplicateScene: (sceneId) => set((s) => {
      const { scenes } = s.presentation;
      const idx = scenes.findIndex((sc) => sc.id === sceneId);
      if (idx === -1) return;

      const original = scenes[idx];
      const clone: Scene = JSON.parse(JSON.stringify(original));
      const { createId } = require("@/lib/id");

      clone.id = createId();
      clone.name = `${original.name} (copia)`;
      // Offset position slightly so it doesn't overlap
      clone.worldTransform.x += 300;
      clone.worldTransform.y += 200;

      // Regenerate element IDs
      for (const el of clone.elements) {
        el.id = createId();
        for (const anim of el.animations) anim.id = createId();
      }

      scenes.splice(idx + 1, 0, clone);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    reorderScenes: (fromIndex, toIndex) => set((s) => {
      const [moved] = s.presentation.scenes.splice(fromIndex, 1);
      s.presentation.scenes.splice(toIndex, 0, moved);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    updateScene: (sceneId, patch) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      Object.assign(scene, patch);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    updateSceneWorldTransform: (sceneId, transform) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      Object.assign(scene.worldTransform, transform);

      // Also update camera keyframe
      const kf = s.presentation.camera.keyframes.find((k) => k.sceneId === sceneId);
      if (kf) Object.assign(kf.transform, transform);

      s.presentation.updatedAt = new Date().toISOString();
    }),

    updateSceneTransition: (sceneId, transition) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      Object.assign(scene.transition, transition);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    updateSceneParallax: (sceneId, parallax) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      scene.parallax = { ...scene.parallax, ...parallax } as ParallaxConfig;
      s.presentation.updatedAt = new Date().toISOString();
    }),

    // --- ELEMENTS ---

    addTextElement: (sceneId) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      const el = createTextElement();
      el.zIndex = scene.elements.length;
      scene.elements.push(el);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    addShapeElement: (sceneId, shape = "rect") => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      const el = createShapeElement(shape);
      el.zIndex = scene.elements.length;
      scene.elements.push(el);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    addImageElement: (sceneId, src) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      const el = createImageElement(src);
      el.zIndex = scene.elements.length;
      scene.elements.push(el);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    updateElement: (sceneId, elementId, patch) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      const el = scene.elements.find((e) => e.id === elementId);
      if (!el) return;
      Object.assign(el, patch);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    deleteElement: (sceneId, elementId) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      scene.elements = scene.elements.filter((e) => e.id !== elementId);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    reorderElement: (sceneId, fromIndex, toIndex) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      const [moved] = scene.elements.splice(fromIndex, 1);
      scene.elements.splice(toIndex, 0, moved);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    // --- ANIMATIONS ---

    addAnimation: (sceneId, elementId) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      const el = scene.elements.find((e) => e.id === elementId);
      if (!el) return;
      el.animations.push(createAnimation());
      s.presentation.updatedAt = new Date().toISOString();
    }),

    updateAnimation: (sceneId, elementId, animId, patch) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      const el = scene.elements.find((e) => e.id === elementId);
      if (!el) return;
      const anim = el.animations.find((a) => a.id === animId);
      if (!anim) return;
      Object.assign(anim, patch);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    deleteAnimation: (sceneId, elementId, animId) => set((s) => {
      const scene = s.presentation.scenes.find((sc) => sc.id === sceneId);
      if (!scene) return;
      const el = scene.elements.find((e) => e.id === elementId);
      if (!el) return;
      el.animations = el.animations.filter((a) => a.id !== animId);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    // --- CAMERA ---

    updateCameraKeyframe: (keyframeId, patch) => set((s) => {
      const kf = s.presentation.camera.keyframes.find((k) => k.id === keyframeId);
      if (!kf) return;
      Object.assign(kf, patch);
      s.presentation.updatedAt = new Date().toISOString();
    }),

    rebuildCameraPath: () => set((s) => {
      const { scenes } = s.presentation;
      let time = 0;
      s.presentation.camera.keyframes = scenes.map((scene) => {
        const kf = createCameraKeyframe(scene.id, scene.worldTransform, time);
        time += scene.duration;
        return kf;
      });
      s.presentation.updatedAt = new Date().toISOString();
    }),

    // --- PERSISTENCE ---

    loadPresentation: (data) => set((s) => {
      s.presentation = data;
    }),

    updateTitle: (title) => set((s) => {
      s.presentation.title = title;
      s.presentation.updatedAt = new Date().toISOString();
    }),
  }))
);
