export function ListSkeleton() {
  return (
    <ul className="mt-10 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <li key={i}>
          {/* Divider skeleton */}
          {i > 0 && (
            <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2" />
          )}
          <div className="flex items-center justify-between py-4 md:py-6">
            <div className="flex flex-1 items-start gap-4 md:gap-6">
              {/* Avatar skeleton */}
              <div className="w-24 md:w-32 flex-shrink-0 flex items-center justify-center">
                <div className="size-24 md:size-32 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              </div>
              {/* Customer info skeleton */}
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 md:w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-4 w-40 md:w-64 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-4 w-32 md:w-56 rounded bg-zinc-200 dark:bg-zinc-700" />
                {/* Badges row skeleton */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <div className="h-6 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-6 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}