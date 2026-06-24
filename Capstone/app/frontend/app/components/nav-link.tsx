"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label, scrolled = false }: { href: string; label: string; scrolled?: boolean }) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      prefetch={true}
      className={`relative inline-flex items-center px-3 py-1.5 text-sm tracking-wide transition-colors duration-150 ${
        isActive
          ? "text-[var(--color-ph-gold)] font-black"
          : scrolled 
            ? "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold"
            : "text-slate-300 hover:text-white font-bold"
      }`}
    >
      {label}
    </Link>
  );
}
