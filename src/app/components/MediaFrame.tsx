import Image from "next/image";
import type { ReactNode } from "react";

/* Media / illustration frame — dark-space presentation for the planet map
   and island artwork (Figma Dashboard 193:661-663, home frame 236:356). */

export type MediaFrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  caption?: ReactNode;
  className?: string;
};

export function MediaFrame({
  src,
  alt,
  width,
  height,
  priority = false,
  caption,
  className = "",
}: MediaFrameProps) {
  return (
    <figure
      className={`relative overflow-hidden rounded-[var(--radius-card)] border border-space-600 bg-space-950 shadow-[var(--shadow-panel)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="h-full w-full object-cover"
      />
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-space-950/90 to-transparent px-4 pb-3 pt-8 font-mono text-[11px] font-bold text-hull-100">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
