'use server';

import { customersRepository } from '@/repositories/customer-repository';

export async function getMoreCustomers(params) {
  try {
    return await customersRepository.getCustomers(params);
  } catch (error) {
    console.error('Server action error:', error);
    throw new Error(`Failed to load more customers: ${error.message}`);
  }
}