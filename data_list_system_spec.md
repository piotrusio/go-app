# Reusable Data List System - Design Specification

## Overview

This document outlines the architecture for a reusable data listing system that provides consistent search, filtering, sorting, and pagination functionality across multiple Next.js pages. The system is designed to replace repetitive page-specific implementations with configurable, reusable components.

## Table of Contents

1. [API Design](#api-design)
2. [Search & Filter Architecture](#search--filter-architecture)
3. [URL State Management](#url-state-management)
4. [Component Configuration](#component-configuration)
5. [Performance & UX](#performance--ux)
6. [Implementation Guidelines](#implementation-guidelines)

## API Design

### Endpoint Structure

All data listing endpoints follow a consistent pattern:

```
GET /api/{entity}
```

Examples:
- `/api/customers`
- `/api/orders`
- `/api/products`

### Query Parameters Standard

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-based) | `?page=2` |
| `pageSize` | number | Items per page | `?pageSize=10` |
| `query` | string | Global search term | `?query=acme` |
| `sortBy` | string | Sort field name | `?sortBy=name` |
| `sortOrder` | string | Sort direction (`asc`\|`desc`) | `?sortOrder=desc` |
| `filter[field]` | string | Dynamic filter values | `?filter[region]=north` |

### Complete Example Request

```
GET /api/customers?page=2&pageSize=10&query=acme&sortBy=name&sortOrder=desc&filter[region]=north&filter[status]=active
```

### Response Schema

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_code": "ACME001",
      "company_name": "Acme Corporation",
      "sales_area": "north"
    }
  ],
  "pagination": {
    "currentPage": 2,
    "totalPages": 10,
    "totalItems": 95,
    "pageSize": 10,
    "hasNext": true,
    "hasPrev": true
  },
  "meta": {
    "availableFilters": {
      "region": ["north", "south", "east", "west"],
      "status": ["active", "inactive", "pending"]
    },
    "searchableFields": ["customer_code", "company_name", "sales_area"],
    "sortableFields": ["customer_code", "company_name", "created_at", "updated_at"]
  },
  "error": null
}
```

### Error Response Schema

```json
{
  "success": false,
  "data": [],
  "pagination": null,
  "meta": null,
  "error": "Invalid page parameter. Must be a positive integer."
}
```

## Search & Filter Architecture

### Search Strategy

#### Global Search
- **Single Input Field**: One search box searches across multiple predefined fields
- **Backend Logic**: Uses `ILIKE` queries with `OR` logic across searchable fields
- **Case Insensitive**: All searches are case-insensitive
- **Real-time**: Debounced search with 300ms delay

#### Search Implementation
```sql
-- Example SQL implementation
WHERE (
  customer_code ILIKE '%searchterm%' OR 
  company_name ILIKE '%searchterm%' OR 
  sales_area ILIKE '%searchterm%'
)
```

### Filter Types

The system supports multiple filter types:

| Filter Type | UI Component | Use Case | Example |
|-------------|--------------|----------|---------|
| `select` | Single dropdown | Single choice from predefined options | Region selection |
| `multiselect` | Checkbox group | Multiple choices | Product categories |
| `text` | Text input | Additional text filtering | Customer ID |
| `date` | Date range picker | Date-based filtering | Created date range |
| `boolean` | Toggle/Checkbox | True/false values | Active status |

### Filter Configuration

Each filter is configured using the following schema:

```javascript
interface FilterConfig {
  field: string;                    // Database field name
  type: 'select' | 'multiselect' | 'text' | 'date' | 'boolean';
  label: string;                    // Display label in UI
  source?: 'api' | 'static';        // Source of options
  options?: Array<{               // Static options
    label: string;
    value: string;
  }>;
  apiEndpoint?: string;             // Endpoint for dynamic options
  required?: boolean;               // Whether filter is required
  defaultValue?: any;               // Default selected value
  placeholder?: string;             // Input placeholder text
}
```

### Sorting System

#### Single Field Sorting
- **One Active Sort**: Only one field can be sorted at a time
- **Toggle Behavior**: Clicking same field toggles ASC/DESC
- **Visual Indicators**: Clear UI feedback for active sort direction
- **Default Sort**: Each entity has a configurable default sort

#### Sort Configuration
```javascript
const sortConfig = {
  defaultField: 'customer_code',             // Default sort field
  defaultOrder: 'asc', // 'asc' | 'desc'     // Default sort direction
  allowedFields: ['customer_code', 'company_name'] // Fields available for sorting
};
```

## URL State Management

### URL Structure Pattern

All filter and pagination state is maintained in the URL for bookmarkability and browser navigation support:

```
/customers?page=2&query=acme&filter[region]=north&filter[status]=active&sortBy=name&sortOrder=desc
```

### State Synchronization Rules

| Event | URL Update | Page Reset | Behavior |
|-------|------------|------------|----------|
| Initial Load | Parse URL → Component State | - | Read all params on mount |
| Search Change | Update `query` param | Reset to page 1 | Debounced update |
| Filter Change | Update `filter[field]` param | Reset to page 1 | Immediate update |
| Sort Change | Update `sortBy` & `sortOrder` | Reset to page 1 | Immediate update |
| Page Change | Update `page` param | - | Immediate update |
| Clear Filters | Remove all filter params | Reset to page 1 | Immediate update |

### Browser Navigation Support

- **Back/Forward**: Full support for browser navigation
- **Bookmarks**: All URLs are bookmarkable and shareable
- **Refresh**: Page state restored from URL on refresh
- **History Management**: Uses `router.replace()` to avoid cluttering browser history

## Component Configuration

### Entity Configuration Schema

Each entity (customers, orders, etc.) is configured using a comprehensive configuration object:

```javascript
const entityConfig = {
  // Basic entity information
  name: 'customers',                     // Unique entity identifier
  apiEndpoint: '/api/customers',         // Base API path
  
  // Search configuration
  searchFields: ['customer_code', 'company_name'], // Fields included in global search
  searchPlaceholder: 'Search customers...', // Search input placeholder
  
  // Available filters
  filters: [], // Array of filter configurations
  
  // Sorting configuration
  sorting: {
    defaultField: 'customer_code',
    defaultOrder: 'asc', // 'asc' | 'desc'
    allowedFields: ['customer_code', 'company_name']
  },
  
  // Pagination configuration
  pagination: {
    defaultPageSize: 10,
    allowedPageSizes: [5, 10, 25, 50] // Options for page size selector
  },
  
  // Display configuration
  display: {
    title: 'Customers',                  // Page heading
    emptyMessage: 'No customers found', // No results message
    loadingMessage: 'Loading...',       // Loading state message
    itemsPerPageLabel: 'Items per page' // Page size selector label
  }
};
```

### Configuration Example: Customers

```javascript
const customersConfig = {
  name: 'customers',
  apiEndpoint: '/api/customers',
  
  searchFields: ['customer_code', 'company_name', 'sales_area'],
  searchPlaceholder: 'Search customers...',
  
  filters: [
    {
      field: 'sales_area',
      type: 'select',
      label: 'Region',
      source: 'api',
      apiEndpoint: '/api/customers/regions',
      placeholder: 'All Regions'
    },
    {
      field: 'status',
      type: 'select',
      label: 'Status',
      source: 'static',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ],
      placeholder: 'All Statuses'
    }
  ],
  
  sorting: {
    defaultField: 'customer_code',
    defaultOrder: 'asc',
    allowedFields: ['customer_code', 'company_name', 'created_at', 'updated_at']
  },
  
  pagination: {
    defaultPageSize: 10,
    allowedPageSizes: [5, 10, 25, 50, 100]
  },
  
  display: {
    title: 'Customers',
    emptyMessage: 'No customers found matching your search criteria.',
    loadingMessage: 'Loading customers...',
    itemsPerPageLabel: 'Customers per page'
  }
};
```

## Performance & UX

### Loading States

#### Progressive Loading Strategy
- **Initial Load**: Show full page skeleton while loading first page
- **Search/Filter Changes**: Keep current results visible with loading overlay
- **Pagination**: Immediate page transition with subtle loading indicator
- **Filter Options**: Load filter options independently without blocking main content

#### Loading State Priorities
1. **Critical Path**: Search results and pagination
2. **Secondary**: Filter option lists
3. **Tertiary**: Sort indicators and metadata

### Error Handling

#### Error Types and Responses

| Error Type | User Experience | Recovery Action |
|------------|-----------------|-----------------|
| Network Error | Toast notification with retry button | Automatic retry after 3 seconds |
| Invalid Parameters | Replace with defaults, show warning | Reset to valid state |
| No Results | Contextual empty state with suggestions | Clear filters suggestion |
| Server Error | Error page with contact information | Retry mechanism |

#### Error Recovery Patterns
- **Graceful Degradation**: Show cached data when possible
- **Retry Logic**: Exponential backoff for network errors
- **User Feedback**: Clear messaging about what went wrong
- **State Preservation**: Maintain user input during error recovery

### Debouncing Strategy

#### Search Input Debouncing
- **Delay**: 300ms after user stops typing
- **Cancel Previous**: Cancel in-flight requests when new search starts
- **Visual Feedback**: Show loading indicator during search

#### Filter Change Handling
- **Immediate Execution**: No debouncing for dropdown/checkbox changes
- **Batch Updates**: Group multiple rapid filter changes
- **URL Updates**: Debounce URL updates to prevent history pollution

### Responsive Design Considerations

#### Mobile Optimizations
- **Filter Collapse**: Collapsible filter panel on mobile
- **Touch-Friendly**: Minimum 44px touch targets
- **Simplified Pagination**: Show fewer page numbers on small screens
- **Horizontal Scroll**: Handle wide content gracefully

#### Breakpoint Strategy
- **Desktop**: Full filter sidebar with search
- **Tablet**: Collapsible filters with condensed layout
- **Mobile**: Modal-based filters with bottom sheet pattern

## Implementation Guidelines

### API Implementation Checklist

- [ ] Implement consistent query parameter parsing
- [ ] Add input validation for all parameters
- [ ] Implement standardized response format
- [ ] Add comprehensive error handling
- [ ] Include proper HTTP status codes
- [ ] Add request/response logging
- [ ] Implement rate limiting if needed

### Component Implementation Checklist

- [ ] Create base DataListPage component
- [ ] Implement DataFilters with all filter types
- [ ] Build DataPagination with URL sync
- [ ] Add DataList container with loading states
- [ ] Include comprehensive error boundaries
- [ ] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] Implement responsive design patterns
- [ ] Add unit and integration tests

### Testing Strategy

#### Unit Tests
- Filter logic and state management
- URL parameter parsing and serialization
- Component rendering with various configurations
- Error handling scenarios

#### Integration Tests
- End-to-end search and filter workflows
- Browser navigation and URL state
- API integration and error responses
- Performance under various data loads

#### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance
- Focus management

### Migration Path

#### Phase 1: Infrastructure
1. Create shared API utilities
2. Build core reusable components
3. Set up configuration system

#### Phase 2: First Implementation
1. Migrate customers page to new system
2. Test and refine based on real usage
3. Document lessons learned

#### Phase 3: Rollout
1. Create migration guide for other pages
2. Migrate remaining list pages
3. Deprecate old implementations

---

## Appendix

### JavaScript Object Structures

```javascript
// Complete JavaScript object definitions for the system

// API Response structure
const apiResponse = {
  success: true,
  data: [], // Array of entity objects
  pagination: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    hasNext: true,
    hasPrev: false
  },
  meta: {
    availableFilters: {
      region: ['north', 'south', 'east'],
      status: ['active', 'inactive']
    },
    searchableFields: ['customer_code', 'company_name'],
    sortableFields: ['customer_code', 'company_name', 'created_at']
  },
  error: null
};

// Filter Configuration structure
const filterConfig = {
  field: 'sales_area',
  type: 'select', // 'select' | 'multiselect' | 'text' | 'date' | 'boolean'
  label: 'Region',
  source: 'api', // 'api' | 'static'
  options: [
    { label: 'North', value: 'north' },
    { label: 'South', value: 'south' }
  ],
  apiEndpoint: '/api/customers/regions',
  required: false,
  defaultValue: null,
  placeholder: 'Select region...'
};

// Entity Configuration structure
const entityConfig = {
  name: 'customers',
  apiEndpoint: '/api/customers',
  searchFields: ['customer_code', 'company_name', 'sales_area'],
  searchPlaceholder: 'Search customers...',
  filters: [
    // Array of filter configurations
  ],
  sorting: {
    defaultField: 'customer_code',
    defaultOrder: 'asc', // 'asc' | 'desc'
    allowedFields: ['customer_code', 'company_name', 'created_at']
  },
  pagination: {
    defaultPageSize: 10,
    allowedPageSizes: [5, 10, 25, 50, 100]
  },
  display: {
    title: 'Customers',
    emptyMessage: 'No customers found matching your search criteria.',
    loadingMessage: 'Loading customers...',
    itemsPerPageLabel: 'Customers per page'
  }
};
```

### Example API Routes

```javascript
// Example Next.js API route structure
// /api/customers/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const query = searchParams.get('query') || '';
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  
  // Extract filter parameters
  const filters = {};
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith('filter[') && key.endsWith(']')) {
      const filterField = key.slice(7, -1);
      filters[filterField] = value;
    }
  }
  
  // Implementation details...
}
```