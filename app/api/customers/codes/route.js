import { customersRepository } from '@/repositories/customer-repository'

export async function GET() {
  try {
    const customerCodes = await customersRepository.getCustomersCodes()
    return Response.json(customerCodes)
  } catch (error) {
    console.error('Failed to fetch customer codes:', error)
    return Response.json(
      { error: 'Failed to fetch customer codes' },
      { status: 500 }
    )
  }
}