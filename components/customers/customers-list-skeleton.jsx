import { Divider } from '@/components/catalyst/divider';

export function CustomersListSkeleton({ itemCount = 5 }) {
  return (
    <ul className="space-y-0">
      {[...Array(itemCount)].map((_, i) => (
        <li key={i} className="animate-pulse">
          <Divider soft={i > 0} />
          <div className="flex items-center justify-between py-4 md:py-6">
            <div className="flex flex-1 items-start gap-4 md:gap-6">
              {/* Avatar skeleton */}
              <div className="w-24 md:w-32 flex-shrink-0">
                <div className="size-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              </div>
              
              {/* Customer info skeleton */}
              <div className="space-y-1 flex-1">
                {/* Customer code skeleton */}
                <div className="space-y-2">
                  <div className="h-5 w-32 md:w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
                </div>
                
                {/* Company name skeleton */}
                <div className="h-4 w-48 md:w-64 rounded bg-zinc-200 dark:bg-zinc-700" />
                
                {/* Address skeleton */}
                <div className="h-4 w-56 md:w-72 rounded bg-zinc-200 dark:bg-zinc-700" />
                
                {/* Badges skeleton */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <div className="h-6 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-6 w-36 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-6 w-28 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Load More skeleton for when loading additional items
export function CustomersLoadMoreSkeleton({ itemCount = 3 }) {
  return (
    <div className="mt-4">
      <CustomersListSkeleton itemCount={itemCount} />
    </div>
  );
}