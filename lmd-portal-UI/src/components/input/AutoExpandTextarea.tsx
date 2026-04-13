/**
 * AutoExpandTextarea
 *
 * Grows in height as the user types. Stops expanding at `maxHeight` (px)
 * and switches to scroll after that. When the field loses focus, content
 * beyond the max height is accessible via scroll — the field does not
 * collapse back.
 *
 * Props (in addition to all standard <textarea> HTML attributes):
 * - `minRows`   – minimum visible rows (default 1)
 * - `maxHeight` – px ceiling beyond which the field scrolls (default 300)
 */

import React, { useRef, useEffect, useCallback } from "react";

interface AutoExpandTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxHeight?: number;
}

const AutoExpandTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoExpandTextareaProps
>(function AutoExpandTextarea(
  { onChange, onBlur, className, minRows = 1, maxHeight = 300, style, ...props },
  ref,
) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(
    (el: HTMLTextAreaElement) => {
      // Reset height so scrollHeight reflects actual content height
      el.style.height = "auto";
      const next = el.scrollHeight;
      if (next >= maxHeight) {
        el.style.height = maxHeight + "px";
        el.style.overflowY = "auto";
      } else {
        el.style.height = next + "px";
        el.style.overflowY = "hidden";
      }
    },
    [maxHeight],
  );

  // Resize on mount and whenever value changes externally
  useEffect(() => {
    if (innerRef.current) resize(innerRef.current);
  });

  return (
    <textarea
      ref={(el) => {
        innerRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref)
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
            el;
        if (el) resize(el);
      }}
      rows={minRows}
      style={{ ...style }}
      className={[
        "w-full border border-border rounded-md px-3 py-2 text-sm",
        "bg-background text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary/30",
        "resize-none transition-[height] duration-75",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onChange={(e) => {
        resize(e.target);
        onChange?.(e);
      }}
      onBlur={(e) => {
        // On blur: if content exceeds maxHeight keep scroll accessible
        if (e.target.scrollHeight >= maxHeight) {
          e.target.style.overflowY = "auto";
        }
        onBlur?.(e);
      }}
      {...props}
    />
  );
});

export default AutoExpandTextarea;
