import Image from 'next/image'
import type { ReactNode } from 'react'

/* Dark media frame for the map and island artwork. Image sizing and caption
   behavior remain unchanged so visual assets stay useful on the navy shell. */

export type MediaFrameProps = {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  caption?: ReactNode
  className?: string
}

export function MediaFrame({
  src,
  alt,
  width,
  height,
  priority = false,
  caption,
  className = '',
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
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-space-950/95 to-transparent px-4 pb-3 pt-8 font-sans text-xs font-semibold leading-4 text-hull-100">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
