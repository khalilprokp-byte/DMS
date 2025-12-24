-- Driver Management System Database Schema
-- For Supabase PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DRIVERS TABLE
-- ============================================
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('training', 'active', 'suspended')),
  weekly_salary DECIMAL(10, 2) NOT NULL DEFAULT 120.00,
  required_orders INTEGER NOT NULL DEFAULT 100,
  notes TEXT,
  identity_front TEXT,
  identity_back TEXT,
  passport TEXT,
  document_status VARCHAR(20) NOT NULL DEFAULT 'incomplete' CHECK (document_status IN ('complete', 'incomplete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COMPANIES TABLE
-- ============================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'paused')),
  pricing_type VARCHAR(20) NOT NULL CHECK (pricing_type IN ('per_order', 'per_stop')),
  price_value DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  fixed_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COMPANY ORDER SETTINGS TABLE
-- ============================================
CREATE TABLE company_order_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  require_post_code BOOLEAN DEFAULT TRUE,
  require_customer_name BOOLEAN DEFAULT TRUE,
  require_phone BOOLEAN DEFAULT FALSE,
  require_stops BOOLEAN DEFAULT TRUE,
  require_delivery_notes BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id)
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
  order_date DATE NOT NULL,
  post_code VARCHAR(20),
  customer_name VARCHAR(255),
  phone VARCHAR(50),
  stops INTEGER NOT NULL DEFAULT 1,
  delivery_notes TEXT,
  fixed_instructions TEXT,
  revenue DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- WEEKLY SALARIES TABLE
-- ============================================
CREATE TABLE weekly_salaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_orders INTEGER NOT NULL DEFAULT 0,
  required_orders INTEGER NOT NULL,
  base_salary DECIMAL(10, 2) NOT NULL,
  bonus DECIMAL(10, 2) NOT NULL DEFAULT 0,
  deductions DECIMAL(10, 2) NOT NULL DEFAULT 0,
  advance_deduction DECIMAL(10, 2) NOT NULL DEFAULT 0,
  final_salary DECIMAL(10, 2) NOT NULL,
  is_training BOOLEAN NOT NULL DEFAULT FALSE,
  is_waived BOOLEAN NOT NULL DEFAULT FALSE,
  waive_reason TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'archived')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(driver_id, week_number, year)
);

-- ============================================
-- ADVANCES TABLE
-- ============================================
CREATE TABLE advances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
  amount DECIMAL(10, 2) NOT NULL,
  remaining_amount DECIMAL(10, 2) NOT NULL,
  advance_date DATE NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('one_time', 'installments')),
  installment_amount DECIMAL(10, 2),
  installments_count INTEGER,
  installments_paid INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ADVANCE PAYMENTS TABLE
-- ============================================
CREATE TABLE advance_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advance_id UUID NOT NULL REFERENCES advances(id) ON DELETE CASCADE,
  salary_id UUID NOT NULL REFERENCES weekly_salaries(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_start_date ON drivers(start_date);

CREATE INDEX idx_companies_status ON companies(status);

CREATE INDEX idx_orders_driver_id ON orders(driver_id);
CREATE INDEX idx_orders_company_id ON orders(company_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_week_year ON orders(week_number, year);
CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_weekly_salaries_driver_id ON weekly_salaries(driver_id);
CREATE INDEX idx_weekly_salaries_week_year ON weekly_salaries(week_number, year);
CREATE INDEX idx_weekly_salaries_status ON weekly_salaries(status);

CREATE INDEX idx_advances_driver_id ON advances(driver_id);
CREATE INDEX idx_advances_status ON advances(status);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_order_settings_updated_at BEFORE UPDATE ON company_order_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_salaries_updated_at BEFORE UPDATE ON weekly_salaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advances_updated_at BEFORE UPDATE ON advances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (Optional - Enable if needed)
-- ============================================
-- ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE weekly_salaries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE advances ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SAMPLE DATA (For Testing)
-- ============================================
-- Insert sample drivers
INSERT INTO drivers (full_name, phone, whatsapp, start_date, status, weekly_salary, required_orders, document_status)
VALUES 
  ('Ahmed Ali Mohamed', '+447700900123', '+447700900123', '2024-01-15', 'active', 120.00, 100, 'complete'),
  ('Mohamed Hassan Ibrahim', '+447700900124', '+447700900124', '2024-12-10', 'training', 120.00, 100, 'incomplete'),
  ('Khaled Ibrahim Ahmed', '+447700900125', '+447700900125', '2024-02-01', 'active', 120.00, 100, 'complete');

-- Insert sample companies
INSERT INTO companies (name, contact_person, phone, email, status, pricing_type, price_value, fixed_instructions)
VALUES 
  ('Company A Ltd', 'Jane Doe', '+447700900888', 'jane@companya.com', 'active', 'per_order', 15.00, 'Always ring bell twice'),
  ('Express Delivery Co', 'John Smith', '+447700900777', 'john@expressdelivery.com', 'active', 'per_stop', 5.00, NULL);

-- Insert company order settings
INSERT INTO company_order_settings (company_id, require_post_code, require_customer_name, require_phone, require_stops, require_delivery_notes)
SELECT id, TRUE, TRUE, FALSE, TRUE, FALSE FROM companies WHERE name = 'Company A Ltd';

INSERT INTO company_order_settings (company_id, require_post_code, require_customer_name, require_phone, require_stops, require_delivery_notes)
SELECT id, TRUE, TRUE, TRUE, TRUE, TRUE FROM companies WHERE name = 'Express Delivery Co';
