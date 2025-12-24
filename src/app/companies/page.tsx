'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Mail, Phone, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import LoadingSpinner from '@/components/LoadingSpinner'
import Modal from '@/components/Modal'
import { Company, CompanyStatus, PricingType } from '@/types'
import { formatCurrency } from '@/utils/helpers'

// Mock data
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Company A Ltd',
    contact_person: 'Jane Doe',
    phone: '+447700900888',
    email: 'jane@companya.com',
    status: CompanyStatus.ACTIVE,
    pricing_type: PricingType.PER_ORDER,
    price_value: 15,
    fixed_instructions: 'Always ring bell twice',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Express Delivery Co',
    contact_person: 'John Smith',
    phone: '+447700900777',
    email: 'john@expressdelivery.com',
    status: CompanyStatus.ACTIVE,
    pricing_type: PricingType.PER_STOP,
    price_value: 5,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
]

const statusColors = {
  active: 'badge-success',
  paused: 'badge-warning',
}

const statusLabels = {
  active: 'Active',
  paused: 'Paused',
}

const pricingLabels = {
  per_order: 'Per Order',
  per_stop: 'Per Stop',
}

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  useEffect(() => {
    setCompanies(mockCompanies)
    setLoading(false)
  }, [])

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter
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
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="mt-2 text-gray-600">
            Manage partner companies and pricing settings
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Company
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
                placeholder="Search companies..."
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
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Companies</p>
              <p className="text-2xl font-bold text-gray-900">
                {companies.filter((c) => c.status === 'active').length}
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
              <p className="text-sm text-gray-600">Paused</p>
              <p className="text-2xl font-bold text-gray-900">
                {companies.filter((c) => c.status === 'paused').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-warning-50 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-warning-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-500">ID: {company.id}</p>
              </div>
              <span className={`badge ${statusColors[company.status]}`}>
                {statusLabels[company.status]}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                {company.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                {company.phone}
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <span className="font-medium mr-2">Contact:</span>
                {company.contact_person}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pricing Model</p>
                  <p className="text-sm font-medium text-gray-900">
                    {pricingLabels[company.pricing_type]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Rate</p>
                  <p className="text-lg font-bold text-primary-600">
                    {formatCurrency(company.price_value)}
                  </p>
                </div>
              </div>
            </div>

            {company.fixed_instructions && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Fixed Instructions</p>
                <p className="text-sm text-gray-700">{company.fixed_instructions}</p>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2">
              <Link
                href={`/companies/${company.id}`}
                className="text-primary-600 hover:text-primary-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Eye className="h-5 w-5" />
              </Link>
              <button
                onClick={() => {
                  setSelectedCompany(company)
                  setShowAddModal(true)
                }}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button className="text-danger-600 hover:text-danger-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No companies found</p>
        </div>
      )}

      {/* Add/Edit Company Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedCompany(null)
        }}
        title={selectedCompany ? 'Edit Company' : 'Add New Company'}
        size="xl"
      >
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Company Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Company A Ltd"
                  defaultValue={selectedCompany?.name}
                />
              </div>
              <div>
                <label className="label">Contact Person</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Jane Doe"
                  defaultValue={selectedCompany?.contact_person}
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="jane@company.com"
                  defaultValue={selectedCompany?.email}
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="+447700900123"
                  defaultValue={selectedCompany?.phone}
                />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" defaultValue={selectedCompany?.status}>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Pricing Type</label>
                <select className="input" defaultValue={selectedCompany?.pricing_type}>
                  <option value="per_order">Per Order</option>
                  <option value="per_stop">Per Stop</option>
                </select>
              </div>
              <div>
                <label className="label">Price Value (£)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  placeholder="15.00"
                  defaultValue={selectedCompany?.price_value}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3" />
                <span className="text-sm text-gray-700">Require Post Code</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3" />
                <span className="text-sm text-gray-700">Require Customer Name</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3" />
                <span className="text-sm text-gray-700">Require Phone Number</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3" />
                <span className="text-sm text-gray-700">Require Number of Stops</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3" />
                <span className="text-sm text-gray-700">Require Delivery Notes</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <label className="label">Fixed Instructions</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Default delivery instructions for all orders..."
              defaultValue={selectedCompany?.fixed_instructions}
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              className="input"
              rows={2}
              placeholder="Internal notes..."
              defaultValue={selectedCompany?.notes}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false)
                setSelectedCompany(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedCompany ? 'Update Company' : 'Add Company'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
