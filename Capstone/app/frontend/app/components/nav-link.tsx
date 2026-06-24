"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      prefetch={true}
      className={`relative inline-flex items-center px-4 py-2 text-sm transition-all duration-150 rounded-full ${
        isActive
          ? "text-[var(--color-ph-gold)] font-black bg-white/15 shadow-sm border border-white/10"
          : "text-slate-300 hover:text-white hover:bg-white/10 font-bold"
      }`}
    >
      {label}
    </Link>
  );
}
