"use client";

import { useRef, useEffect, useCallback } from "react";
import { AnimationEngine } from "@/core/animation";
import { useTimelineStore } from "@/store/timelineStore";
import type { Presentation } from "@/core/types";

/**
 * React hook that wraps AnimationEngine.
 * Manages the lifecycle: creates the engine when the world element mounts,
 * rebuilds when presentation data changes, cleans up on unmount.
 */
export function useAnimationEngine(presentation: Presentation) {
  const engineRef = useRef<AnimationEngine | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const { isPlaying, playhead, playbackRate, updatePlayhead } = useTimelineStore();

  // Build/rebuild engine when presentation changes
  const buildEngine = useCallback(() => {
    if (!worldRef.current) return;

    // Destroy previous engine
    engineRef.current?.destroy();

    // Create new engine
    engineRef.current = new AnimationEngine(worldRef.current, presentation);
  }, [presentation]);

  // Sync play/pause state
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isPlaying) {
      engine.timeline.timeScale(playbackRate);
      engine.play();
    } else {
      engine.pause();
    }
  }, [isPlaying, playbackRate]);

  // Sync seek from timeline scrubbing
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || isPlaying) return;
    engine.seek(playhead);
  }, [playhead, isPlaying]);

  // Update playhead during playback (RAF loop)
  useEffect(() => {
    if (!isPlaying) return;

    let rafId: number;
    const tick = () => {
      const engine = engineRef.current;
      if (engine) {
        updatePlayhead(engine.currentTime);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, updatePlayhead]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  return {
    worldRef,
    engineRef,
    buildEngine,
    goToScene: (sceneId: string) => engineRef.current?.goToScene(sceneId),
    play: () => engineRef.current?.play(),
    pause: () => engineRef.current?.pause(),
    seek: (time: number) => engineRef.current?.seek(time),
    duration: engineRef.current?.duration ?? 0,
  };
}
