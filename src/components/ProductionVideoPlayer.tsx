"use client";

import { useEffect, useRef } from "react";

type ProductionVideoPlayerProps = {
  className?: string;
  src: string;
};

export function ProductionVideoPlayer({
  className,
  src,
}: ProductionVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    void video.play().catch(() => {
      // Some browsers delay autoplay until the video enters the viewport.
    });
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onCanPlay={() => {
        const video = videoRef.current;

        if (video) {
          void video.play().catch(() => {});
        }
      }}
    />
  );
}
