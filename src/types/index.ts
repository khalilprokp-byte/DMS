// Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export enum DriverStatus {
  TRAINING = 'training',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export enum CompanyStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
}

export enum PricingType {
  PER_ORDER = 'per_order',
  PER_STOP = 'per_stop',
}

export enum DocumentStatus {
  COMPLETE = 'complete',
  INCOMPLETE = 'incomplete',
}

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  ONE_TIME = 'one_time',
  INSTALLMENTS = 'installments',
}

// Driver Types
export interface Driver {
  id: string
  full_name: string
  phone: string
  whatsapp: string
  start_date: string
  status: DriverStatus
  weekly_salary: number
  required_orders: number
  notes?: string
  identity_front?: string
  identity_back?: string
  passport?: string
  document_status: DocumentStatus
  created_at: string
  updated_at: string
}

export interface DriverDocument {
  id: string
  driver_id: string
  document_type: 'identity_front' | 'identity_back' | 'passport'
  file_url: string
  uploaded_at: string
}

// Company Types
export interface Company {
  id: string
  name: string
  contact_person: string
  phone: string
  email: string
  status: CompanyStatus
  pricing_type: PricingType
  price_value: number
  notes?: string
  fixed_instructions?: string
  created_at: string
  updated_at: string
}

export interface CompanyOrderSettings {
  id: string
  company_id: string
  require_post_code: boolean
  require_customer_name: boolean
  require_phone: boolean
  require_stops: boolean
  require_delivery_notes: boolean
  created_at: string
  updated_at: string
}

// Order Types
export interface Order {
  id: string
  company_id: string
  driver_id: string
  order_date: string
  post_code?: string
  customer_name?: string
  phone?: string
  stops: number
  delivery_notes?: string
  fixed_instructions?: string
  revenue: number
  status: OrderStatus
  week_number: number
  year: number
  created_at: string
  updated_at: string
  company?: Company
  driver?: Driver
}

// Salary Types
export interface WeeklySalary {
  id: string
  driver_id: string
  week_number: number
  year: number
  start_date: string
  end_date: string
  total_orders: number
  required_orders: number
  base_salary: number
  bonus: number
  deductions: number
  advance_deduction: number
  final_salary: number
  is_training: boolean
  is_waived: boolean
  waive_reason?: string
  status: 'pending' | 'paid' | 'archived'
  paid_at?: string
  created_at: string
  updated_at: string
  driver?: Driver
}

// Advance Types
export interface Advance {
  id: string
  driver_id: string
  amount: number
  remaining_amount: number
  advance_date: string
  payment_method: PaymentMethod
  installment_amount?: number
  installments_count?: number
  installments_paid: number
  status: 'active' | 'paid'
  notes?: string
  created_at: string
  updated_at: string
  driver?: Driver
}

export interface AdvancePayment {
  id: string
  advance_id: string
  salary_id: string
  amount: number
  payment_date: string
  created_at: string
}

// Dashboard Stats Types
export interface DashboardStats {
  totalRevenue: number
  totalSalaries: number
  netProfit: number
  profitMargin: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  activeDrivers: number
  trainingDrivers: number
  suspendedDrivers: number
  activeCompanies: number
  pausedCompanies: number
  currentWeekOrders: number
  lastWeekOrders: number
  ordersGrowth: number
}

export interface WeeklyPerformance {
  week: string
  revenue: number
  salaries: number
  profit: number
  orders: number
}

export interface DriverPerformance {
  id: string
  name: string
  orders: number
  revenue: number
  salary: number
}

export interface CompanyPerformance {
  id: string
  name: string
  orders: number
  revenue: number
}

// Report Types
export interface WeeklyReport {
  weekNumber: number
  year: number
  startDate: string
  endDate: string
  totalOrders: number
  totalRevenue: number
  totalSalaries: number
  netProfit: number
  drivers: DriverPerformance[]
  companies: CompanyPerformance[]
}

export interface DriverReport {
  driver: Driver
  period: {
    start: string
    end: string
  }
  totalOrders: number
  totalRevenue: number
  totalSalary: number
  weeklySalaries: WeeklySalary[]
  advances: Advance[]
}

export interface CompanyReport {
  company: Company
  period: {
    start: string
    end: string
  }
  totalOrders: number
  totalRevenue: number
  weeklyBreakdown: {
    week: string
    orders: number
    revenue: number
  }[]
}

// Form Types
export interface DriverFormData {
  full_name: string
  phone: string
  whatsapp: string
  start_date: string
  status: DriverStatus
  weekly_salary: number
  required_orders: number
  notes?: string
}

export interface CompanyFormData {
  name: string
  contact_person: string
  phone: string
  email: string
  status: CompanyStatus
  pricing_type: PricingType
  price_value: number
  notes?: string
  fixed_instructions?: string
  require_post_code: boolean
  require_customer_name: boolean
  require_phone: boolean
  require_stops: boolean
  require_delivery_notes: boolean
}

export interface OrderFormData {
  company_id: string
  driver_id: string
  order_date: string
  post_code?: string
  customer_name?: string
  phone?: string
  stops: number
  delivery_notes?: string
}

export interface AdvanceFormData {
  driver_id: string
  amount: number
  advance_date: string
  payment_method: PaymentMethod
  installment_amount?: number
  installments_count?: number
  notes?: string
}

export interface SalaryWaiveData {
  salary_id: string
  waive_reason: string
}
