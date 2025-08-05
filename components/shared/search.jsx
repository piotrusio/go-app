'use client';

import { Input, InputGroup } from '@/components/catalyst/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';


export function Search({ placeholder, searchParamName = 'query' }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Updating search param "${searchParamName}" to: ${term}`);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (term) {
      params.set(searchParamName, term);
    } else {
      params.delete(searchParamName);
    }

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
          defaultValue={searchParams.get(searchParamName) || ''}
        />
      </InputGroup>
    </div>
  );
}