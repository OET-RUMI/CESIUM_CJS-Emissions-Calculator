import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Truck, Train, Ship, Plane, Edit2, Trash2 } from 'lucide-react'

const transportModeIcons = {
  road: <Truck size={18} />,
  rail: <Train size={18} />,
  sea: <Ship size={18} />,
  air: <Plane size={18} />
}

const transportModeClasses = {
  road: 'road-icon',
  rail: 'rail-icon',
  sea: 'sea-icon',
  air: 'air-icon'
}

const LegItem = ({ leg, onEdit, onDelete }) => {
  return (
    <Card className="mb-2 shadow-sm bg-gray-700 border border-gray-600">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`transport-icon text-white ${transportModeClasses[leg.transport_mode] || ''}`}>
            {transportModeIcons[leg.transport_mode] || '🗺️'}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-medium text-sm truncate text-white">{leg.name}</h4>
            <p className="text-xs text-gray-400 truncate">{leg.from} → {leg.to}</p>
          </div>
        </div>
        <div className="flex space-x-1 ml-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(leg)}
            className="px-2 h-8 text-gray-300 hover:bg-gray-600"
          >
            <Edit2 size={16} />
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(leg.id)}
            className="px-2 h-8"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LegItem