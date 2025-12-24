'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import Modal from '@/components/Modal'
import { Order, Company, Driver, OrderStatus, PricingType } from '@/types'
import { formatDate, formatCurrency, getWeekNumber, getCurrentWeek } from '@/utils/helpers'

// Mock data
const mockDrivers = [
  { id: '1', full_name: 'Ahmed Ali Mohamed' },
  { id: '2', full_name: 'Mohamed Hassan Ibrahim' },
  { id: '3', full_name: 'Khaled Ibrahim Ahmed' },
]

const mockCompanies = [
  {
    id: '1',
    name: 'Company A Ltd',
    pricing_type: 'per_order' as PricingType,
    price_value: 15,
    fixed_instructions: 'Always ring bell twice',
  },
  {
    id: '2',
    name: 'Express Delivery Co',
    pricing_type: 'per_stop' as PricingType,
    price_value: 5,
    fixed_instructions: 'Call before delivery',
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
    stops: 1,
    delivery_notes: 'Ring bell twice',
    fixed_instructions: 'Always ring bell twice',
    revenue: 15,
    status: OrderStatus.COMPLETED,
    week_number: 51,
    year: 2024,
    created_at: '2024-12-23T10:00:00Z',
    updated_at: '2024-12-23T14:00:00Z',
  },
]

export default function OrdersPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    company_id: '',
    driver_id: '',
    order_date: new Date().toISOString().split('T')[0],
    post_code: '',
    customer_name: '',
    phone: '',
    stops: 1,
    delivery_notes: '',
  })

  const [calculatedRevenue, setCalculatedRevenue] = useState(0)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)

  useEffect(() => {
    setOrders(mockOrders)
    setDrivers(mockDrivers)
    setCompanies(mockCompanies)
    setLoading(false)
  }, [])

  // حساب الإيرادات تلقائياً عند تغيير الشركة أو عدد ال stops
  useEffect(() => {
    if (formData.company_id) {
      const company = companies.find(c => c.id === formData.company_id)
      setSelectedCompany(company)
      
      if (company) {
        let revenue = 0
        if (company.pricing_type === 'per_order') {
          revenue = company.price_value
        } else if (company.pricing_type === 'per_stop') {
          revenue = company.price_value * formData.stops
        }
        setCalculatedRevenue(revenue)
      }
    }
  }, [formData.company_id, formData.stops, companies])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const currentWeek = getCurrentWeek()
    
    const newOrder: Order = {
      id: String(orders.length + 1),
      ...formData,
      fixed_instructions: selectedCompany?.fixed_instructions || '',
      revenue: calculatedRevenue,
      status: OrderStatus.PENDING,
      week_number: currentWeek.weekNumber,
      year: currentWeek.year,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setOrders([newOrder, ...orders])
    setShowAddModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      company_id: '',
      driver_id: '',
      order_date: new Date().toISOString().split('T')[0],
      post_code: '',
      customer_name: '',
      phone: '',
      stops: 1,
      delivery_notes: '',
    })
    setCalculatedRevenue(0)
    setSelectedCompany(null)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.post_code?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  const getDriverName = (driverId: string) => {
    return drivers.find(d => d.id === driverId)?.full_name || 'Unknown'
  }

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || 'Unknown'
  }

  const statusColors = {
    pending: 'badge-warning',
    in_progress: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-danger',
  }

  const statusLabels = {
    pending: 'قيد الانتظار',
    in_progress: 'جاري التوصيل',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="mt-2 text-gray-600">
            إنشاء وإدارة طلبات التوصيل
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2 ml-2" />
          طلب جديد
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="بحث بالاسم أو الرمز البريدي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input pl-10 appearance-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="in_progress">جاري التوصيل</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600">إجمالي الطلبات</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{orders.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">مكتملة</p>
          <p className="text-2xl font-bold text-success-600 mt-2">
            {orders.filter(o => o.status === 'completed').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">قيد التنفيذ</p>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            {orders.filter(o => o.status === 'in_progress').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatCurrency(orders.reduce((sum, o) => sum + o.revenue, 0))}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  رقم الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الشركة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  السائق
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Stops
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الإيرادات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الحالة
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    لا توجد طلبات
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.order_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCompanyName(order.company_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getDriverName(order.driver_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer_name}</div>
                      <div className="text-xs text-gray-500">{order.post_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.stops}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2 space-x-reverse">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="text-danger-600 hover:text-danger-900">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Order Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          resetForm()
        }}
        title="إضافة طلب جديد"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">الشركة *</label>
              <select
                required
                className="input"
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
              >
                <option value="">اختر الشركة</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">السائق *</label>
              <select
                required
                className="input"
                value={formData.driver_id}
                onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
              >
                <option value="">اختر السائق</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">تاريخ الطلب *</label>
              <input
                type="date"
                required
                className="input"
                value={formData.order_date}
                onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
              />
            </div>

            <div>
              <label className="label">الرمز البريدي</label>
              <input
                type="text"
                className="input"
                placeholder="SW1A 1AA"
                value={formData.post_code}
                onChange={(e) => setFormData({ ...formData, post_code: e.target.value })}
              />
            </div>

            <div>
              <label className="label">اسم العميل</label>
              <input
                type="text"
                className="input"
                placeholder="John Smith"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              />
            </div>

            <div>
              <label className="label">رقم الهاتف</label>
              <input
                type="tel"
                className="input"
                placeholder="+447700900123"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="label">عدد Stops *</label>
              <input
                type="number"
                required
                min="1"
                className="input"
                value={formData.stops}
                onChange={(e) => setFormData({ ...formData, stops: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div>
              <label className="label">الإيرادات المحتسبة</label>
              <div className="input bg-gray-50 font-bold text-primary-600">
                {formatCurrency(calculatedRevenue)}
              </div>
            </div>
          </div>

          {selectedCompany && (
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-sm font-medium text-primary-900 mb-2">
                معلومات التسعير:
              </p>
              <p className="text-sm text-primary-700">
                نوع التسعير: {selectedCompany.pricing_type === 'per_order' ? 'لكل طلب' : 'لكل Stop'}
              </p>
              <p className="text-sm text-primary-700">
                السعر: {formatCurrency(selectedCompany.price_value)}
              </p>
              {selectedCompany.fixed_instructions && (
                <p className="text-sm text-primary-700 mt-2">
                  تعليمات: {selectedCompany.fixed_instructions}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="label">ملاحظات التوصيل</label>
            <textarea
              className="input"
              rows={3}
              placeholder="تعليمات خاصة للتوصيل..."
              value={formData.delivery_notes}
              onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false)
                resetForm()
              }}
              className="btn btn-secondary"
            >
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary">
              إضافة الطلب
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
