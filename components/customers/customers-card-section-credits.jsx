import { Badge } from '@/components/catalyst/badge';
import { Divider } from '@/components/catalyst/divider';
import { Subheading } from '@/components/catalyst/heading';
import { CreditCardIcon } from '@heroicons/react/16/solid';
import { formatDate } from '@/lib/utils/datetime';
import { formatValueWithPrefix } from '@/lib/utils/numbers';
import CustomerCardEdit from '@/components/customers/customers-card-edit';

export function CustomersCardSectionCredits({ credits = [], customerId }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
          <Subheading className="mt-16">Limity Kredytowe Klienta</Subheading>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <CustomerCardEdit />
        </div>
      </div>

      {credits.length === 0 ? (
        <div className="mt-10 rounded border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
          Brak zdefiniowanych limitów kredytowych dla tego klienta.
        </div>
      ) : (
        <ul className="mt-10">
          {credits.map((credit, index) => (
            <li key={index}>
              <Divider soft={index > 0} />
              <div className="flex items-center justify-between py-4 md:py-4">
                <div className="flex flex-1 items-start gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <CreditCardIcon className="size-8 text-zinc-500 dark:text-zinc-400" aria-hidden="true"/>
                </div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {formatValueWithPrefix(credit.credit_value, credit.credit_currency)}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {credit.credit_valid_from && <Badge color="zinc">Obowiązuje od: {formatDate(credit.credit_valid_from)}</Badge>}
                        {credit.credit_valid_to && <Badge color="zinc">Obowiązuje do: {formatDate(credit.credit_valid_to)}</Badge>}
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