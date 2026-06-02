"use client";

import { useRef, useState } from "react";

type EarlyLoopVideoProps = {
  src?: string;
  sources?: string[];
  className?: string;
  cutoffSeconds?: number;
  startSeconds?: number | number[];
};

export function EarlyLoopVideo({
  src,
  sources,
  className,
  cutoffSeconds = 3,
  startSeconds = 0,
}: EarlyLoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playlist = sources?.length ? sources : src ? [src] : [];
  const currentSrc = playlist[currentIndex] ?? playlist[0];

  function advanceVideo() {
    if (playlist.length < 2) {
      const video = videoRef.current;

      if (video) {
        video.currentTime = 0;
        void video.play();
      }

      return;
    }

    setCurrentIndex((index) => (index + 1) % playlist.length);
  }

  function handleTimeUpdate() {
    const video = videoRef.current;

    if (!video?.duration || video.duration === Infinity) {
      return;
    }

    if (video.duration - video.currentTime <= cutoffSeconds) {
      advanceVideo();
    }
  }

  function handleLoadedMetadata() {
    const video = videoRef.current;
    const startTime = Array.isArray(startSeconds)
      ? startSeconds[currentIndex] ?? 0
      : startSeconds;

    if (video && startTime > 0 && video.duration > startTime) {
      video.currentTime = startTime;
    }
  }

  if (!currentSrc) {
    return null;
  }

  return (
    <video
      key={currentSrc}
      ref={videoRef}
      className={className}
      src={currentSrc}
      autoPlay
      muted
      playsInline
      preload="metadata"
      onLoadedMetadata={handleLoadedMetadata}
      onTimeUpdate={handleTimeUpdate}
      onEnded={advanceVideo}
    />
  );
}
