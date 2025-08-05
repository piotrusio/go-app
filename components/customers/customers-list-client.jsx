'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import clsx from 'clsx';
import { Avatar } from '@/components/catalyst/avatar';
import { Divider } from '@/components/catalyst/divider';
import { Link } from '@/components/catalyst/link';
import { Badge } from '@/components/catalyst/badge';
import { LoadMorePagination } from '@/components/shared/cursor-pagination';
import { getInitials, generateAvatarColorClasses } from '@/lib/utils/avatars';
import { truncateText } from '@/lib/utils/text';
import { getMoreCustomers } from '@/actions/customer-actions';
import { CustomersLoadMoreSkeleton } from '@/components/customers/customers-list-skeleton';

export function CustomersListClient({ 
  initialCustomers, 
  initialNextCursor, 
  initialHasMore,
  searchParams 
}) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCustomers(initialCustomers);
    setNextCursor(initialNextCursor);
    setHasMore(initialHasMore);
  }, [
    searchParams.query,     // Reset when search changes
    searchParams.salesArea, // Reset when filter changes
    searchParams.sortOrder, // Reset when sort changes
    initialCustomers,       // Reset when server data changes
    initialNextCursor,
    initialHasMore
  ]);
  
  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const result = await getMoreCustomers({
        cursor: nextCursor,
        search: searchParams.query || '',
        salesArea: searchParams.salesArea || '',
        sortBy: 'customer_name',
        sortOrder: searchParams.sortOrder || 'asc',
        limit: 5 // Keep same limit as initial load
      });
      
      // Accumulate the new customers with existing ones
      setCustomers(prev => [...prev, ...result.data]);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load more customers:', error);
      // You could add error state here if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ul className="space-y-0">
        {customers.map((customer, index) => {
          const initials = getInitials(customer.customer_code);
          const avatarColorClasses = generateAvatarColorClasses(customer.customer_code);

          return (
            <React.Fragment key={customer.customer_id}>
              <li>
                <Divider soft={index > 0} />
                <div className="flex items-center justify-between py-4 md:py-6">
                  <div className="flex flex-1 items-start gap-4 md:gap-6">
                    <div className="w-24 md:w-32 flex-shrink-0">
                      <Link href={`/customers/${customer.customer_id}`}>
                        <Avatar
                          className={clsx("size-24 flex-shrink-0", avatarColorClasses)}
                          initials={initials}
                          alt={`${customer.customer_code} initials avatar`}
                        />
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <div className="text-base md:text-lg font-semibold">
                        <Link href={`/customers/${customer.customer_id}`}>
                          {customer.customer_code}
                        </Link>
                      </div>
                      <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {truncateText(customer.company_name || customer.customer_name, 40)}
                      </div>
                      {(customer.address_street && customer.address_city) && (
                        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          {customer.address_street}, {customer.address_zip} {customer.address_city}, {customer.address_country}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {customer.customer_sales_area && (
                          <Badge color="zinc">Region: {customer.customer_sales_area}</Badge>
                        )}
                        {customer.customer_sales_owner && customer.customer_sales_owner !== 'N/D' && (
                          <Badge color="zinc">Przedstawiciel: {customer.customer_sales_owner}</Badge>
                        )}
                        {customer.customer_service_owner && customer.customer_service_owner !== 'N/D' && (
                          <Badge color="zinc">Opiekun BOK: {customer.customer_service_owner}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </React.Fragment>
          );
        })}
      </ul>

      {loading && <CustomersLoadMoreSkeleton itemCount={5} />}

      {hasMore && (
        <div className="mt-10">
          <LoadMorePagination
            hasMore={hasMore}
            loading={loading}
            onLoadMore={handleLoadMore}
            currentCount={customers.length}
            totalLoaded={customers.length}
            showInfo={false}
          />
        </div>
      )}
    </>
  );
}