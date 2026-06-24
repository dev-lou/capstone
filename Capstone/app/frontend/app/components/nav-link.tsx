"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      prefetch={true}
      className={`relative inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
        isActive
          ? "text-[var(--color-ph-navy)] dark:text-[var(--color-primary)] bg-[var(--color-primary-muted)] dark:bg-[var(--color-primary-muted)]/20"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-ph-navy)] dark:hover:text-[var(--color-primary-hover)] hover:bg-[var(--color-primary-muted)] dark:hover:bg-[var(--color-primary-muted)]/20"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[var(--color-accent)] rounded-full" />
      )}
    </Link>
  );
}
