import { Heading } from '@/components/catalyst/heading';
import { Search } from '@/components/shared/search';
import SortToggle from '@/components/shared/sort-toggle';

export function PageListHeader({
  title,
  searchPlaceholder,
  searchParamName,
  filters = [],
  showSort = false,
  createNewComponent: CreateNewComponent,
  searchParams
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-sm:w-full sm:flex-1">
        <Heading>{title}</Heading>
        <div className="mt-4 flex max-w-2xl flex-col sm:flex-row sm:flex-wrap gap-4">
          <div className="flex-grow min-w-[200px]">
            <Search
              placeholder={searchPlaceholder}
              searchParamName={searchParamName}
            />
          </div>
          
          {filters.map((FilterComponent, index) => (
            <div key={index} className="flex-shrink-0">
              <FilterComponent searchParams={searchParams} />
            </div>
          ))}
          
          {showSort && (
            <div className="flex-shrink-0">
              <SortToggle />
            </div>
          )}
        </div>
      </div>
      {CreateNewComponent && <CreateNewComponent />}
    </div>
  );
}