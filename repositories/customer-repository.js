// repositories/customers-repository.js
import { sql } from '@/lib/database/db';

export class CustomersRepository {
  constructor() {
    this.defaultLimit = 20;
  }

  /**
   * Get customers with cursor-based pagination
   * @param {Object} params - Query parameters
   * @param {number} [params.cursor] - Cursor for pagination (customer id)
   * @param {number} [params.limit] - Number of items per page
   * @param {string} [params.search] - Search query across multiple fields
   * @param {string} [params.salesArea] - Filter by sales area
   * @param {string} [params.sortBy] - Sort field: 'customer_name' or 'id'
   * @param {string} [params.sortOrder] - Sort direction: 'asc' or 'desc'
   * @returns {Promise<Object>} Paginated response with customers
   */
  async getCustomers(params = {}) {
    const { 
      cursor, 
      limit = this.defaultLimit, 
      search, 
      salesArea,
      sortBy = 'customer_name',
      sortOrder = 'asc'
    } = params;
    
    try {
      // Use separate static queries to avoid parameter type detection issues
      let result;
      
      if (search && salesArea) {
        // Both search and sales area filter
        result = await sql`
          SELECT 
            c.id as customer_id,
            c.customer_code,
            c.customer_name as company_name,
            c.customer_sales_area,
            c.customer_sales_owner,
            c.customer_service_owner,
            c.customer_price_list,
            c.customer_discount,
            c.customer_status,
            c.customer_tax_prefix,
            c.customer_tax_number,
            a.address_street,
            a.address_country,
            a.address_zip,
            a.address_city,
            a.address_district,
            a.address_phone1,
            a.address_phone2,
            a.address_fax,
            a.address_gsm,
            a.address_email
          FROM customers c
          LEFT JOIN customer_addresses a ON c.id = a.customer_id AND a.address_type = 'AKTUALNY'
          WHERE c.customer_sales_area = ${salesArea}
          AND (
            c.customer_code ILIKE ${'%' + search + '%'} OR
            c.customer_name ILIKE ${'%' + search + '%'} OR
            c.customer_sales_owner ILIKE ${'%' + search + '%'} OR
            c.customer_service_owner ILIKE ${'%' + search + '%'}
          )
          ${cursor ? sql`AND c.id > ${cursor}` : sql``}
          ORDER BY c.customer_name ${sortOrder === 'desc' ? sql`DESC` : sql`ASC`}, c.id ASC
          LIMIT ${limit + 1}
        `;
      } else if (search) {
        // Only search
        result = await sql`
          SELECT 
            c.id as customer_id,
            c.customer_code,
            c.customer_name as company_name,
            c.customer_sales_area,
            c.customer_sales_owner,
            c.customer_service_owner,
            c.customer_price_list,
            c.customer_discount,
            c.customer_status,
            c.customer_tax_prefix,
            c.customer_tax_number,
            a.address_street,
            a.address_country,
            a.address_zip,
            a.address_city,
            a.address_district,
            a.address_phone1,
            a.address_phone2,
            a.address_fax,
            a.address_gsm,
            a.address_email
          FROM customers c
          LEFT JOIN customer_addresses a ON c.id = a.customer_id AND a.address_type = 'AKTUALNY'
          WHERE (
            c.customer_code ILIKE ${'%' + search + '%'} OR
            c.customer_name ILIKE ${'%' + search + '%'} OR
            c.customer_sales_owner ILIKE ${'%' + search + '%'} OR
            c.customer_service_owner ILIKE ${'%' + search + '%'}
          )
          ${cursor ? sql`AND c.id > ${cursor}` : sql``}
          ORDER BY c.customer_name ${sortOrder === 'desc' ? sql`DESC` : sql`ASC`}, c.id ASC
          LIMIT ${limit + 1}
        `;
      } else if (salesArea) {
        // Only sales area filter
        result = await sql`
          SELECT 
            c.id as customer_id,
            c.customer_code,
            c.customer_name as company_name,
            c.customer_sales_area,
            c.customer_sales_owner,
            c.customer_service_owner,
            c.customer_price_list,
            c.customer_discount,
            c.customer_status,
            c.customer_tax_prefix,
            c.customer_tax_number,
            a.address_street,
            a.address_country,
            a.address_zip,
            a.address_city,
            a.address_district,
            a.address_phone1,
            a.address_phone2,
            a.address_fax,
            a.address_gsm,
            a.address_email
          FROM customers c
          LEFT JOIN customer_addresses a ON c.id = a.customer_id AND a.address_type = 'AKTUALNY'
          WHERE c.customer_sales_area = ${salesArea}
          ${cursor ? sql`AND c.id > ${cursor}` : sql``}
          ORDER BY c.customer_name ${sortOrder === 'desc' ? sql`DESC` : sql`ASC`}, c.id ASC
          LIMIT ${limit + 1}
        `;
      } else {
        // No filters
        result = await sql`
          SELECT 
            c.id as customer_id,
            c.customer_code,
            c.customer_name as company_name,
            c.customer_sales_area,
            c.customer_sales_owner,
            c.customer_service_owner,
            c.customer_price_list,
            c.customer_discount,
            c.customer_status,
            c.customer_tax_prefix,
            c.customer_tax_number,
            a.address_street,
            a.address_country,
            a.address_zip,
            a.address_city,
            a.address_district,
            a.address_phone1,
            a.address_phone2,
            a.address_fax,
            a.address_gsm,
            a.address_email
          FROM customers c
          LEFT JOIN customer_addresses a ON c.id = a.customer_id AND a.address_type = 'AKTUALNY'
          ${cursor ? sql`WHERE c.id > ${cursor}` : sql``}
          ORDER BY c.customer_name ${sortOrder === 'desc' ? sql`DESC` : sql`ASC`}, c.id ASC
          LIMIT ${limit + 1}
        `;
      }
      
      const customers = Array.from(result);
      
      // Check if there are more records
      const hasMore = customers.length > limit;
      if (hasMore) {
        customers.pop(); // Remove the extra record
      }
      
      // Get next cursor
      const nextCursor = customers.length > 0 
        ? customers[customers.length - 1].customer_id 
        : null;
      
      return {
        data: customers,
        nextCursor: hasMore ? nextCursor : null,
        hasMore
      };
      
    } catch (error) {
      console.error('Database Error fetching customers:', error);
      throw new Error(`Failed to fetch customers: ${error.message}`);
    }
  }

  /**
   * Get distinct sales areas for filtering
   * @returns {Promise<Array<string>>} Array of sales areas
   */
  async getSalesAreas() {
    try {
      const result = await sql`
        SELECT DISTINCT customer_sales_area
        FROM customers
        WHERE customer_sales_area IS NOT NULL 
        AND customer_sales_area <> ''
        ORDER BY customer_sales_area ASC
      `;
      
      return result.map(row => row.customer_sales_area);
    } catch (error) {
      console.error('Database Error fetching sales areas:', error);
      return [];
    }
  }

  /**
   * Get customer by ID
   * @param {number} id - Customer ID
   * @returns {Promise<Object|null>} Customer object or null
   */
  async getCustomerById(id) {
    try {
      const result = await sql`
        SELECT 
          c.id as customer_id,
          c.customer_code,
          c.customer_name as company_name,
          c.customer_sales_area,
          c.customer_sales_owner,
          c.customer_service_owner,
          c.customer_price_list,
          c.customer_discount,
          c.customer_status,
          c.customer_tax_prefix,
          c.customer_tax_number,
          a.address_street,
          a.address_country,
          a.address_zip,
          a.address_city,
          a.address_district,
          a.address_phone1,
          a.address_phone2,
          a.address_fax,
          a.address_gsm,
          a.address_email
        FROM customers c
        LEFT JOIN customer_addresses a ON c.id = a.customer_id AND a.address_type = 'AKTUALNY'
        WHERE c.id = ${id}
        LIMIT 1
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('Database Error fetching customer by ID:', error);
      throw new Error(`Failed to fetch customer: ${error.message}`);
    }
  }
}

// Export singleton instance
export const customersRepository = new CustomersRepository();