import { Suspense } from 'react';
import { Heading } from '@/components/heading';
import { Search } from '@/components/search';
import { Field } from '@/components/fieldset';
import { Select } from '@/components/select';

export const metadata = {
  title: 'Tkaniny',
};

export default async function FabricsPage({
  searchParams
}) {
  const paramsResolved = await Promise.resolve(searchParams);
  const query = paramsResolved?.query || '';
  const currentPage = Number(paramsResolved?.page) || 1;
  const sortOrder = paramsResolved?.sortOrder || 'asc';
  const totalPages = 10; // Placeholder for total pages, replace with actual logic
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Tkaniny</Heading>
          <div className="mt-4 flex max-w-2xl flex-col sm:flex-row sm:flex-wrap gap-4">
            <div className="flex-grow min-w-[200px]">
              <Search
                placeholder="Wyszukaj..."
                searchParamName="query"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        {/* Placeholder for List/Table Component */}
      </div>
      <div className="mt-5 flex w-full justify-center">
        {/* footer for pagination*/}
      </div>
    </>
  );
}