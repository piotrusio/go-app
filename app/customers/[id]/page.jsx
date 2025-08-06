import clsx from 'clsx';

import { Avatar } from '@/components/catalyst/avatar';
import { Divider } from '@/components/catalyst/divider';
import { Link } from '@/components/catalyst/link';
import { Heading } from '@/components/catalyst/heading';
import { ChevronLeftIcon, PhoneIcon, EnvelopeIcon} from '@heroicons/react/16/solid';
import { getInitials, generateAvatarColorClasses } from '@/lib/utils/avatars';
import { customersRepository } from '@/repositories/customer-repository';
import { truncateText } from '@/lib/utils/text';
import CustomerCardEdit from '@/components/customers/customers-card-edit';

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
            {(customer.address_street && customer.address_city) && (
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {customer.address_street}, {customer.address_zip} {customer.address_city}, {customer.address_country}
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {customer.phone1 && <Badge color="lime"> <PhoneIcon className="size-4" /> {customer.phone1}</Badge>}
              {customer.phone2 && <Badge color="lime"> <PhoneIcon className="size-4" /> {customer.phone2}</Badge>}
              {customer.email && <Badge color="lime"> <EnvelopeIcon className="size-4" /> {customer.email}</Badge>}
            </div>
          </div>
        </div>
        <CustomerCardEdit />
      </div>
      <Divider className="mt-6" />
    </>
  )
}