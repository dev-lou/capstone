"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 mb-4">
          <svg width="32" height="32" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Zm-20.17,14.43A8.17,8.17,0,0,1,215.45,208H40.55a8.17,8.17,0,0,1-7.18-5.48,7.66,7.66,0,0,1,0-7.72l87.45-151.87a8.33,8.33,0,0,1,14.36,0l87.45,151.87A7.66,7.66,0,0,1,216.63,202.52Z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          May Error na Naganap
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          Something went wrong while loading this page.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 font-mono">
          {error.message || "Unknown error"}
        </p>
        <button onClick={reset} className="btn btn-primary">
          Subukan Muli
        </button>
      </div>
    </div>
  );
}
