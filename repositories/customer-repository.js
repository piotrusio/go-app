import { sql } from '@/lib/database/db';

/**
 * Builds an ORDER BY SQL clause with validation
 * @param {string} sortBy - The field key to sort by (e.g., 'customer_name')
 * @param {string} sortOrder - Sort direction, must be 'asc' or 'desc'
 * @param {Array<string>} validSortFields - Array of allowed sort field keys
 * @returns {string} ORDER BY clause string or empty string if validation fails
 */
function buildOrderByClause(sortBy, sortOrder, validSortFields) {
  const validSortOrders = ['asc', 'desc'];
  
  if (!validSortFields.includes(sortBy) || !validSortOrders.includes(sortOrder)) {
    return '';
  }
  
  return `ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
}

/**
 * Builds WHERE clause with search and filter conditions
 * @param {Object} conditions - Filter conditions
 * @param {string} conditions.search - Search term
 * @param {string} conditions.salesArea - Sales area filter
 * @returns {string} WHERE clause or empty string
 */
function buildWhereClause({ search, salesArea }) {
  const conditions = [];
  
  if (salesArea) {
    conditions.push('customer_sales_area = $1');
  }
  
  if (search) {
    const searchCondition = `(
      customer_code ILIKE $${salesArea ? 2 : 1} OR
      customer_name ILIKE $${salesArea ? 2 : 1} OR
      customer_sales_owner ILIKE $${salesArea ? 2 : 1} OR
      customer_service_owner ILIKE $${salesArea ? 2 : 1}
    )`;
    conditions.push(searchCondition);
  }
  
  return conditions.length > 0 ? `WHERE status = TRUE AND ${conditions.join(' AND ')}` : 'WHERE status = TRUE';
}

/**
 * Builds cursor WHERE clause for pagination
 * @param {number} cursor - Current cursor position
 * @param {number} paramIndex - Parameter index for cursor value
 * @returns {string} WHERE clause for cursor or empty string
 */
function buildCursorClause(cursor, paramIndex) {
  return cursor ? `WHERE row_id > $${paramIndex}` : '';
}

/**
 * Builds LIMIT clause
 * @param {number} limit - Limit value
 * @param {number} paramIndex - Parameter index for limit value
 * @returns {string} LIMIT clause
 */
function buildLimitClause(limit, paramIndex) {
  return `LIMIT $${paramIndex}`;
}

export class CustomersRepository {
  constructor() {
    this.defaultLimit = 20;
  }

  /**
   * Get customers with cursor-based pagination
   * @param {Object} params - Query parameters
   * @param {number} [params.cursor] - Cursor for pagination (row number)
   * @param {number} [params.limit] - Number of items per page
   * @param {string} [params.search] - Search query across multiple fields
   * @param {string} [params.salesArea] - Filter by sales area
   * @param {string} [params.sortBy] - Sort field: 'customer_name', 'customer_code', or 'id'
   * @param {string} [params.sortOrder] - Sort direction: 'asc' or 'desc'
   * @returns {Promise<Object>} Paginated response with customers
   */
  async getCustomers(params = {}) {
    const { 
      cursor, 
      limit = this.defaultLimit, 
      search, 
      salesArea,
      sortBy = 'customer_code',
      sortOrder = 'asc'
    } = params;
    
    try {
      // Validate and build ORDER BY clause
      const validSortFields = ['customer_code', 'customer_name', 'id'];
      const orderByClause = buildOrderByClause(sortBy, sortOrder, validSortFields);
      
      if (!orderByClause) {
        throw new Error('Invalid sort parameters');
      }
      
      // Build query parts
      const whereClause = buildWhereClause({ search, salesArea });
      
      // Calculate parameter indices
      let paramIndex = 1;
      const queryParams = [];
      
      // Add parameters based on conditions
      if (salesArea) {
        queryParams.push(salesArea);
        paramIndex++;
      }
      
      if (search) {
        queryParams.push(`%${search}%`);
        paramIndex++;
      }
      
      const cursorClause = buildCursorClause(cursor, cursor ? paramIndex : null);
      if (cursor) {
        queryParams.push(cursor);
        paramIndex++;
      }
      
      const limitClause = buildLimitClause(limit + 1, paramIndex);
      queryParams.push(limit + 1);
      
      // Build complete query
      const query = `
        WITH paginated AS (
          SELECT ROW_NUMBER() OVER(${orderByClause}) as row_id, 
                 id as customer_id, customer_code, customer_name, customer_sales_area,
                 customer_sales_owner, customer_service_owner, customer_address_street,
                 customer_address_country, customer_address_zip, customer_address_city
          FROM customers
          ${whereClause}
        )
        SELECT
          row_id, customer_id, customer_code, customer_name, customer_sales_area,
          customer_sales_owner, customer_service_owner, customer_address_street,
          customer_address_country, customer_address_zip, customer_address_city
        FROM paginated
        ${cursorClause}
        ORDER BY row_id 
        ${limitClause}
      `;
      
      const result = await sql.unsafe(query, queryParams);
      const customers = Array.from(result);
      
      // Check if there are more records
      const hasMore = customers.length > limit;
      if (hasMore) {
        customers.pop(); // Remove the extra record
      }
      
      // Get next cursor (use row_id instead of customer_id)
      const nextCursor = customers.length > 0 
        ? customers[customers.length - 1].row_id 
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
        AND customer_sales_area <> '' AND status = TRUE
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
          id as customer_id,
          customer_code, customer_name, customer_sales_area, customer_sales_owner,
          customer_service_owner, customer_price_list, customer_discount, customer_payment_terms,
          customer_tax_prefix, customer_tax_number, customer_address_street,
          customer_address_country, customer_address_zip, customer_address_city,
          customer_phone_number, customer_fax_number, customer_email, customer_addresses,
          customer_contacts, customer_credits
        FROM customers
        WHERE id = ${id} AND status = TRUE
        LIMIT 1
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('Database Error fetching customer by ID:', error);
      throw new Error(`Failed to fetch customer: ${error.message}`);
    }
  }

    /**
   * Get customer codes with IDs for dropdowns/selects
   * @returns {Promise<Array<Object>>} Array of objects with customer_id and customer_code
   */
  async getCustomersCodes() {
    try {
      const result = await sql`
        SELECT id as customer_id, customer_code
        FROM customers
        WHERE customer_code IS NOT NULL 
        AND customer_code <> ''
        ORDER BY customer_code ASC
      `;
      
      return Array.from(result);
    } catch (error) {
      console.error('Database Error fetching customer codes:', error);
      throw new Error(`Failed to fetch customer codes: ${error.message}`);
    }
  }
}

// Export singleton instance
export const customersRepository = new CustomersRepository();