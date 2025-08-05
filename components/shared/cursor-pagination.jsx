'use client';

import clsx from 'clsx';
import { Button } from '@/components/catalyst/button';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export function CursorPagination({ 'aria-label': ariaLabel = 'Page navigation', className, ...props }) {
  return <nav aria-label={ariaLabel} {...props} className={clsx(className, 'flex gap-x-2')} />;
}

export function CursorPrevious({ 
  previousCursor = null, 
  disabled = false,
  className, 
  children = 'Previous',
  onClick,
  ...props 
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createPreviousURL = () => {
    const params = new URLSearchParams(searchParams);
    if (previousCursor) {
      params.set('cursor', previousCursor.toString());
    } else {
      params.delete('cursor');
    }
    return `${pathname}?${params.toString()}`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(previousCursor);
    } else {
      router.push(createPreviousURL());
    }
  };

  return (
    <span className={clsx(className, 'grow basis-0')}>
      <Button 
        onClick={handleClick}
        disabled={disabled}
        plain 
        aria-label="Previous page"
        {...props}
      >
        <svg className="stroke-current" data-slot="icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2.75 8H13.25M2.75 8L5.25 5.5M2.75 8L5.25 10.5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {children}
      </Button>
    </span>
  );
}

export function CursorNext({ 
  nextCursor = null, 
  hasMore = false,
  disabled = false,
  className, 
  children = 'Next',
  onClick,
  ...props 
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createNextURL = () => {
    const params = new URLSearchParams(searchParams);
    if (nextCursor) {
      params.set('cursor', nextCursor.toString());
    } else {
      params.delete('cursor');
    }
    return `${pathname}?${params.toString()}`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(nextCursor);
    } else {
      router.push(createNextURL());
    }
  };

  const isDisabled = disabled || !hasMore || !nextCursor;

  return (
    <span className={clsx(className, 'flex grow basis-0 justify-end')}>
      <Button 
        onClick={handleClick}
        disabled={isDisabled}
        plain 
        aria-label="Next page"
        {...props}
      >
        {children}
        <svg className="stroke-current" data-slot="icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M13.25 8L2.75 8M13.25 8L10.75 10.5M13.25 8L10.75 5.5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </span>
  );
}

export function CursorInfo({ 
  currentCount = 0, 
  totalLoaded = 0,
  hasMore = false,
  className,
  ...props 
}) {
  return (
    <span 
      className={clsx(
        className, 
        'flex items-center justify-center px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300'
      )}
      {...props}
    >
      {hasMore 
        ? `Załadowano ${currentCount} z ${totalLoaded}`  // Polish: "Showing X of Y customers"
        : `Total ${totalLoaded}`
      }
    </span>
  );
}

export function LoadMoreButton({ 
  hasMore = false,
  loading = false,
  disabled = false,
  onClick,
  className,
  children = 'Wyświetl kolejne',  // Changed to Polish
  ...props 
}) {
  const isDisabled = disabled || !hasMore || loading;

  return (
    <div className={clsx(className, 'flex justify-center')}>
      <Button
        onClick={onClick}
        disabled={isDisabled}
        className="min-w-32"
        {...props}
      >
        {loading ? 'Ładowanie...' : children}  {/* Changed to Polish */}
      </Button>
    </div>
  );
}

export function LoadMorePagination({
  hasMore = false,
  loading = false,
  onLoadMore,
  currentCount = 0,
  totalLoaded = 0,
  showInfo = false,  // Changed default to false - hide info by default
  className,
  ...props
}) {
  return (
    <div className={clsx(className, 'space-y-4')} {...props}>
      {showInfo && (
        <CursorInfo 
          currentCount={currentCount}
          totalLoaded={totalLoaded}
          hasMore={hasMore}
          className="text-center"
        />
      )}
      <LoadMoreButton
        hasMore={hasMore}
        loading={loading}
        onClick={onLoadMore}
      />
    </div>
  );
}

export function FullCursorPagination({
  previousCursor = null,
  nextCursor = null,
  hasMore = false,
  hasPrevious = false,
  currentCount = 0,
  totalLoaded = 0,
  onPrevious,
  onNext,
  showInfo = true,
  className,
  ...props
}) {
  return (
    <div className={clsx(className, 'space-y-4')} {...props}>
      {showInfo && (
        <CursorInfo 
          currentCount={currentCount}
          totalLoaded={totalLoaded}
          hasMore={hasMore}
          className="text-center"
        />
      )}
      <CursorPagination>
        <CursorPrevious
          previousCursor={previousCursor}
          disabled={!hasPrevious}
          onClick={onPrevious}
        />
        <CursorNext
          nextCursor={nextCursor}
          hasMore={hasMore}
          onClick={onNext}
        />
      </CursorPagination>
    </div>
  );
}