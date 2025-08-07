import { Badge } from '@/components/catalyst/badge';
import { Divider } from '@/components/catalyst/divider';
import { Subheading } from '@/components/catalyst/heading';
import { MapPinIcon } from '@heroicons/react/16/solid';
import CustomerCardEdit from '@/components/customers/customers-card-edit';

export function CustomersCardSectionAddress({ addresses = [], customerId }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
          <Subheading className="mt-16">Adresy Klienta</Subheading>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <CustomerCardEdit />
        </div>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-10 rounded border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
          Brak zdefiniowanych adresów dla tego klienta.
        </div>
      ) : (
        <ul className="mt-10">
          {addresses.map((address, index) => (
            <li key={index}>
              <Divider soft={index > 0} />
              <div className="flex items-center justify-between py-4 md:py-4">
                <div className="flex flex-1 items-start gap-4">
                  <div className="flex-shrink-0">
                      <MapPinIcon className="size-12 text-zinc-500 dark:text-zinc-400" aria-hidden="true"/>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {address.address_street}, {address.address_zip} {address.address_city}, {address.address_country}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {address.address_type && <Badge color="zinc">{address.address_type}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}