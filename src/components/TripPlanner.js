import React, { useEffect, useState } from 'react'
import TripLegsPanel from './TripLegsPanel'

// Main component that wraps all trip planning functionality
const TripPlanner = () => {
  const [viewer, setViewer] = useState(null)
  
  useEffect(() => {
    // Get the Cesium viewer instance that was initialized in index.js
    const cesiumViewer = window.cesiumViewer
    if (cesiumViewer) {
      setViewer(cesiumViewer)
    }
  }, [])
  
  return (
    <div className="cesium-trip-planner">
      <TripLegsPanel viewer={viewer} />
    </div>
  )
}

export default TripPlanner