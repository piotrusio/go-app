export function TableSkeleton() {
  return (
    <div className="mt-10 w-full animate-pulse overflow-x-auto">
      {/* Table structure for consistent layout */}
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800 md:pt-0">
          {/* Desktop Header Skeleton */}
          <div className="hidden h-12 md:flex md:items-center md:border-b md:border-zinc-950/10 dark:md:border-white/10">
            <div className="w-[40%] px-3 py-3 text-left text-sm font-medium">
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
            <div className="w-[15%] px-3 py-3 text-left text-sm font-medium">
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
            <div className="w-[20%] px-3 py-3 text-left text-sm font-medium">
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
            <div className="w-[25%] px-3 py-3 text-left text-sm font-medium">
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
          </div>

          {/* Table Body Skeleton Rows */}
          <div className="divide-y divide-zinc-200 text-zinc-900 dark:divide-zinc-800 dark:text-zinc-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="group flex flex-col gap-3 px-4 py-5 md:flex-row md:items-center md:gap-0">
                {/* Customer Cell Skeleton */}
                <div className="flex w-full items-center gap-3 md:w-[40%] md:border-r md:border-zinc-200 md:pr-3 dark:md:border-zinc-800">
                  <div className="size-16 flex-shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                  </div>
                </div>
                {/* Other Cells Skeleton */}
                <div className="mt-2 w-full md:mt-0 md:w-[15%] md:border-r md:border-zinc-200 md:px-3 dark:md:border-zinc-800">
                  <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                </div>
                <div className="mt-2 w-full md:mt-0 md:w-[20%] md:border-r md:border-zinc-200 md:px-3 dark:md:border-zinc-800">
                  <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                </div>
                <div className="mt-2 w-full md:mt-0 md:w-[25%] md:pl-3">
                  <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}