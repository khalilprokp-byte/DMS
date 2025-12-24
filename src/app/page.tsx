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
import { formatCurrency } from '@/utils/helpers'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats] = useState({
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
    setLoading(false)
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

      {/* Main Stats Cards */}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Drivers</h3>
              <p className="text-sm text-gray-600">Add or edit driver information</p>
            </div>
          </div>
        </div>
        
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-success-100 rounded-lg">
              <Building2 className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Companies</h3>
              <p className="text-sm text-gray-600">View partner companies</p>
            </div>
          </div>
        </div>
        
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-warning-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">New Order</h3>
              <p className="text-sm text-gray-600">Create a new order</p>
            </div>
          </div>
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

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm font-medium text-gray-600 mb-4">This Week</h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(6500)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Orders</span>
                <span className="text-sm font-semibold text-gray-900">550</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-success-600 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Top Driver</h4>
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold">AA</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Ahmed Ali</p>
              <p className="text-sm text-gray-500">120 orders this week</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{formatCurrency(1200)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Top Company</h4>
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-success-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-success-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Company A Ltd</p>
              <p className="text-sm text-gray-500">35% of total revenue</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{formatCurrency(3500)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
