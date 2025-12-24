'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'
import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

const colorClasses = {
  blue: 'bg-primary-50 text-primary-600',
  green: 'bg-success-50 text-success-600',
  yellow: 'bg-warning-50 text-warning-600',
  red: 'bg-danger-50 text-danger-600',
  purple: 'bg-purple-50 text-purple-600',
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  color = 'blue',
}: StatsCardProps) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center">
              {trend.isPositive ? (
                <ArrowUp className="h-4 w-4 text-success-600" />
              ) : (
                <ArrowDown className="h-4 w-4 text-danger-600" />
              )}
              <span
                className={`ml-1 text-sm font-medium ${
                  trend.isPositive ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="ml-1 text-sm text-gray-500">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
