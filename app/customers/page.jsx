import { Suspense } from 'react';
import clsx from 'clsx';
import React from 'react';
import { Heading } from '@/components/catalyst/heading';
import { Divider } from '@/components/catalyst/divider';
import { Button } from '@/components/catalyst/button';
import { Search } from '@/components/shared/search';
import { customersRepository } from '@/repositories/customer-repository';
import { RegionFilter } from '@/components/customers/customers-region-filter';
import { CustomersListClient } from '@/components/customers/customers-list-client';
import { CustomersListSkeleton } from '@/components/customers/customers-list-skeleton';
import SortToggle from '@/components/shared/sort-toggle';
import CreateNewCustomer from '@/components/customers/customers-new-dialog';

export const metadata = {
  title: 'Klienci',
};

// Error message helper
function getErrorMessage(error) {
  const errorMessage = error?.message?.toLowerCase() || '';
  
  if (errorMessage.includes('database') || errorMessage.includes('connection') || errorMessage.includes('timeout')) {
    return {
      title: 'Problem z bazą danych',
      message: 'Sprawdź połączenie z internetem lub spróbuj ponownie za chwilę.',
      actionText: 'Spróbuj ponownie'
    };
  }
  
  if (errorMessage.includes('failed to fetch')) {
    return {
      title: 'Problem z połączeniem',
      message: 'Nie udało się nawiązać połączenia z serwerem.',
      actionText: 'Odśwież stronę'
    };
  }
  
  return {
    title: 'Wystąpił nieoczekiwany błąd',
    message: 'Odśwież stronę lub skontaktuj się z administratorem.',
    actionText: 'Spróbuj ponownie'
  };
}

// Error state component
function CustomerError({ error, query, salesArea }) {
  const errorInfo = getErrorMessage(error);
  
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="size-12 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <svg className="size-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {errorInfo.title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            {errorInfo.message}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            href={`/customers${query || salesArea ? `?${new URLSearchParams({ 
              ...(query && { query }), 
              ...(salesArea && { salesArea }) 
            })}` : ''}`}
          >
            {errorInfo.actionText}
          </Button>
          <Button plain href="/customers">
            Wyczyść filtry
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">
              Szczegóły błędu (dev)
            </summary>
            <div className="mt-2 text-xs text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 p-3 rounded border overflow-auto">
              {error.message}
              {error.stack && (
                <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// Empty state component
function CustomersEmpty({ query, salesArea }) {
  const hasFilters = query || salesArea;
  
  return (
    <div className="text-center py-12 space-y-4">
      <div className="size-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        <svg className="size-6 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          {hasFilters ? 'Brak wyników' : 'Brak klientów'}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          {hasFilters 
            ? 'Nie znaleziono klientów spełniających podane kryteria wyszukiwania.'
            : 'Nie ma jeszcze żadnych klientów w systemie.'
          }
        </p>
      </div>
      
      {hasFilters && (
        <Button plain href="/customers">
          Wyczyść filtry
        </Button>
      )}
    </div>
  );
}

// Loading skeleton component
function CustomersLoading() {
  return (
    <ul className="mt-10">
      {[...Array(5)].map((_, i) => (
        <li key={i} className="animate-pulse">
          <Divider soft={i > 0} />
          <div className="flex items-center justify-between py-4 md:py-6">
            <div className="flex flex-1 items-start gap-4 md:gap-6">
              <div className="w-24 md:w-32 flex-shrink-0">
                <div className="size-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-4 w-64 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex gap-2 pt-1">
                  <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
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

export default async function CustomersPage({ searchParams }) {
  let paramsResolved;
  let customersResult = null;
  let salesAreas = [];
  let error = null;
  
  // Define these outside try block so they're available in error handling
  let query = '';
  let sortOrder = 'asc';
  let salesArea = '';
  let cursor = null;

  try {
    // Resolve search params
    paramsResolved = await Promise.resolve(searchParams);
    query = paramsResolved?.query || '';
    cursor = paramsResolved?.cursor ? Number(paramsResolved.cursor) : null;
    sortOrder = paramsResolved?.sortOrder || 'asc';
    salesArea = paramsResolved?.salesArea || '';

    // Fetch data with graceful error handling
    const [customersData, salesAreasData] = await Promise.allSettled([
      customersRepository.getCustomers({
        search: query,
        salesArea: salesArea,
        sortBy: 'customer_name',
        sortOrder: sortOrder,
        cursor: cursor,
        limit: 5
      }),
      customersRepository.getSalesAreas()
    ]);

    // Handle customers data
    if (customersData.status === 'fulfilled') {
      customersResult = customersData.value;
    } else {
      throw customersData.reason;
    }

    // Handle sales areas data (non-critical)
    if (salesAreasData.status === 'fulfilled') {
      salesAreas = salesAreasData.value;
    } else {
      console.warn('Failed to load sales areas:', salesAreasData.reason);
      salesAreas = []; // Graceful degradation
    }

  } catch (err) {
    console.error('Error loading customers page:', err);
    error = err;
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Klienci</Heading>
          <div className="mt-4 flex max-w-2xl flex-col sm:flex-row sm:flex-wrap gap-4">
            <div className="flex-grow min-w-[200px]">
              <Search
                placeholder="Wyszukaj klientów..."
                searchParamName="query"
              />
            </div>
            <div className="flex-shrink-0">
              <RegionFilter 
                salesAreas={salesAreas}
                defaultValue={salesArea}
              />
            </div>
            <div className="flex-shrink-0">
              <SortToggle />
            </div>
          </div>
        </div>
        <CreateNewCustomer />
      </div>

      <div className="mt-10">
        <Suspense
          key={`${query}-${salesArea}-${sortOrder}-${cursor || 'initial'}`}
          fallback={<CustomersListSkeleton itemCount={5} />}  // Match your limit
        >
          {error ? (
            <CustomerError error={error} query={query} salesArea={salesArea} />
          ) : customersResult.data.length === 0 ? (
            <CustomersEmpty query={query} salesArea={salesArea} />
          ) : (
            <CustomersListClient
              initialData={customersResult.data}
              initialNextCursor={customersResult.nextCursor}
              initialHasMore={customersResult.hasMore}
              searchParams={{ query, salesArea, sortOrder }}
            />
          )}
        </Suspense>
      </div>
    </>
  );
}