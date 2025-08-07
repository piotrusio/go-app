import { Badge } from '@/components/catalyst/badge';
import { Divider } from '@/components/catalyst/divider';
import { Subheading } from '@/components/catalyst/heading';
import { IdentificationIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/16/solid';
import CustomerCardEdit from '@/components/customers/customers-card-edit';

export function CustomersCardSectionContacts({ contacts = [], customerId }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
          <Subheading className="mt-16">Kontakty Klienta</Subheading>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <CustomerCardEdit />
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="mt-10 rounded border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
          Brak zdefiniowanych kontaktów dla tego klienta.
        </div>
      ) : (
        <ul className="mt-10">
          {contacts.map((contact, index) => (
            <li key={index}>
              <Divider soft={index > 0} />
              <div className="flex items-center justify-between py-4 md:py-4">
                <div className="flex flex-1 items-start gap-4">
                <div className="flex-shrink-0">
                  <IdentificationIcon className="size-12 text-zinc-500 dark:text-zinc-400" aria-hidden="true"/>
                </div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {contact.contact_name}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {contact.contact_position && <Badge color="zinc">{contact.contact_position}</Badge>}
                      {contact.contact_email && <Badge color="zinc"><EnvelopeIcon className="size-4" />{contact.contact_email}</Badge>}
                      {contact.contact_phone && <Badge color="zinc"><PhoneIcon className="size-4" />{contact.contact_phone}</Badge>}
                      {contact.contact_mobile && <Badge color="zinc"><PhoneIcon className="size-4" />{contact.contact_mobile}</Badge>}
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