// components/customers/customer-sort-toggle.jsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/catalyst/button';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

export default function SortToggle({ 
  className,
  ...props 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get current sort order from URL (default to 'asc')
  const currentSortOrder = searchParams.get('sortOrder') || 'asc';
  
  const handleSortToggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Toggle between 'asc' and 'desc'
    const newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    
    // Reset cursor when sort order changes (start from beginning)
    params.delete('cursor');
    
    // Set new sort order
    params.set('sortOrder', newSortOrder);
    
    // Navigate to new URL
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  return (
      <Button
        outline
        onClick={handleSortToggle}
        aria-label={`Sort ${currentSortOrder === 'asc' ? 'descending' : 'ascending'}`}
        title={currentSortOrder === 'asc' ? 'Currently A-Z, click for Z-A' : 'Currently Z-A, click for A-Z'}
      >
        {currentSortOrder === 'asc' ? (
          <ArrowUpIcon />
        ) : (
          <ArrowDownIcon />
        )}
      </Button>
  );
}