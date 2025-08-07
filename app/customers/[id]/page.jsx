import clsx from 'clsx';

import { Avatar } from '@/components/catalyst/avatar';
import { Badge } from '@/components/catalyst/badge';
import { Divider } from '@/components/catalyst/divider';
import { Link } from '@/components/catalyst/link';
import { Heading } from '@/components/catalyst/heading';
import { ChevronLeftIcon, PhoneIcon, EnvelopeIcon} from '@heroicons/react/16/solid';
import { getInitials, generateAvatarColorClasses } from '@/lib/utils/avatars';
import { customersRepository } from '@/repositories/customer-repository';
import { truncateText } from '@/lib/utils/text';
import { CustomersCardSectionService } from '@/components/customers/customers-card-section-service';
import { CustomersCardSectionContacts } from '@/components/customers/customers-card-section-contacts';
import { CustomersCardSectionNotes } from '@/components/customers/customers-card-section-notes';
import { CustomersCardSectionCredits } from '@/components/customers/customers-card-section-credits';
import { CustomersCardSectionTerms } from '@/components/customers/customers-card-section-terms';
import { CustomersCardSectionAddress } from '@/components/customers/customers-card-section-address';
import { OrdersCardNew } from '@/components/orders/orders-card-new';

export default async function CustomerCard({ params, searchParams }) {
  const paramsResolved = await Promise.resolve(params);
  const searchparamsResolved = await Promise.resolve(searchParams);
  const { id: customerId } = paramsResolved;
  const id = parseInt(customerId, 10);

  if (isNaN(id)) {
    notFound();
  }

  const customer = await customersRepository.getCustomerById(id);
  if (!customer) {
    notFound();
  }

  const avatarColorClasses = generateAvatarColorClasses(customer.customer_code);
  const initials = getInitials(customer.customer_code);
  return (
    <>
      {/* Header and Customer Info Section */}
      <div className="max-lg:hidden">
        <Link href="/customers" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Klienci
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <Avatar
            className={clsx("size-32 shrink-0", avatarColorClasses)}
            initials={initials}
            alt={`${customer.customer_code} initials avatar`}
          />
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Heading>{customer.customer_code}</Heading>
            </div>
            <div className="text-sm/6 text-zinc-500 dark:text-zinc-400">
              {truncateText(customer.customer_name, 70)}
            </div>
            {(customer.customer_address_street && customer.customer_address_city) && (
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {customer.customer_address_street}, {customer.customer_address_zip} {customer.customer_address_city}, {customer.customer_address_country}
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {customer.customer_phone_number && <Badge color="lime"> <PhoneIcon className="size-4" /> {customer.customer_phone_number}</Badge>}
              {customer.customer_fax_number && <Badge color="lime"> <PhoneIcon className="size-4" /> {customer.customer_phone_number}</Badge>}
              {customer.customer_email && <Badge color="lime"> <EnvelopeIcon className="size-4" /> {customer.customer_email}</Badge>}
            </div>
          </div>
        </div>
        <OrdersCardNew />
      </div>
      <Divider className="mt-6" />
      
      {/* --- Customer Service Section --- */}
      <CustomersCardSectionService customer = {customer}/>

      {/* --- Customer Notes Section --- */}
      <CustomersCardSectionNotes />

      {/* --- Commercial Terms Section --- */}
      <CustomersCardSectionTerms />

      {/* --- Customer Limits Section --- */}
      <CustomersCardSectionCredits credits={customer.customer_credits} id = {customer.customer_id}/>

      {/* --- Customer Contacts Section --- */}
      <CustomersCardSectionContacts contacts={customer.customer_contacts} id = {customer.customer_id}/>

      {/* --- Addresses Section --- */}
      <CustomersCardSectionAddress addresses={customer.customer_addresses} id = {customer.customer_id}/>

    </>
  )
}