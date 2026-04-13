"use client";

import React from "react";
import ReactGoogleSlides from "react-google-slides";

export const UserGuides = () => {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-muted/30 aspect-video w-full">
      <ReactGoogleSlides
        width="100%"
        height="100%"
        slidesLink="https://docs.google.com/presentation/d/1aEDCDPV53qk5jWTJSM6S4Zi56yuUqAwz/edit?usp=drive_link&ouid=114490574499420482721&rtpof=true&sd=true"
        autoPlay={false}
        position={1}
        showControls
        loop
        allowFullScreen
      />
    </div>
  );
};
