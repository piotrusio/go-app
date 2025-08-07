import { customersRepository } from '@/repositories/customer-repository';
import { CustomersListClient } from '@/components/customers/customers-list-client';
import { CustomersListSkeleton } from '@/components/customers/customers-list-skeleton';
import { CustomersCardNew } from '@/components/customers/customers-card-new';
import { PageList } from '@/components/shared/page-list';
import { PageFilter } from '@/components/shared/page-filter';

export const metadata = {
  title: 'Klienci',
};

export default async function CustomersPage({ searchParams }) {
  let paramsResolved;
  let customersResult = null;
  let salesAreas = [];
  let error = null;
  
  let query = '';
  let sortOrder = 'asc';
  let salesArea = '';
  let cursor = null;

  try {
    paramsResolved = await Promise.resolve(searchParams);
    query = paramsResolved?.query || '';
    cursor = paramsResolved?.cursor ? Number(paramsResolved.cursor) : null;
    sortOrder = paramsResolved?.sortOrder || 'asc';
    salesArea = paramsResolved?.salesArea || '';

    const [customersData, salesAreasData] = await Promise.allSettled([
      customersRepository.getCustomers({
        search: query,
        salesArea: salesArea,
        sortBy: 'customer_code',
        sortOrder: sortOrder,
        cursor: cursor,
        limit: 5
      }),
      customersRepository.getSalesAreas()
    ]);

    if (customersData.status === 'fulfilled') {
      customersResult = customersData.value;
    } else {
      throw customersData.reason;
    }

    if (salesAreasData.status === 'fulfilled') {
      salesAreas = salesAreasData.value;
    } else {
      console.warn('Failed to load sales areas:', salesAreasData.reason);
      salesAreas = [];
    }

  } catch (err) {
    console.error('Error loading customers page:', err);
    error = err;
  }

  // Create filter components with salesAreas data
  const filters = [
    (props) => (
      <PageFilter
        {...props}
        data={salesAreas}
        paramName="salesArea"
        allOptionsLabel="Regiony"
        className="min-w-[200px]"
      />
    )
  ];

  return (
    <PageList
      title="Klienci"
      searchPlaceholder="Wyszukaj klientów..."
      searchParamName="query"
      filters={filters}
      showSort={true}
      createNewComponent={CustomersCardNew}
      listClientComponent={CustomersListClient}
      skeletonComponent={CustomersListSkeleton}
      data={customersResult}
      error={error}
      searchParams={{ query, sortOrder, salesArea, cursor }}
      itemLimit={5}
      basePath="/customers"
    />
  );
}