import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Label } from './ui/label'
import { Input } from './ui/input'
import LegItem from './LegItem'
import LegForm from './LegForm'
import EmissionsReport from './EmissionsReport'
import climatiqApi from '../services/climatiqApi'
import cesiumUtils from '../services/cesiumUtils'
import { Plus, BarChart2, Leaf, ChevronRight } from 'lucide-react'

const TripLegsPanel = ({ viewer }) => {
  const [legs, setLegs] = useState([])
  const [editingLeg, setEditingLeg] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [totalEmissions, setTotalEmissions] = useState(0)
  const [cargoWeight, setCargoWeight] = useState(10)
  const [emissionsReport, setEmissionsReport] = useState(null)
  const [showReport, setShowReport] = useState(false)

  // Handle adding a new leg
  const handleAddLeg = () => {
    setEditingLeg(null)
    setIsFormOpen(true)
  }

  // Handle editing an existing leg
  const handleEditLeg = (leg) => {
    setEditingLeg(leg)
    setIsFormOpen(true)
  }

  // Handle deleting a leg
  const handleDeleteLeg = (legId) => {
    setLegs(legs.filter(leg => leg.id !== legId))
  }

  // Handle saving a leg (both new and edited)
  const handleSaveLeg = (legData) => {
    if (editingLeg) {
      // Update existing leg
      setLegs(legs.map(leg => 
        leg.id === editingLeg.id ? { ...legData, id: leg.id } : leg
      ))
    } else {
      // Add new leg
      const newLeg = {
        ...legData,
        id: Date.now().toString(), // Simple unique ID
      }
      setLegs([...legs, newLeg])
    }
    setIsFormOpen(false)
  }

  // Handle canceling leg form
  const handleCancelLegForm = () => {
    setIsFormOpen(false)
  }
  
  // Handle cargo weight change
  const handleCargoWeightChange = (weight) => {
    setCargoWeight(weight)
  }

  // Method to generate route API payload for Climatiq
  const generateClimatePayload = () => {
    if (legs.length === 0) return null
    
    // Format legs into Climatiq API format
    const route = []
    
    // Add first location
    route.push({
      location: { query: legs[0].from }
    })
    
    // Add all legs and destinations
    legs.forEach(leg => {
      // Add transport leg
      route.push({
        transport_mode: leg.transport_mode,
        leg_details: leg.leg_details
      })
      
      // Add destination location
      route.push({
        location: { query: leg.to }
      })
    })
    
    return {
      route: route,
      cargo: {
        weight: cargoWeight,
        weight_unit: "t"
      }
    }
  }

  // Calculate emissions and draw route when legs change
  useEffect(() => {
    // In a real implementation, this would make an API call to Climatiq
    const calculateEmissionsAndDrawRoute = async () => {
      if (legs.length === 0) {
        setTotalEmissions(0);
        if (viewer) {
          viewer.entities.removeAll();
        }
        return;
      }
      
      // Placeholder calculation - in real app, would call Climatiq API
      const calculatedEmissions = legs.reduce((sum) => sum + Math.random() * 500 + 100, 0);
      setTotalEmissions(calculatedEmissions.toFixed(2));
      
      // Generate payload and draw route
      const payload = generateClimatePayload();
      if (payload && viewer) {
        const response = await climatiqApi.generateMockEmissionsResponse(payload);
        cesiumUtils.drawTripRoute(viewer, response.route);
      }
    }
    
    calculateEmissionsAndDrawRoute();
  }, [legs, cargoWeight, viewer])
  
  // Handle generating emissions report
  const handleGenerateReport = async () => {
    const payload = generateClimatePayload();
    if (!payload) return;
    
    // In a real app, this would call the actual API
    // For demo purposes, we'll use the mock response
    const response = await climatiqApi.generateMockEmissionsResponse(payload);
    setEmissionsReport(response);
    setShowReport(true);
  };
  
  // Close the emissions report
  const handleCloseReport = () => {
    setShowReport(false);
  };

  return (
    <div className="fixed left-4 top-4 z-10 w-auto" style={{ width: "550px" }}>
      {isFormOpen ? (
        <div style={{ width: "550px" }}>
          <LegForm 
            legData={editingLeg} 
            onSave={handleSaveLeg} 
            onCancel={handleCancelLegForm} 
          />
        </div>
      ) : (
        <>
          {showReport && (
            <EmissionsReport 
              emissionsData={emissionsReport} 
              onClose={handleCloseReport} 
            />
          )}
          <Card className="shadow-lg modern-card">
            <CardHeader className="py-3 px-4 border-b border-gray-600">
              <CardTitle className="text-lg flex justify-between items-center text-white">
                <div className="flex items-center">
                  <Leaf className="mr-2 text-gray-300" size={20} />
                  <span>Carbon Calculator</span>
                </div>
                <Button 
                  size="sm"
                  onClick={handleAddLeg}
                  className="bg-gray-600 hover:bg-gray-500 text-white"
                >
                  <Plus size={16} className="mr-2" /> Add Leg
                </Button>
              </CardTitle>
            </CardHeader>
          
            <CardContent className="p-0">
              {legs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground px-4">
                  <p className="font-medium text-white">No trip legs added yet</p>
                  <p className="text-sm mt-2 text-gray-400">Click "Add Leg" to start planning your trip</p>
                </div>
              ) : (
                <div>
                  <div className="mx-4 mb-4 bg-gray-700 p-4 rounded-md border border-gray-600 mt-4">
                    <h3 className="text-sm font-medium text-white flex items-center">
                      <Leaf className="mr-2" size={16} />
                      Estimated Emissions
                    </h3>
                    <p className="text-2xl font-bold text-white">{totalEmissions} kg CO₂e</p>
                    <p className="text-xs text-gray-400 mt-1">Based on {legs.length} legs and {cargoWeight} tonnes cargo</p>
                  </div>
                  
                  <div className="px-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Label htmlFor="cargo-weight" className="text-sm block mb-1 text-white">
                          Cargo Weight (tonnes)
                        </Label>
                        <Input
                          id="cargo-weight"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={cargoWeight}
                          onChange={(e) => setCargoWeight(parseFloat(e.target.value))}
                          className="w-full bg-gray-800 text-white"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCargoWeightChange(cargoWeight)}
                        className="mt-6"
                        variant="outline"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  <div className="px-4 mb-2">
                    <h3 className="modern-header">
                      <ChevronRight className="mr-1 text-gray-300" size={16} />
                      Trip Legs ({legs.length})
                    </h3>
                    <ScrollArea className="h-64 custom-scrollbar">
                      {legs.map(leg => (
                        <LegItem 
                          key={leg.id}
                          leg={leg}
                          onEdit={handleEditLeg}
                          onDelete={handleDeleteLeg}
                        />
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              )}
            </CardContent>
          
            {legs.length > 0 && (
              <CardFooter className="py-3 px-4 flex justify-center border-t border-gray-600">
                <Button 
                  variant="default" 
                  onClick={handleGenerateReport}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white"
                >
                  <BarChart2 size={16} className="mr-2" /> Generate Report
                </Button>
              </CardFooter>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

export default TripLegsPanel