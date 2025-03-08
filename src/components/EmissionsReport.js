import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { X, BarChart2, Truck, Zap, Factory, Train, Ship, Plane } from 'lucide-react'

const EmissionsReport = ({ emissionsData, onClose }) => {
  if (!emissionsData) return null;
  
  const formatNumber = (num) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };
  
  // Calculate percentage breakdowns
  const calculatePercentage = (value) => {
    return ((value / emissionsData.co2e) * 100).toFixed(1);
  };

  const transportModeIcons = {
    road: <Truck size={16} />,
    rail: <Train size={16} />,
    sea: <Ship size={16} />,
    air: <Plane size={16} />
  };
  
  return (
    <Card className="fixed top-4 right-4 z-10 modern-card" style={{ width: "550px" }}>
      <CardHeader className="pb-2 pt-3 px-4 border-b border-gray-600">
        <CardTitle className="flex justify-between items-center text-lg text-white">
          <div className="flex items-center">
            <BarChart2 className="mr-2 text-gray-300" size={18} />
            <span>Emissions Report</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-8 w-8 p-0 rounded-full text-gray-300 hover:bg-gray-700 border-none"
          >
            <X size={18} />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 px-4 py-3">
        <div className="bg-gray-700 p-4 rounded-md border border-gray-600">
          <h3 className="text-sm font-medium text-white">Total Emissions</h3>
          <p className="text-2xl font-bold text-white">{formatNumber(emissionsData.co2e)} kg CO₂e</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatNumber(emissionsData.distance_km)} km · {emissionsData.cargo_tonnes} tonnes cargo
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center text-white">
            <BarChart2 className="mr-1 text-gray-300" size={14} />
            Emissions Breakdown
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center text-gray-300">
                  <Truck className="mr-1 text-gray-300" size={14} />
                  <span>Vehicle Operation</span>
                </span>
                <span className="font-medium text-gray-300">{formatNumber(emissionsData.vehicle_operation_co2e)} kg ({calculatePercentage(emissionsData.vehicle_operation_co2e)}%)</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${calculatePercentage(emissionsData.vehicle_operation_co2e)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center text-gray-300">
                  <Zap className="mr-1 text-gray-300" size={14} />
                  <span>Energy Provision</span>
                </span>
                <span className="font-medium text-gray-300">{formatNumber(emissionsData.vehicle_energy_provision_co2e)} kg ({calculatePercentage(emissionsData.vehicle_energy_provision_co2e)}%)</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${calculatePercentage(emissionsData.vehicle_energy_provision_co2e)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center text-gray-300">
                  <Factory className="mr-1 text-gray-300" size={14} />
                  <span>Logistics Hubs</span>
                </span>
                <span className="font-medium text-gray-300">{formatNumber(emissionsData.hub_equipment_co2e)} kg ({calculatePercentage(emissionsData.hub_equipment_co2e)}%)</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${calculatePercentage(emissionsData.hub_equipment_co2e)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2 text-white">Route Details</h3>
          <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
            {emissionsData.route.map((item, index) => {
              if (item.type === 'location') {
                return (
                  <div key={`loc-${index}`} className="text-xs border-l-2 border-gray-500 pl-2 py-1">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-gray-400">Hub emissions: {item.co2e} kg</p>
                  </div>
                );
              } else if (item.type === 'leg') {
                const getModeIcon = (mode) => {
                  switch(mode) {
                    case 'road': return <div className="transport-icon road-icon text-white">{transportModeIcons['road']}</div>;
                    case 'rail': return <div className="transport-icon rail-icon text-white">{transportModeIcons['rail']}</div>;
                    case 'sea': return <div className="transport-icon sea-icon text-white">{transportModeIcons['sea']}</div>;
                    case 'air': return <div className="transport-icon air-icon text-white">{transportModeIcons['air']}</div>;
                    default: return <span className="px-2 py-1 rounded bg-gray-700">{mode}</span>;
                  }
                };
                
                return (
                  <div key={`leg-${index}`} className="text-xs bg-gray-700 p-2 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium uppercase flex items-center text-white">
                        {getModeIcon(item.transport_mode)} 
                        <span className="ml-1">{item.transport_mode}</span>
                      </span>
                      <span className="text-gray-300">{item.distance_km} km</span>
                    </div>
                    <div className="flex justify-between text-gray-400 mt-1">
                      <span>Emissions</span>
                      <span>{item.co2e} kg</span>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        
        <div className="text-xs text-center text-gray-400 pt-2 border-t border-gray-600">
          <p>Calculation method: {emissionsData.co2e_calculation_method}</p>
          <p className="mt-1">May contain information from OpenStreetMap</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmissionsReport;