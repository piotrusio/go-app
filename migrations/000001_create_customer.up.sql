-- Create customers main table
CREATE TABLE customers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_sales_area VARCHAR(50),
    customer_sales_owner VARCHAR(50),
    customer_service_owner VARCHAR(100),
    customer_price_list VARCHAR(50),
    customer_discount DECIMAL(5,2) DEFAULT 0.00,
    customer_status VARCHAR(20) DEFAULT 'AKTYWNY',
    customer_tax_prefix VARCHAR(10),
    customer_tax_number VARCHAR(20)
);

-- Create customer addresses table
CREATE TABLE customer_addresses (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL,
    address_street VARCHAR(255),
    address_country VARCHAR(100),
    address_zip VARCHAR(20),
    address_city VARCHAR(100),
    address_district VARCHAR(100),
    address_phone1 VARCHAR(30),
    address_phone2 VARCHAR(30),
    address_fax VARCHAR(30),
    address_gsm VARCHAR(30),
    address_email VARCHAR(255)
);

-- Create customer contacts table
CREATE TABLE customer_contacts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,
    contact_position VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(30),
    contact_mobile VARCHAR(30)
);

-- Create customer credits table
CREATE TABLE customer_credits (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    credit_valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    credit_valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
    credit_value DECIMAL(15,2) NOT NULL,
    credit_currency VARCHAR(3) DEFAULT 'PLN'
);