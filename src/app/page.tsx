'use client'

import { useEffect, useState } from 'react'
import StatsCard from '@/components/StatsCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { formatCurrency } from '@/utils/helpers'

// Mock data - سيتم استبدالها بـ API calls حقيقية
const mockWeeklyData = [
  { week: 'W48', revenue: 5000, salaries: 3000, profit: 2000, orders: 450 },
  { week: 'W49', revenue: 5500, salaries: 3200, profit: 2300, orders: 480 },
  { week: 'W50', revenue: 6000, salaries: 3400, profit: 2600, orders: 520 },
  { week: 'W51', revenue: 6500, salaries: 3600, profit: 2900, orders: 550 },
]

const mockDriverPerformance = [
  { name: 'Ahmed Ali', orders: 120, revenue: 1200 },
  { name: 'Mohamed Hassan', orders: 115, revenue: 1150 },
  { name: 'Khaled Ibrahim', orders: 110, revenue: 1100 },
  { name: 'Omar Fathi', orders: 105, revenue: 1050 },
  { name: 'Youssef Salem', orders: 100, revenue: 1000 },
]

const mockCompanyPerformance = [
  { name: 'Company A', value: 35, revenue: 3500 },
  { name: 'Company B', value: 25, revenue: 2500 },
  { name: 'Company C', value: 20, revenue: 2000 },
  { name: 'Company D', value: 15, revenue: 1500 },
  { name: 'Others', value: 5, revenue: 500 },
]

const COLORS = ['#0284c7', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 23000,
    totalSalaries: 13200,
    netProfit: 9800,
    profitMargin: 42.6,
    totalOrders: 2000,
    completedOrders: 1850,
    pendingOrders: 150,
    activeDrivers: 25,
    trainingDrivers: 3,
    suspendedDrivers: 2,
    activeCompanies: 8,
    pausedCompanies: 1,
    currentWeekOrders: 550,
    lastWeekOrders: 520,
  })

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  const ordersGrowth = ((stats.currentWeekOrders - stats.lastWeekOrders) / stats.lastWeekOrders) * 100

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Overview of your driver management system
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Week 51, 2024</span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي الإيرادات"
          value={formatCurrency(stats.totalRevenue)}
          icon={<DollarSign className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="مجموع الرواتب"
          value={formatCurrency(stats.totalSalaries)}
          icon={<Users className="h-6 w-6" />}
          color="purple"
        />
        <StatsCard
          title="صافي الربح"
          value={formatCurrency(stats.netProfit)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: stats.profitMargin, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="إجمالي الطلبات"
          value={stats.totalOrders}
          icon={<ShoppingCart className="h-6 w-6" />}
          trend={{ value: ordersGrowth, isPositive: ordersGrowth > 0 }}
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">سائقين نشطين</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.activeDrivers}</p>
              <p className="text-xs text-gray-500 mt-1">Active</p>
            </div>
            <div className="p-3 bg-success-50 rounded-lg">
              <Users className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">تحت التدريب</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.trainingDrivers}</p>
              <p className="text-xs text-gray-500 mt-1">Training Period</p>
            </div>
            <div className="p-3 bg-warning-50 rounded-lg">
              <Calendar className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">شركات نشطة</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.activeCompanies}</p>
              <p className="text-xs text-gray-500 mt-1">Active Partners</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">طلبات مكتملة</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
              <p className="text-xs text-gray-500 mt-1">Of {stats.totalOrders} total</p>
            </div>
            <div className="p-3 bg-success-50 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue & Profit Trends */}
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              اتجاهات الإيرادات والأرباح
            </h3>
            <p className="text-sm text-gray-600 mt-1">آخر 4 أسابيع</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px' 
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0284c7"
                strokeWidth={2}
                name="الإيرادات"
                dot={{ fill: '#0284c7', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#22c55e"
                strokeWidth={2}
                name="الأرباح"
                dot={{ fill: '#22c55e', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="salaries"
                stroke="#f59e0b"
                strokeWidth={2}
                name="الرواتب"
                dot={{ fill: '#f59e0b', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Orders */}
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              الطلبات الأسبوعية
            </h3>
            <p className="text-sm text-gray-600 mt-1">عدد الطلبات في كل أسبوع</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px' 
                }}
              />
              <Legend />
              <Bar 
                dataKey="orders" 
                fill="#0284c7" 
                name="الطلبات"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Drivers Performance */}
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              أفضل السائقين أداءً
            </h3>
            <p className="text-sm text-gray-600 mt-1">الأسبوع الحالي</p>
          </div>
          <div className="space-y-4">
            {mockDriverPerformance.map((driver, index) => (
              <div key={driver.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                    <p className="text-xs text-gray-500">{driver.orders} طلب</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(driver.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Revenue Distribution */}
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              توزيع الإيرادات حسب الشركة
            </h3>
            <p className="text-sm text-gray-600 mt-1">النسبة المئوية للإيرادات</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockCompanyPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {mockCompanyPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  formatCurrency(props.payload.revenue),
                  props.payload.name
                ]}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">آخر النشاطات</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-success-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  طلب جديد تم تعيينه لأحمد علي
                </p>
                <p className="text-xs text-gray-500 mt-1">منذ دقيقتين</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  تمت معالجة الراتب الأسبوعي لـ 5 سائقين
                </p>
                <p className="text-xs text-gray-500 mt-1">منذ ساعة</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-warning-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  سائق جديد محمد حسن تمت إضافته للتدريب
                </p>
                <p className="text-xs text-gray-500 mt-1">منذ 3 ساعات</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">تنبيهات وملاحظات</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 space-x-reverse p-3 bg-warning-50 rounded-lg border border-warning-200">
              <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-warning-900">
                  3 سائقين لم يحققوا المستهدف هذا الأسبوع
                </p>
                <p className="text-xs text-warning-700 mt-1">يحتاجون قرار إداري</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse p-3 bg-primary-50 rounded-lg border border-primary-200">
              <AlertCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-primary-900">
                  مستندات 2 سائقين غير مكتملة
                </p>
                <p className="text-xs text-primary-700 mt-1">يرجى المراجعة والتحديث</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse p-3 bg-success-50 rounded-lg border border-success-200">
              <AlertCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-success-900">
                  أداء ممتاز هذا الأسبوع!
                </p>
                <p className="text-xs text-success-700 mt-1">تم تجاوز الهدف بنسبة 10%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
