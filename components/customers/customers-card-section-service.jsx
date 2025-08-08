"use client";

import { Subheading } from '@/components/catalyst/heading';
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/catalyst/description-list';
import { CardOverlay } from '../shared/card-overlay';
import CustomerCardEdit from '@/components/customers/customers-card-edit';

export function CustomersCardSectionService({ customer }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
          <Subheading className="mt-16">Obsługa Handlowa</Subheading>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <CustomerCardEdit />
          <CardOverlay />
        </div>
      </div>
      <DescriptionList className="mt-6">
        <DescriptionTerm>Region</DescriptionTerm>
        <DescriptionDetails>{customer.customer_sales_area || 'N/D'}</DescriptionDetails>
        <DescriptionTerm>Przedstawiciel</DescriptionTerm>
        <DescriptionDetails>{customer.customer_sales_owner || 'N/D'}</DescriptionDetails>
        <DescriptionTerm>Opiekun BOK</DescriptionTerm>
        <DescriptionDetails>{customer.customer_service_owner || 'N/D'}</DescriptionDetails>
        <DescriptionTerm>Termin Płatności</DescriptionTerm>
        <DescriptionDetails>{customer.customer_payment_terms ? `${customer.customer_payment_terms} dni` : '0 dni'}</DescriptionDetails>
        <DescriptionTerm>Numer NIP</DescriptionTerm>
        <DescriptionDetails>
            {customer.customer_tax_prefix && customer.customer_tax_number ? `${customer.customer_tax_prefix}-${customer.customer_tax_number}` : 'N/D'}
        </DescriptionDetails>
        <DescriptionTerm>Rabat Bazowy</DescriptionTerm>
        <DescriptionDetails>{customer.customer_discount ? `${customer.customer_discount} %` : '0.00 %'}</DescriptionDetails>
        <DescriptionTerm>Cennik Główny</DescriptionTerm>
        <DescriptionDetails>{customer.customer_price_list || 'N/D'}</DescriptionDetails>
      </DescriptionList>
    </>
  )
}