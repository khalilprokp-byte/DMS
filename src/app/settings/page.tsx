import Link from 'next/link'
import { Settings as SettingsIcon, ArrowLeft } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Coming Soon</p>
        </div>
      </div>

      <div className="card text-center py-12">
        <SettingsIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          System Settings
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          This feature is under development. You'll be able to configure system
          settings and user permissions.
        </p>
        <div className="space-y-2 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-2">Planned Features:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              General system settings
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              User management and permissions
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Email and notification settings
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Backup and restore
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              System logs and audit trail
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
