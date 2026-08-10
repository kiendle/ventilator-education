/* Minimal inline icon set matching Figma menu (321:117), HUD group (317:616)
   and "iPhone 17 - 11" nav instances (193:672-675). Stroke icons inherit
   currentColor so active/inactive states follow the design tokens. */

import type { ReactNode } from "react";

type IconProps = { className?: string };

function stroke(props: IconProps, paths: ReactNode) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className ?? "size-5"}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </>
  ));

export const UserIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
    </>
  ));

export const SettingsIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.14-1.4l2.1-1.63-2-3.46-2.48 1a7 7 0 0 0-2.42-1.4L13.68 2h-3.36l-.38 2.6a7 7 0 0 0-2.42 1.4l-2.48-1-2 3.46 2.1 1.63a7 7 0 0 0 0 2.8l-2.1 1.63 2 3.46 2.48-1a7 7 0 0 0 2.42 1.4l.38 2.62h3.36l.38-2.6a7 7 0 0 0 2.42-1.4l2.48 1 2-3.46-2.1-1.64c.09-.46.14-.93.14-1.41Z" />
    </>
  ));

export const BoxIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M12 13v8" />
    </>
  ));

export const FlameIcon = (p: IconProps) =>
  stroke(p, (
    <path d="M12 22c4 0 7-2.8 7-6.8 0-3-1.8-5-3.2-6.7C14.3 6.7 13 5 13 2c-3 2-4.5 4.4-4.5 7 0 1 .2 1.9.5 2.7C8 10.9 7 10 6.4 8.6 5.3 10 5 11.6 5 13.2 5 19.2 8 22 12 22Z" />
  ));

export const StarIcon = (p: IconProps) =>
  stroke(p, (
    <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17l-6.1 3.6 1.4-6.8L2.2 9.1l6.9-.8L12 2Z" />
  ));

export const MapIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M9 3 3 5.5v15L9 18l6 2.5 6-2.5v-15L15 5.5 9 3Z" />
      <path d="M9 3v15" />
      <path d="M15 5.5v15" />
    </>
  ));

export const PlayIcon = (p: IconProps) =>
  stroke(p, <path d="M6 4.5v15l13-7.5L6 4.5Z" />);

export const BookIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </>
  ));

export const QuizIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.6-3 4.5" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" />
      <circle cx="12" cy="12" r="10" />
    </>
  ));

export const MailIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ));

export const LockIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ));

export const ArrowLeftIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </>
  ));

export const CheckIcon = (p: IconProps) =>
  stroke(p, <path d="m4 12.5 5 5L20 6.5" />);

export const RocketIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M12 15c5-3 7-8.5 7-12-3.5 0-9 2-12 7l-3 1 3 4 4 3 1-3Z" />
      <path d="M9 15 4.5 19.5" />
      <circle cx="14" cy="8" r="1.6" />
    </>
  ));

export const FlaskIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M10 2v6L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8V2" />
      <path d="M8.5 2h7" />
      <path d="M7 15h10" />
    </>
  ));

export const ClipboardIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <rect x="5" y="4" width="14" height="18" rx="2" />
      <path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      <path d="M9 11h6M9 15h6" />
    </>
  ));

export const ChartIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M3 3v18h18" />
      <path d="M8 16v-5M13 16V8M18 16v-8" />
    </>
  ));

export const AlertIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </>
  ));

export const WifiOffIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M2 8.8A15 15 0 0 1 12 5c2.3 0 4.5.5 6.4 1.4" />
      <path d="M5.5 12.5a10 10 0 0 1 4.2-2.3" />
      <path d="M8.8 16a5 5 0 0 1 5.2-1.2" />
      <circle cx="12" cy="19.5" r="0.5" fill="currentColor" />
      <path d="m3 3 18 18" />
    </>
  ));

export const DownloadIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M4 21h16" />
    </>
  ));

export const RefreshIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
    </>
  ));

export const GripIcon = (p: IconProps) =>
  stroke(p, (
    <>
      <circle cx="9" cy="6" r="0.6" fill="currentColor" />
      <circle cx="15" cy="6" r="0.6" fill="currentColor" />
      <circle cx="9" cy="12" r="0.6" fill="currentColor" />
      <circle cx="15" cy="12" r="0.6" fill="currentColor" />
      <circle cx="9" cy="18" r="0.6" fill="currentColor" />
      <circle cx="15" cy="18" r="0.6" fill="currentColor" />
    </>
  ));
