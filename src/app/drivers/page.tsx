'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Phone, Calendar, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import LoadingSpinner from '@/components/LoadingSpinner'
import Modal from '@/components/Modal'
import { Driver, DriverStatus, DocumentStatus } from '@/types'
import { formatDate, formatCurrency } from '@/utils/helpers'

// Mock data
const mockDrivers: Driver[] = [
  {
    id: '1',
    full_name: 'Ahmed Ali Mohamed',
    phone: '+447700900123',
    whatsapp: '+447700900123',
    start_date: '2024-01-15',
    status: DriverStatus.ACTIVE,
    weekly_salary: 120,
    required_orders: 100,
    notes: 'Excellent performance',
    document_status: DocumentStatus.COMPLETE,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    full_name: 'Mohamed Hassan Ibrahim',
    phone: '+447700900124',
    whatsapp: '+447700900124',
    start_date: '2024-12-10',
    status: DriverStatus.TRAINING,
    weekly_salary: 120,
    required_orders: 100,
    document_status: DocumentStatus.INCOMPLETE,
    created_at: '2024-12-10T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
  },
  {
    id: '3',
    full_name: 'Khaled Ibrahim Ahmed',
    phone: '+447700900125',
    whatsapp: '+447700900125',
    start_date: '2024-02-01',
    status: DriverStatus.ACTIVE,
    weekly_salary: 120,
    required_orders: 100,
    notes: 'Reliable driver',
    document_status: DocumentStatus.COMPLETE,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
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

export default function DriversPage() {
  const [loading, setLoading] = useState(true)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDrivers(mockDrivers)
      setLoading(false)
    }, 800)
  }, [])

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
          <p className="mt-2 text-gray-600">
            Manage your drivers, documents, and performance
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Driver
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input pl-10 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="training">Training</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Drivers</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter((d) => d.status === 'active').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-success-50 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-success-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Training</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter((d) => d.status === 'training').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-warning-50 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-warning-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter((d) => d.status === 'suspended').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-danger-50 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-danger-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No drivers found
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-sm">
                              {driver.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {driver.full_name}
                          </div>
                          <div className="text-sm text-gray-500">ID: {driver.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.phone}</div>
                      <a
                        href={`https://wa.me/${driver.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-success-600 hover:text-success-700 inline-flex items-center"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        WhatsApp
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${statusColors[driver.status]}`}>
                        {statusLabels[driver.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(driver.start_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(driver.weekly_salary)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {driver.required_orders} orders/week
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`badge ${
                          driver.document_status === 'complete'
                            ? 'badge-success'
                            : 'badge-warning'
                        }`}
                      >
                        {driver.document_status === 'complete' ? 'Complete' : 'Incomplete'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/drivers/${driver.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedDriver(driver)
                            setShowAddModal(true)
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
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

      {/* Add/Edit Driver Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedDriver(null)
        }}
        title={selectedDriver ? 'Edit Driver' : 'Add New Driver'}
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input"
                placeholder="Ahmed Ali Mohamed"
                defaultValue={selectedDriver?.full_name}
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                className="input"
                placeholder="+447700900123"
                defaultValue={selectedDriver?.phone}
              />
            </div>
            <div>
              <label className="label">WhatsApp Number</label>
              <input
                type="tel"
                className="input"
                placeholder="+447700900123"
                defaultValue={selectedDriver?.whatsapp}
              />
            </div>
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                className="input"
                defaultValue={selectedDriver?.start_date}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" defaultValue={selectedDriver?.status}>
                <option value="training">Training</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="label">Weekly Salary (£)</label>
              <input
                type="number"
                className="input"
                placeholder="120"
                defaultValue={selectedDriver?.weekly_salary}
              />
            </div>
            <div>
              <label className="label">Required Orders per Week</label>
              <input
                type="number"
                className="input"
                placeholder="100"
                defaultValue={selectedDriver?.required_orders}
              />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Any additional notes..."
              defaultValue={selectedDriver?.notes}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false)
                setSelectedDriver(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedDriver ? 'Update Driver' : 'Add Driver'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
