import Link from 'next/link'
import { Package, ArrowLeft } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-2 text-gray-600">Coming Soon</p>
        </div>
      </div>

      <div className="card text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Orders Management Module
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          This feature is under development. You'll be able to create and manage orders,
          assign them to drivers, and track delivery status.
        </p>
        <div className="space-y-2 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-2">Planned Features:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Create orders with company-specific settings
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Automatic revenue calculation
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Assign orders to drivers
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Track order status and delivery
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Filter by driver, company, and date
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
