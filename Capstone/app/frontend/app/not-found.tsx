import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Hindi makita ang pahinang hinahanap mo. Maaaring nailipat na ito o wala na.
          <br />
          <span className="text-xs opacity-60">The page you&apos;re looking for doesn&apos;t exist or has been moved.</span>
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Bumalik sa Home
          </Link>
          <Link href="/report" className="btn btn-secondary">
            Mag-Report
          </Link>
        </div>
      </div>
    </div>
  );
}
