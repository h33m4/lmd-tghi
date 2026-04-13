"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

type Props = {
  src: string;
  title: string;
  className?: string;
};

export default function EmbedFrame({ src, title, className }: Props) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full border border-primary dark:border-border bg-background rounded-md overflow-hidden ${className ?? ""}`}
    >
      {iframeLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center rounded-md">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      <iframe
        title={title}
        src={src}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        onLoad={() => setIframeLoading(false)}
        style={{ display: iframeLoading ? "none" : "block" }}
        className="rounded-md"
      />

      {!iframeLoading && (
        <>
          {isFullscreen && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/60 backdrop-blur-sm pointer-events-none">
              <span className="text-xs font-bold text-white tracking-wide">LMD</span>
              <span className="text-[10px] font-semibold text-primary bg-white/15 px-1 py-0.5 rounded">2.0</span>
            </div>
          )}
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-sm transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            {isFullscreen ? "Exit" : "Fullscreen"}
          </button>
        </>
      )}
    </div>
  );
}
