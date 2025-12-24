'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  CreditCard,
  Upload,
  Edit,
} from 'lucide-react'
import Link from 'next/link'
import LoadingSpinner from '@/components/LoadingSpinner'
import Modal from '@/components/Modal'
import { Driver, DriverStatus, DocumentStatus, WeeklySalary, Advance, Order, PaymentMethod, OrderStatus, CompanyStatus, PricingType } from '@/types'
import { formatDate, formatCurrency, generateWhatsAppLink } from '@/utils/helpers'

// Mock data
const mockDriver: Driver = {
  id: '1',
  full_name: 'Ahmed Ali Mohamed',
  phone: '+447700900123',
  whatsapp: '+447700900123',
  start_date: '2024-01-15',
  status: DriverStatus.ACTIVE,
  weekly_salary: 120,
  required_orders: 100,
  notes: 'Excellent performance',
  identity_front: 'https://placeholder.com/id-front.jpg',
  identity_back: 'https://placeholder.com/id-back.jpg',
  passport: 'https://placeholder.com/passport.jpg',
  document_status: DocumentStatus.COMPLETE,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
}

const mockWeeklySalaries: WeeklySalary[] = [
  {
    id: '1',
    driver_id: '1',
    week_number: 51,
    year: 2024,
    start_date: '2024-12-16',
    end_date: '2024-12-22',
    total_orders: 115,
    required_orders: 100,
    base_salary: 120,
    bonus: 15,
    deductions: 0,
    advance_deduction: 20,
    final_salary: 115,
    is_training: false,
    is_waived: false,
    status: 'paid',
    paid_at: '2024-12-23T00:00:00Z',
    created_at: '2024-12-23T00:00:00Z',
    updated_at: '2024-12-23T00:00:00Z',
  },
  {
    id: '2',
    driver_id: '1',
    week_number: 50,
    year: 2024,
    start_date: '2024-12-09',
    end_date: '2024-12-15',
    total_orders: 105,
    required_orders: 100,
    base_salary: 120,
    bonus: 5,
    deductions: 0,
    advance_deduction: 20,
    final_salary: 105,
    is_training: false,
    is_waived: false,
    status: 'paid',
    paid_at: '2024-12-16T00:00:00Z',
    created_at: '2024-12-16T00:00:00Z',
    updated_at: '2024-12-16T00:00:00Z',
  },
]

const mockAdvances: Advance[] = [
  {
    id: '1',
    driver_id: '1',
    amount: 200,
    remaining_amount: 80,
    advance_date: '2024-12-01',
    payment_method: PaymentMethod.INSTALLMENTS,
    installment_amount: 20,
    installments_count: 10,
    installments_paid: 6,
    status: 'active',
    notes: 'Emergency advance',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-23T00:00:00Z',
  },
]

const mockOrders: Order[] = [
  {
    id: '1',
    company_id: '1',
    driver_id: '1',
    order_date: '2024-12-23',
    post_code: 'SW1A 1AA',
    customer_name: 'John Smith',
    phone: '+447700900999',
    stops: 3,
    delivery_notes: 'Ring bell twice',
    revenue: 15,
    status: OrderStatus.COMPLETED,
    week_number: 51,
    year: 2024,
    created_at: '2024-12-23T10:00:00Z',
    updated_at: '2024-12-23T14:00:00Z',
    company: {
      id: '1',
      name: 'Company A',
      contact_person: 'Jane Doe',
      phone: '+447700900888',
      email: 'jane@companya.com',
      status: CompanyStatus.ACTIVE,
      pricing_type: PricingType.PER_ORDER,
      price_value: 15,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
]

const statusColors = {
  training: 'badge-warning',
  active: 'badge-success',
  suspended: 'badge-danger',
}

const statusLabels = {
  training: 'Training',
  active: 'Active',
  suspended: 'Suspended',
}

export default function DriverDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [weeklySalaries, setWeeklySalaries] = useState<WeeklySalary[]>([])
  const [advances, setAdvances] = useState<Advance[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'orders' | 'salaries' | 'advances' | 'documents'>('orders')

  // Current week stats
  const currentWeekOrders = 87
  const remainingOrders = mockDriver.required_orders - currentWeekOrders
  const expectedSalary = currentWeekOrders >= mockDriver.required_orders
    ? mockDriver.weekly_salary + (currentWeekOrders - mockDriver.required_orders)
    : 0

  useEffect(() => {
    setDriver(mockDriver)
    setWeeklySalaries(mockWeeklySalaries)
    setAdvances(mockAdvances)
    setRecentOrders(mockOrders)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  if (!driver) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-danger-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Driver Not Found</h2>
        <p className="text-gray-600 mb-6">The driver you're looking for doesn't exist.</p>
        <Link href="/drivers" className="btn btn-primary">
          Back to Drivers
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{driver.full_name}</h1>
            <p className="mt-1 text-gray-600">Driver ID: {driver.id}</p>
          </div>
        </div>
        <button className="btn btn-primary inline-flex items-center">
          <Edit className="h-5 w-5 mr-2" />
          Edit Driver
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{currentWeekOrders}</p>
              <p className="text-xs text-gray-500 mt-1">
                {remainingOrders > 0 ? `${remainingOrders} to reach target` : `${Math.abs(remainingOrders)} bonus orders`}
              </p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((currentWeekOrders / driver.required_orders) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Expected Salary</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatCurrency(expectedSalary)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentWeekOrders >= driver.required_orders ? 'Target achieved' : 'Below target'}
              </p>
            </div>
            <div className="p-3 bg-success-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`badge ${statusColors[driver.status]} mt-2 text-base`}>
                {statusLabels[driver.status]}
              </span>
              <p className="text-xs text-gray-500 mt-2">
                Since {formatDate(driver.start_date)}
              </p>
            </div>
            <div className="p-3 bg-warning-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Advances</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatCurrency(advances.reduce((sum, adv) => sum + adv.remaining_amount, 0))}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {advances.filter(a => a.status === 'active').length} active loan(s)
              </p>
            </div>
            <div className="p-3 bg-danger-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-danger-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Driver Info Card */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Full Name</p>
            <p className="text-base font-medium text-gray-900">{driver.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Phone Number</p>
            <p className="text-base font-medium text-gray-900">{driver.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">WhatsApp</p>
            <a
              href={generateWhatsAppLink(driver.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-success-600 hover:text-success-700 inline-flex items-center"
            >
              <Phone className="h-4 w-4 mr-1" />
              {driver.whatsapp}
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Start Date</p>
            <div className="flex items-center text-base font-medium text-gray-900">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {formatDate(driver.start_date)}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Weekly Salary</p>
            <p className="text-base font-medium text-gray-900">{formatCurrency(driver.weekly_salary)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Required Orders</p>
            <p className="text-base font-medium text-gray-900">{driver.required_orders} orders/week</p>
          </div>
          {driver.notes && (
            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-sm text-gray-600 mb-1">Notes</p>
              <p className="text-base text-gray-900">{driver.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['orders', 'salaries', 'advances', 'documents'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm capitalize
                ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stops
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.order_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.company?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.stops}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-success">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'salaries' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary History</h3>
          <div className="space-y-4">
            {weeklySalaries.map((salary) => (
              <div
                key={salary.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Week {salary.week_number}, {salary.year}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(salary.start_date)} - {formatDate(salary.end_date)}
                    </p>
                  </div>
                  <span className={`badge ${salary.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {salary.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Orders</p>
                    <p className="text-lg font-semibold text-gray-900">{salary.total_orders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Base Salary</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(salary.base_salary)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Bonus</p>
                    <p className="text-lg font-semibold text-success-600">
                      +{formatCurrency(salary.bonus)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Final Salary</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(salary.final_salary)}
                    </p>
                  </div>
                </div>
                {salary.advance_deduction > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-danger-600">
                      Advance deduction: {formatCurrency(salary.advance_deduction)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'advances' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advances & Loans</h3>
          <div className="space-y-4">
            {advances.map((advance) => (
              <div
                key={advance.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {formatCurrency(advance.amount)} Advance
                    </h4>
                    <p className="text-sm text-gray-500">
                      Date: {formatDate(advance.advance_date)}
                    </p>
                  </div>
                  <span className={`badge ${advance.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {advance.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-600">Total Amount</p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatCurrency(advance.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Remaining</p>
                    <p className="text-base font-semibold text-danger-600">
                      {formatCurrency(advance.remaining_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Installment</p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatCurrency(advance.installment_amount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Progress</p>
                    <p className="text-base font-semibold text-gray-900">
                      {advance.installments_paid}/{advance.installments_count}
                    </p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-success-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((advance.installments_paid || 0) / (advance.installments_count || 1)) * 100}%`,
                    }}
                  />
                </div>
                {advance.notes && (
                  <p className="text-sm text-gray-600 mt-3">{advance.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            <span
              className={`badge ${
                driver.document_status === 'complete' ? 'badge-success' : 'badge-warning'
              }`}
            >
              {driver.document_status === 'complete' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Incomplete
                </>
              )}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Identity Front */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Identity (Front)</h4>
                {driver.identity_front ? (
                  <CheckCircle className="h-5 w-5 text-success-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning-600" />
                )}
              </div>
              {driver.identity_front ? (
                <div
                  className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setSelectedImage(driver.identity_front!)
                    setShowImageModal(true)
                  }}
                >
                  <img
                    src={driver.identity_front}
                    alt="Identity Front"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <button className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload Image</span>
                </button>
              )}
            </div>

            {/* Identity Back */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Identity (Back)</h4>
                {driver.identity_back ? (
                  <CheckCircle className="h-5 w-5 text-success-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning-600" />
                )}
              </div>
              {driver.identity_back ? (
                <div
                  className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setSelectedImage(driver.identity_back!)
                    setShowImageModal(true)
                  }}
                >
                  <img
                    src={driver.identity_back}
                    alt="Identity Back"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <button className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload Image</span>
                </button>
              )}
            </div>

            {/* Passport */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Passport</h4>
                {driver.passport ? (
                  <CheckCircle className="h-5 w-5 text-success-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning-600" />
                )}
              </div>
              {driver.passport ? (
                <div
                  className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setSelectedImage(driver.passport!)
                    setShowImageModal(true)
                  }}
                >
                  <img
                    src={driver.passport}
                    alt="Passport"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <button className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload Image</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Document Image"
        size="2xl"
      >
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
          <img
            src={selectedImage}
            alt="Document"
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      </Modal>
    </div>
  )
}
