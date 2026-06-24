// ────────────────────────────────────────────────────────────
// RescueMind AI — Shared SVG Icon Components
// All icons are Phosphor-compatible inline SVGs (no dependency)
// ────────────────────────────────────────────────────────────

import { type SVGAttributes } from "react";

type IconProps = SVGAttributes<SVGSVGElement> & { className?: string };

export function IconPen({ className = "", ...props }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,192H48V147.31l88-88L180.69,104Z" />
    </svg>
  );
}

export function IconMapPin({ className = "", ...props }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,200.42C105.8,200.69,56,155.25,56,104a72,72,0,0,1,144,0C200,155.25,150.2,200.69,128,216.42ZM128,56a40,40,0,1,0,40,40A40,40,0,0,0,128,56Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,120Z" />
    </svg>
  );
}

export function IconPaperPlane({ className = "", ...props }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M234.29,114.11l-208-80A8,8,0,0,0,17.08,40.37L41.28,128,17.08,215.63a8,8,0,0,0,9.21,9.74l208-80a8,8,0,0,0,0-15.26ZM41.64,201.52,59.7,136H120a8,8,0,0,0,0-16H59.7L41.64,54.48,215.71,128Z" />
    </svg>
  );
}

export function IconClipboard({ className = "", ...props }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200V216Z" />
    </svg>
  );
}

export function IconWarning({ className = "", ...props }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Zm-20.17,14.43A8.17,8.17,0,0,1,215.45,208H40.55a8.17,8.17,0,0,1-7.18-5.48,7.66,7.66,0,0,1,0-7.72l87.45-151.87a8.33,8.33,0,0,1,14.36,0l87.45,151.87A7.66,7.66,0,0,1,216.63,202.52ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,28a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
    </svg>
  );
}

export function IconCheck({ className = "", ...props }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}

export function IconSpinner({ className = "", ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={`animate-spin ${className}`} aria-hidden="true" {...props}>
      <path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.26,32.75a8,8,0,0,1,11.31-11.31l22.63,22.63a8,8,0,0,1-11.32,11.32ZM232,120a8,8,0,0,1,0,16H200a8,8,0,0,1,0-16Zm-27.8,54.06a8,8,0,0,1,11.32,11.31l-22.63,22.63a8,8,0,0,1-11.31-11.31ZM128,192a8,8,0,0,1,8,8v32a8,8,0,0,1-16,0V200A8,8,0,0,1,128,192ZM77.66,175.34,55,198a8,8,0,0,1-11.31-11.32l22.63-22.63a8,8,0,0,1,11.31,11.31ZM48,128a8,8,0,0,1-8,8H8a8,8,0,0,1,0-16H40A8,8,0,0,1,48,128Zm6.06-67.34A8,8,0,0,1,65.37,49.39L88,72a8,8,0,0,1-11.31,11.32Z" />
    </svg>
  );
}

export function IconBuilding({ className = "", ...props }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M248,208H224V40a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8V208H8a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16ZM56,80V64h32V80Zm48,0V64h32V80Zm0,48V112h32v16ZM56,128V112h32v16Zm96-48V64h32V80Zm32,16v16H152V112ZM72,208V176h40v32Zm72,0V176h40v32Z" />
    </svg>
  );
}

export function IconClock({ className = "", ...props }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
    </svg>
  );
}

export function IconChartBar({ className = "", ...props }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V200H224A8,8,0,0,1,232,208ZM72,168a8,8,0,0,0,16,0V120a8,8,0,0,0-16,0Zm48,0a8,8,0,0,0,16,0V72a8,8,0,0,0-16,0Zm48,0a8,8,0,0,0,16,0V96a8,8,0,0,0-16,0Z" />
    </svg>
  );
}

export function IconTrash({ className = "", ...props }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
    </svg>
  );
}

export function IconSearch({ className = "", ...props }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
    </svg>
  );
}

export function IconPlus({ className = "", ...props }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

export function IconEmpty({ className = "", ...props }: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96H72a8,8,0,0,0,0,16H184a8,8,0,0,0,0-16Zm0,32H72a8,8,0,0,0,0,16H184a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

export function IconLock({ className = "", ...props }: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-80-88a12,12,0,1,1-12,12A12,12,0,0,1,128,120Z" />
    </svg>
  );
}

export function IconEnvelope({ className = "", ...props }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" />
    </svg>
  );
}

export function IconKey({ className = "", ...props }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,72a32,32,0,0,0-24.51,52.94L88,155.31l6.34,6.35a8,8,0,0,0,11.32,0L112,155.31l4.69,4.69a8,8,0,0,0,11.31,0l4.69-4.69,6.34,6.35a8,8,0,0,0,11.32,0l6.34-6.35A32,32,0,0,0,128,72Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,120Z" />
    </svg>
  );
}

export function IconArrowRight({ className = "", ...props }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

export function IconUser({ className = "", ...props }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,76a32,32,0,1,1-32,32A32,32,0,0,1,128,76Zm0,48a16,16,0,1,0-16-16A16,16,0,0,0,128,124Zm0,76c-17.57,0-33.22-5.59-44.83-14.54A8,8,0,0,1,91.53,175c8.6,5.45,17.35,9,36.47,9s27.87-3.55,36.47-9a8,8,0,1,1,8.38,13.63C161.22,194.41,145.57,200,128,200Z" />
    </svg>
  );
}

export function IconSignOut({ className = "", ...props }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M120,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h64a8,8,0,0,1,0,16H48V208h64A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z" />
    </svg>
  );
}

export function IconHome({ className = "", ...props }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216Z" />
      <path d="M104,104H72a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h32a8,8,0,0,0,8-8V112A8,8,0,0,0,104,104Zm-8,48H80V120h16Z" />
      <path d="M184,136H152a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Z" />
      <path d="M184,104H152a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

export function IconDashboard({ className = "", ...props }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M232,88a8,8,0,0,0-8,8v24l-49.69-49.7a8,8,0,0,0-11.32,0L128,105.37,77.66,55a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,32,106.34L72,66.34l50.34,50.34a8,8,0,0,0,11.32,0L168,82.35,215.4,129.8A8,8,0,0,0,224,128V96A8,8,0,0,0,232,88Z" />
      <path d="M216,152H168a8,8,0,0,0-8,8v40H96V120a8,8,0,0,0-16,0v80H48V152a8,8,0,0,0-16,0v40a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V160A8,8,0,0,0,216,152Z" />
    </svg>
  );
}

export function IconSun({ className = "", ...props }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

export function IconMoon({ className = "", ...props }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.78-109.78,8,8,0,0,0-10-10,104.84,104.84,0,0,0-36.86,173.68A104.84,104.84,0,0,0,173.68,220.56a8,8,0,0,0,10-10,88.08,88.08,0,0,1,109.78-109.78A8,8,0,0,0,233.54,142.23ZM190.73,202.7A88.89,88.89,0,0,1,53.3,65.27,89.06,89.06,0,0,1,98.9,39.44,104.14,104.14,0,0,0,216.56,157.1,89.06,89.06,0,0,1,190.73,202.7Z" />
    </svg>
  );
}

export function IconDownload({ className = "", ...props }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,132.69V40a8,8,0,0,0-16,0v92.69L93.66,106.34a8,8,0,0,0-11.32,11.32Z" />
    </svg>
  );
}

export function IconRefresh({ className = "", ...props }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M197.64,186.36a8,8,0,0,1,0,11.31C182.7,212.62,165.78,220,146.63,221.88c-1.1.1-2.21.15-3.31.15a67.11,67.11,0,0,1-47.76-19.8L74.56,181.33,62.17,184.29a8,8,0,0,1-9.7-5.9l-7.5-36.56a8,8,0,0,1,9.7-9.7l36.56,7.5a8,8,0,0,1,5.9,9.7L89.17,163.7,104.1,179a50.79,50.79,0,0,0,28.2,14.78c21.32,3,42-4.44,57.44-19.94A8,8,0,0,1,197.64,186.36Zm8-116.72-36.56-7.5a8,8,0,0,0-9.7,9.7l2.19,10.66-19.07,19.79h0L128,118.13h0L104.9,96.06a8,8,0,0,0-11.32,0L71.31,118.34a8,8,0,0,0,0,11.32l22.27,22.28a8,8,0,0,0,11.32,0l18-18h0l19.07-19.78-3.15-15.34a50.79,50.79,0,0,1,28.2,14.78l4.38,4.38,21.17,3.3a7.9,7.9,0,0,0,1.35.12,8,8,0,0,0,7.87-6.84l7.5-36.56A8,8,0,0,0,205.64,69.64Z" />
    </svg>
  );
}

export function IconCircle({ className = "", ...props }: IconProps) {
  return (
    <svg width="10" height="10" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <circle cx="128" cy="128" r="96" />
    </svg>
  );
}

export function IconArrowLeft({ className = "", ...props }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

export function IconExternal({ className = "", ...props }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M224,104a8,8,0,0,1-16,0V59.31l-66.34,66.35a8,8,0,0,1-11.32-11.32L196.69,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v64H48V80h64a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V136A8,8,0,0,0,184,128Z" />
    </svg>
  );
}

export function IconShield({ className = "", ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,26.26,46.58,26.5a8,8,0,0,0,5.94,0c.57-.24,23.52-7.64,46.58-26.5C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,45.44-21.31,73.16-39.6,88.35a100.25,100.25,0,0,1-40.4,21.34,100.25,100.25,0,0,1-40.4-21.34C69.31,185.16,48,157.44,48,112V56H208Z" />
    </svg>
  );
}

export function IconLightning({ className = "", ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l81.25-87.06L132.74,98.33a8,8,0,0,0,5,9.06l52.82,19.8Z" />
    </svg>
  );
}

export function IconGlobe({ className = "", ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm41.33-112h-24.33c-3.66-21.58-9.86-39.87-17.58-52.87A72.23,72.23,0,0,1,169.33,104ZM128,55.14c8,11.44,15.11,28.34,19.2,48.86H108.8C112.89,83.48,120,66.58,128,55.14ZM70,136c0-20.51,4.64-39.44,12.43-54.54A56.19,56.19,0,0,0,70,136Zm22.54,29.22C84.75,150.12,80,131.19,80,136H56A56.19,56.19,0,0,0,92.54,165.22Zm.13,1.56A72.23,72.23,0,0,0,128,184.87c7.72-13,13.92-31.29,17.58-52.87H110.42C114.08,153.59,120.28,172,128,184.87ZM128,200.86c-8-11.44-15.11-28.34-19.2-48.86h38.4C143.11,172.52,136,189.42,128,200.86ZM186,136a56.19,56.19,0,0,0-12.54-54.54C180.36,96.56,185,115.49,186,136Zm-22.54,29.22A72.23,72.23,0,0,0,200,136h-24C176,131.19,171.36,150.12,163.46,165.22Z" />
    </svg>
  );
}

export function IconStar({ className = "", ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M234.29,114.11l-45,38.83L204,205.59a8,8,0,0,1-11.62,9.21L128,177.87l-64.41,36.93A8,8,0,0,1,52,205.59l14.76-52.65-45.05-38.83A8,8,0,0,1,27.14,100.5l55.31-6.37L103.24,46.07a8,8,0,0,1,14.52,0l20.79,53.37,55.31,6.37a8,8,0,0,1,5.43,13.3Z" />
    </svg>
  );
}

export function IconUsers({ className = "", ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M117.25,157.92a60,60,0,1,0-66.5,0,95.83,95.83,0,0,0-47.22,37.71A8,8,0,1,0,15.38,205a80,80,0,0,1,145.24,0,8,8,0,0,0,14.38-7.05A95.83,95.83,0,0,0,117.25,157.92ZM40,108A44,44,0,1,1,84,152,44.05,44.05,0,0,1,40,108Zm210.14,86.58a8,8,0,0,1-10.57-3.53A79.53,79.53,0,0,0,176,160a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,194.58Z" />
    </svg>
  );
}

export function IconHeart({ className = "", ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.87,27.17a8,8,0,0,0,14.26,0C142.22,58.36,158.55,48,178,48A46.06,46.06,0,0,1,224,94C224,147.69,146.26,196.16,128,206.8Z" />
    </svg>
  );
}

export function IconTarget({ className = "", ...props }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a40,40,0,1,1-40-40A40,40,0,0,1,168,128Zm-16,0a24,24,0,1,0-24,24A24,24,0,0,0,152,128Z" />
    </svg>
  );
}
