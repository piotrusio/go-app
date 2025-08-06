import { Suspense } from 'react';
import { PageListError } from './page-list-error';
import { PageListEmpty } from './page-list-empty';
import { PageListHeader } from './page-list-header';

export function PageList({
  title,
  searchPlaceholder = "Wyszukaj...",
  searchParamName = "query",
  filters = [],
  showSort = false,
  createNewComponent: CreateNewComponent,
  listClientComponent: ListClientComponent,
  skeletonComponent: SkeletonComponent,
  data,
  error,
  searchParams,
  itemLimit = 5,
  basePath,
  className,
  dataPropsMapping = {
    data: 'initialData',
    nextCursor: 'initialNextCursor', 
    hasMore: 'initialHasMore'
  }
}) {
  const { query = '', sortOrder = 'asc', cursor = null, ...filterParams } = searchParams || {};

  const clientProps = {
    [dataPropsMapping.data]: data?.data || [],
    [dataPropsMapping.nextCursor]: data?.nextCursor,
    [dataPropsMapping.hasMore]: data?.hasMore,
    searchParams
  };

  return (
    <>
      <PageListHeader
        title={title}
        searchPlaceholder={searchPlaceholder}
        searchParamName={searchParamName}
        filters={filters}
        showSort={showSort}
        createNewComponent={CreateNewComponent}
        searchParams={searchParams}
      />

      <div className="mt-10">
        <Suspense
          key={`${query}-${Object.values(filterParams).join('-')}-${sortOrder}-${cursor || 'initial'}`}
          fallback={<SkeletonComponent itemCount={itemLimit} />}
        >
          {error ? (
            <PageListError
              error={error}
              searchParams={searchParams}
              basePath={basePath}
            />
          ) : data?.data?.length === 0 ? (
            <PageListEmpty
              searchParams={searchParams}
              basePath={basePath}
            />
          ) : (
            <ListClientComponent {...clientProps} />
          )}
        </Suspense>
      </div>
    </>
  );
}