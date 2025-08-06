'use client';

import { Field } from '@/components/catalyst/fieldset';
import { Select } from '@/components/catalyst/select';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export function PageFilter({ 
  searchParams, 
  data = [], 
  paramName,
  placeholder = "Select option",
  allOptionsLabel = "All options",
  className = "min-w-[200px]",
  valueKey = null, // If data is array of objects, specify which property to use as value
  labelKey = null, // If data is array of objects, specify which property to use as label
  resetPage = true // Whether to reset to page 1 when filter changes
}) {
  const urlSearchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const currentValue = searchParams?.[paramName] || '';

  const handleChange = (value) => {
    const params = new URLSearchParams(urlSearchParams);
    
    // Reset to page 1 when filter changes
    if (resetPage) {
      params.set('page', '1');
    }
    
    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getOptionValue = (item) => {
    if (valueKey && typeof item === 'object') {
      return item[valueKey];
    }
    return item;
  };

  const getOptionLabel = (item) => {
    if (labelKey && typeof item === 'object') {
      return item[labelKey];
    }
    return item;
  };

  return (
    <Field>
      <Select
        id={`${paramName}Select`}
        name={paramName}
        className={className}
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">
          {allOptionsLabel}
        </option>
        {data.map((item, index) => {
          const value = getOptionValue(item);
          const label = getOptionLabel(item);
          // Use value as key if it's unique, otherwise fall back to index
          const key = typeof item === 'object' && item.id ? item.id : value || index;
          
          return (
            <option key={key} value={value}>
              {label}
            </option>
          );
        })}
      </Select>
    </Field>
  );
}