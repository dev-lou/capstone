export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-center mb-8">
        <div className="w-8 h-8 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="space-y-4">
        <div className="skeleton h-8 w-1/3 mx-auto rounded-lg" />
        <div className="skeleton h-4 w-1/2 mx-auto rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="skeleton h-40 rounded-xl" />
          <div className="skeleton h-40 rounded-xl" />
          <div className="skeleton h-40 rounded-xl" />
          <div className="skeleton h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
