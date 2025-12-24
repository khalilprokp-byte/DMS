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

// Mock data - Will be replaced with real API calls
const mockWeeklyData = [
  { week: 'Week 1', revenue: 5000, salaries: 3000, profit: 2000, orders: 450 },
  { week: 'Week 2', revenue: 5500, salaries: 3200, profit: 2300, orders: 480 },
  { week: 'Week 3', revenue: 6000, salaries: 3400, profit: 2600, orders: 520 },
  { week: 'Week 4', revenue: 6500, salaries: 3600, profit: 2900, orders: 550 },
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
  { name: 'Company E', value: 5, revenue: 500 },
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
    currentWeekOrders: 550,
    lastWeekOrders: 520,
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  const ordersGrowth = ((stats.currentWeekOrders - stats.lastWeekOrders) / stats.lastWeekOrders) * 100

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's an overview of your driver management system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={<DollarSign className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Total Salaries"
          value={formatCurrency(stats.totalSalaries)}
          icon={<Users className="h-6 w-6" />}
          color="purple"
        />
        <StatsCard
          title="Net Profit"
          value={formatCurrency(stats.netProfit)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: stats.profitMargin, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Total Orders"
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
              <p className="text-sm font-medium text-gray-600">Active Drivers</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.activeDrivers}</p>
            </div>
            <Users className="h-8 w-8 text-success-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Training Drivers</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.trainingDrivers}</p>
            </div>
            <Calendar className="h-8 w-8 text-warning-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Companies</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.activeCompanies}</p>
            </div>
            <Building2 className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-success-600" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue & Profit Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue & Profit Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0284c7"
                strokeWidth={2}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#22c55e"
                strokeWidth={2}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#0284c7" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Drivers */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Drivers
          </h3>
          <div className="space-y-4">
            {mockDriverPerformance.map((driver, index) => (
              <div key={driver.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                    <p className="text-xs text-gray-500">{driver.orders} orders</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(driver.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Company Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue by Company
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockCompanyPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockCompanyPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-success-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New order assigned to Ahmed Ali
              </p>
              <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Weekly salary processed for 5 drivers
              </p>
              <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-warning-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New driver Mohamed Hassan added to training
              </p>
              <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
