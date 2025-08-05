'use client';

import { Field } from '@/components/catalyst/fieldset';
import { Select } from '@/components/catalyst/select';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export function RegionFilter({ salesAreas, defaultValue = '' }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleRegionChange = (value) => {
    const params = new URLSearchParams(searchParams);
    
    // Reset to page 1 when filter changes
    params.set('page', '1');
    
    if (value) {
      params.set('salesArea', value);
    } else {
      params.delete('salesArea');
    }
    
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Field>
      <Select
        id="customerRegionSelect"
        name="salesArea"
        className="min-w-[200px]"
        defaultValue={defaultValue}
        onChange={(e) => handleRegionChange(e.target.value)}
      >
        <option value="">
          Wszystkie regiony
        </option>
        {salesAreas.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </Select>
    </Field>
  );
}