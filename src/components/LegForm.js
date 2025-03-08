import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectOption } from './ui/select'
import AutocompleteInput from './AutocompleteInput'
import { Save, X, MapPin, Truck, Train, Ship, Plane } from 'lucide-react'

const transportIcons = {
  road: <Truck size={18} />,
  rail: <Train size={18} />,
  sea: <Ship size={18} />,
  air: <Plane size={18} />
}

const LegForm = ({ legData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    from: '',
    to: '',
    transport_mode: 'road',
    leg_details: {
      rest_of_world: {
        vehicle_type: 'van',
        vehicle_weight: 'lte_3.5t',
        fuel_source: 'diesel',
        load_type: 'light'
      },
      north_america: {
        vehicle_type: 'van'
      },
      sea: {
        vessel_type: 'container'
      },
      air: {
        aircraft_type: 'freighter'
      },
      rail: {
        fuel_source: 'diesel',
        load_type: 'container'
      }
    }
  })

  // Initialize form data if editing existing leg
  useEffect(() => {
    if (legData) {
      setFormData({
        ...legData,
        // Ensure all required structures exist
        leg_details: {
          rest_of_world: {
            vehicle_type: legData.leg_details?.rest_of_world?.vehicle_type || 'van',
            vehicle_weight: legData.leg_details?.rest_of_world?.vehicle_weight || 'lte_3.5t',
            fuel_source: legData.leg_details?.rest_of_world?.fuel_source || 'diesel',
            load_type: legData.leg_details?.rest_of_world?.load_type || 'light'
          },
          north_america: {
            vehicle_type: legData.leg_details?.north_america?.vehicle_type || 'van'
          },
          sea: {
            vessel_type: legData.leg_details?.sea?.vessel_type || 'container'
          },
          air: {
            aircraft_type: legData.leg_details?.air?.aircraft_type || 'freighter'
          },
          rail: {
            fuel_source: legData.leg_details?.rail?.fuel_source || 'diesel',
            load_type: legData.leg_details?.rail?.load_type || 'container'
          }
        }
      })
    }
  }, [legData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleNestedChange = (category, field, value) => {
    setFormData({
      ...formData,
      leg_details: {
        ...formData.leg_details,
        [category]: {
          ...formData.leg_details[category],
          [field]: value
        }
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  // Define form fields based on transport mode
  const renderTransportModeFields = () => {
    switch(formData.transport_mode) {
      case 'road':
        return (
          // Changed this div's background color to #464b50 (dropdown color)
          <div className="p-4 rounded-md" style={{ backgroundColor: "#2a2e31" }}>
            <div className="mb-4">
              <Label htmlFor="region" className="block mb-1 pl-1 flex items-center text-white">
                <MapPin size={14} className="mr-1 text-gray-300" />
                Region
              </Label>
              <Select 
                id="region" 
                name="region" 
                value={formData.region || 'rest_of_world'} 
                onChange={(e) => handleChange({ target: { name: 'region', value: e.target.value }})}
                className="w-full text-white px-3 py-2 rounded-md"
                style={{
                  width: "100%", 
                  boxSizing: "border-box", 
                  backgroundColor: "#2a2e31", // Changed to match input bg
                  color: "white"
                }}
              >
              <SelectOption value="rest_of_world" style={{ backgroundColor: "#404444", color: "white" }}>Rest of World</SelectOption>
              <SelectOption value="north_america" style={{ backgroundColor: "#404444", color: "white" }}>North America</SelectOption>
              </Select>
            </div>
            
            {formData.region !== 'north_america' ? (
              <>
                <div className="mb-4">
                  <Label htmlFor="vehicle_type" className="block mb-1 pl-1 text-white">Vehicle Type</Label>
                  <Select 
                    id="vehicle_type" 
                    value={formData.leg_details.rest_of_world.vehicle_type} 
                    onChange={(e) => handleNestedChange('rest_of_world', 'vehicle_type', e.target.value)}
                    className="w-full text-white"
                    style={{
                      width: "100%", 
                      boxSizing: "border-box", 
                      backgroundColor: "#2a2e31",
                      color: "white"
                    }}
                  >
                    <SelectOption value="van" style={{ backgroundColor: "#404444", color: "white" }}>Van</SelectOption>
                    <SelectOption value="rigid_truck" style={{ backgroundColor: "#404444", color: "white" }}>Rigid Truck</SelectOption>
                    <SelectOption value="articulated_truck" style={{ backgroundColor: "#404444", color: "white" }}>Articulated Truck</SelectOption>
                  </Select>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="vehicle_weight" className="block mb-1 pl-1 text-white">Vehicle Weight</Label>
                  <Select 
                    id="vehicle_weight" 
                    value={formData.leg_details.rest_of_world.vehicle_weight} 
                    onChange={(e) => handleNestedChange('rest_of_world', 'vehicle_weight', e.target.value)}
                    className="w-full text-white"
                    style={{ 
                      backgroundColor: "#2a2e31", 
                      color: "white" 
                    }}
                  >
                    <SelectOption value="lte_3.5t" style={{ backgroundColor: "#404444", color: "white" }}>≤ 3.5 tonnes</SelectOption>
                    <SelectOption value="gt_3.5t_lte_7.5t" style={{ backgroundColor: "#404444", color: "white" }}>3.5 - 7.5 tonnes</SelectOption>
                    <SelectOption value="gt_7.5t_lte_12t" style={{ backgroundColor: "#404444", color: "white" }}>7.5 - 12 tonnes</SelectOption>
                    <SelectOption value="gt_12t_lte_24t" style={{ backgroundColor: "#404444", color: "white" }}>12 - 24 tonnes</SelectOption>
                    <SelectOption value="gt_24t_lte_40t" style={{ backgroundColor: "#404444", color: "white" }}>24 - 40 tonnes</SelectOption>
                    <SelectOption value="gt_40t_lte_60t" style={{ backgroundColor: "#404444", color: "white" }}>40 - 60 tonnes</SelectOption>
                    <SelectOption value="gt_60t_lte_72t" style={{ backgroundColor: "#404444", color: "white" }}>60 - 72 tonnes</SelectOption>
                  </Select>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="fuel_source" className="block mb-1 pl-1 text-white">Fuel Source</Label>
                  <Select 
                    id="fuel_source" 
                    value={formData.leg_details.rest_of_world.fuel_source} 
                    onChange={(e) => handleNestedChange('rest_of_world', 'fuel_source', e.target.value)}
                    className="w-full text-white"
                    style={{ 
                      backgroundColor: "#2a2e31", 
                      color: "white" 
                    }}
                  >
                    <SelectOption value="diesel" style={{ backgroundColor: "#404444", color: "white" }}>Diesel</SelectOption>
                    <SelectOption value="petrol" style={{ backgroundColor: "#404444", color: "white" }}>Petrol</SelectOption>
                    <SelectOption value="cng" style={{ backgroundColor: "#404444", color: "white" }}>CNG</SelectOption>
                    <SelectOption value="electricity" style={{ backgroundColor: "#404444", color: "white" }}>Electricity</SelectOption>
                  </Select>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="load_type" className="block mb-1 pl-1 text-white">Load Type</Label>
                  <Select 
                    id="load_type" 
                    value={formData.leg_details.rest_of_world.load_type} 
                    onChange={(e) => handleNestedChange('rest_of_world', 'load_type', e.target.value)}
                    className="w-full text-white"
                    style={{ 
                      backgroundColor: "#2a2e31", 
                      color: "white" 
                    }}
                  >
                    <SelectOption value="light" style={{ backgroundColor: "#404444", color: "white" }}>Light</SelectOption>
                    <SelectOption value="heavy" style={{ backgroundColor: "#404444", color: "white" }}>Heavy</SelectOption>
                    <SelectOption value="container" style={{ backgroundColor: "#404444", color: "white" }}>Container</SelectOption>
                  </Select>
                </div>
              </>
            ) : (
              <div className="mb-4">
                <Label htmlFor="na_vehicle_type" className="block mb-1 pl-1 text-white">Vehicle Type</Label>
                <Select 
                  id="na_vehicle_type" 
                  value={formData.leg_details.north_america.vehicle_type} 
                  onChange={(e) => handleNestedChange('north_america', 'vehicle_type', e.target.value)}
                  className="w-full text-white"
                  style={{ 
                    backgroundColor: "#2a2e31", 
                    color: "white" 
                  }}
                >
                  <SelectOption value="van" style={{ backgroundColor: "#404444", color: "white" }}>Van</SelectOption>
                  <SelectOption value="moving" style={{ backgroundColor: "#404444", color: "white" }}>Moving Truck</SelectOption>
                  <SelectOption value="ltl_or_dry_van" style={{ backgroundColor: "#404444", color: "white" }}>LTL or Dry Van</SelectOption>
                </Select>
              </div>
            )}
          </div>
        )
        
      case 'sea':
        return (
          <div className="p-4 rounded-md" style={{ backgroundColor: "#2a2e31" }}>
            <div className="mb-4">
              <Label htmlFor="vessel_type" className="block mb-1 pl-1 flex items-center text-white">
                <Ship size={14} className="mr-1 text-gray-300" />
                Vessel Type
              </Label>
              <Select 
                id="vessel_type" 
                value={formData.leg_details.sea.vessel_type} 
                onChange={(e) => handleNestedChange('sea', 'vessel_type', e.target.value)}
                className="w-full text-white"
                style={{ 
                  backgroundColor: "#2a2e31", 
                  color: "white" 
                }}
              >
                <SelectOption value="container" style={{ backgroundColor: "#404444", color: "white" }}>Container Ship</SelectOption>
                <SelectOption value="bulk_carrier" style={{ backgroundColor: "#404444", color: "white" }}>Bulk Carrier</SelectOption>
                <SelectOption value="oil_tanker" style={{ backgroundColor: "#404444", color: "white" }}>Oil Tanker</SelectOption>
              </Select>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="tonnage" className="block mb-1 pl-1 text-white">Tonnage</Label>
              <Select 
                id="tonnage" 
                value={formData.leg_details.sea.tonnage || 'lt_10dwkt'} 
                onChange={(e) => handleNestedChange('sea', 'tonnage', e.target.value)}
                className="w-full text-white"
                style={{ 
                  backgroundColor: "#2a2e31", 
                  color: "white" 
                }}
              >
                <SelectOption value="lt_10dwkt" style={{ backgroundColor: "#404444", color: "white" }}>&lt; 10,000 DWT</SelectOption>
                <SelectOption value="gte_10dwkt_lt_35dwkt" style={{ backgroundColor: "#404444", color: "white" }}>10,000 - 35,000 DWT</SelectOption>
                <SelectOption value="gte_35dwkt_lt_60dwkt" style={{ backgroundColor: "#404444", color: "white" }}>35,000 - 60,000 DWT</SelectOption>
                <SelectOption value="gte_60dwkt_lt_100dwkt" style={{ backgroundColor: "#404444", color: "white" }}>60,000 - 100,000 DWT</SelectOption>
                <SelectOption value="gte_100dwkt_lt_200dwkt" style={{ backgroundColor: "#404444", color: "white" }}>100,000 - 200,000 DWT</SelectOption>
                <SelectOption value="gte_200dwkt" style={{ backgroundColor: "#404444", color: "white" }}>≥ 200,000 DWT</SelectOption>
              </Select>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="sea_fuel_source" className="block mb-1 pl-1 text-white">Fuel Source</Label>
              <Select 
                id="sea_fuel_source" 
                value={formData.leg_details.sea.fuel_source || 'hfo'} 
                onChange={(e) => handleNestedChange('sea', 'fuel_source', e.target.value)}
                className="w-full text-white"
                style={{ 
                  backgroundColor: "#2a2e31", 
                  color: "white" 
                }}
              >
                <SelectOption value="hfo" style={{ backgroundColor: "#404444", color: "white" }}>HFO</SelectOption>
                <SelectOption value="vlsfo" style={{ backgroundColor: "#404444", color: "white" }}>VLSFO</SelectOption>
                <SelectOption value="mdo" style={{ backgroundColor: "#404444", color: "white" }}>MDO</SelectOption>
              </Select>
            </div>
          </div>
        )
        
      case 'air':
        return (
          <div className="p-4 rounded-md" style={{ backgroundColor: "#2a2e31" }}>
            <div className="mb-4">
              <Label htmlFor="aircraft_type" className="block mb-1 pl-1 flex items-center text-white">
                <Plane size={14} className="mr-1 text-gray-300" />
                Aircraft Type
              </Label>
              <Select 
                id="aircraft_type" 
                value={formData.leg_details.air.aircraft_type} 
                onChange={(e) => handleNestedChange('air', 'aircraft_type', e.target.value)}
                className="w-full text-white"
                style={{ 
                  backgroundColor: "#2a2e31", 
                  color: "white" 
                }}
              >
                <SelectOption value="freighter" style={{ backgroundColor: "#404444", color: "white" }}>Freighter</SelectOption>
                <SelectOption value="belly_freight" style={{ backgroundColor: "#404444", color: "white" }}>Belly Freight</SelectOption>
              </Select>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="radiative_forcing_index" className="block mb-1 pl-1 text-white">Radiative Forcing Index</Label>
              <Input 
                type="number" 
                id="radiative_forcing_index" 
                value={formData.leg_details.air.radiative_forcing_index || 2}
                onChange={(e) => handleNestedChange('air', 'radiative_forcing_index', parseFloat(e.target.value))}
                min="1"
                step="0.1"
                className="w-full text-white"
                style={{ backgroundColor: "#404444" }}
              />
            </div>
          </div>
        )
        
      case 'rail':
        return (
          <div className="p-4 rounded-md" style={{ backgroundColor: "#2a2e31" }}>
            <div className="mb-4">
              <Label htmlFor="rail_fuel_source" className="block mb-1 pl-1 flex items-center text-white">
                <Train size={14} className="mr-1 text-gray-300" />
                Fuel Source
              </Label>
              <Select 
                id="rail_fuel_source" 
                value={formData.leg_details.rail.fuel_source} 
                onChange={(e) => handleNestedChange('rail', 'fuel_source', e.target.value)}
                className="w-full text-white"
                style={{ 
                  backgroundColor: "#2a2e31", 
                  color: "white" 
                }}
              >
                <SelectOption value="diesel" style={{ backgroundColor: "#404444", color: "white" }}>Diesel</SelectOption>
                <SelectOption value="electricity" style={{ backgroundColor: "#404444", color: "white" }}>Electricity</SelectOption>
              </Select>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="rail_load_type" className="block mb-1 pl-1 text-white">Load Type</Label>
              <Select 
                id="rail_load_type" 
                value={formData.leg_details.rail.load_type} 
                onChange={(e) => handleNestedChange('rail', 'load_type', e.target.value)}
                className="w-full text-white"
                style={{ 
                  backgroundColor: "#2a2e31", 
                  color: "white" 
                }}
              >
                <SelectOption value="container" style={{ backgroundColor: "#404444", color: "white" }}>Container</SelectOption>
                <SelectOption value="coal_steel" style={{ backgroundColor: "#404444", color: "white" }}>Coal and Steel</SelectOption>
                <SelectOption value="other" style={{ backgroundColor: "#404444", color: "white" }}>Other</SelectOption>
              </Select>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <Card className="modern-card w-full mx-auto" style={{ width: "100%", maxWidth: "550px", boxSizing: "border-box" }}>
      <CardHeader className="p-4 border-b border-gray-600">
        <CardTitle className="text-lg flex items-center text-white">
          <div className={`transport-icon ${formData.transport_mode}-icon text-white`}>
            {transportIcons[formData.transport_mode]}
          </div>
          <span>
            {legData ? 'Edit Trip Leg' : 'Add New Trip Leg'}
          </span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <CardContent className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden', padding: "16px" }}>
          <div className="mb-4">
            <Label htmlFor="name" className="block mb-1 pl-1 text-white">Leg Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Enter a name for this leg"
              className="w-full text-white bg-gray-800"
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="from" className="block mb-1 pl-1 flex items-center text-white">
              <MapPin size={14} className="mr-1 text-gray-300" />
              From
            </Label>
            <AutocompleteInput 
              id="from" 
              value={formData.from} 
              onChange={handleChange}
              placeholder="Starting location"
              required
              className="w-full autocomplete-input"
              style={{width: "100%", boxSizing: "border-box"}}
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="to" className="block mb-1 pl-1 flex items-center text-white">
              <MapPin size={14} className="mr-1 text-gray-300" />
              To
            </Label>
            <AutocompleteInput 
              id="to" 
              value={formData.to} 
              onChange={handleChange}
              placeholder="Destination"
              required
              className="w-full autocomplete-input"
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="transport_mode" className="block mb-1 pl-1 text-white">Transport Mode</Label>
            <Select 
              id="transport_mode" 
              name="transport_mode" 
              value={formData.transport_mode} 
              onChange={handleChange}
              className="w-full text-white"
              style={{ 
                backgroundColor: "#2a2e31", 
                color: "white" 
              }}
            >
              <SelectOption value="road" style={{ backgroundColor: "#404444", color: "white" }}>Road</SelectOption>
              <SelectOption value="rail" style={{ backgroundColor: "#404444", color: "white" }}>Rail</SelectOption>
              <SelectOption value="sea" style={{ backgroundColor: "#404444", color: "white" }}>Sea</SelectOption>
              <SelectOption value="air" style={{ backgroundColor: "#404444", color: "white" }}>Air</SelectOption>
            </Select>
          </div>
          
          <div className="pt-4 mt-1 border-t border-gray-600">
            {renderTransportModeFields()}
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-4 flex justify-end space-x-2 border-t border-gray-600">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-500 text-gray-300 hover:bg-gray-700"
          >
            <X size={16} className="mr-2" /> Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            <Save size={16} className="mr-2" /> Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default LegForm