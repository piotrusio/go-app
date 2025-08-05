'use client';

import { Input, InputGroup } from '@/components/catalyst/input'; // Assuming these exist
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

// Updated component signature to accept searchParamName prop with a default value
export function Search({ placeholder, searchParamName = 'query' }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Debounced callback for handling search input changes
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Updating search param "${searchParamName}" to: ${term}`);

    const params = new URLSearchParams(searchParams);

    // Reset page to 1 whenever the search term changes for this parameter
    params.set('page', '1');

    // Use the searchParamName prop to set/delete the correct parameter
    if (term) {
      params.set(searchParamName, term);
    } else {
      params.delete(searchParamName);
    }
    // Update the URL with the new parameters
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300); // 300ms debounce delay

  return (
    <div className="flex-1">
      <InputGroup>
        <Input
          name="search"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          // Set the defaultValue from the correct search parameter
          defaultValue={searchParams.get(searchParamName) || ''}
        />
      </InputGroup>
    </div>
  );
}