import * as Cesium from 'cesium/Cesium';

/**
 * Draw a trip route on the Cesium globe
 * @param {Object} viewer - Cesium viewer instance
 * @param {Array} route - Route data from Climatiq API response
 * @returns {Object} - Object containing the created entities
 */
export const drawTripRoute = (viewer, route) => {
  if (!viewer || !route || !Array.isArray(route)) {
    console.error('Invalid parameters for drawing route');
    return null;
  }
  
  // Clear existing entities
  viewer.entities.removeAll();
  
  const locations = route.filter(item => item.type === 'location');
  const legs = route.filter(item => item.type === 'leg');
  const entities = { points: [], paths: [] };
  
  // Create point entities for locations
  locations.forEach((location) => {
    const point = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude),
      point: {
        pixelSize: 12,
        color: Cesium.Color.fromCssColorString('#8c9a9c'),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      },
      label: {
        text: location.name,
        font: '14px sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -10),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
    
    entities.points.push(point);
  });
  
  // Create path entities for route legs
  for (let i = 0; i < locations.length - 1; i++) {
    const startPos = locations[i];
    const endPos = locations[i + 1];
    const legData = legs[i];
    
    // Choose color based on transport mode
    let pathColor;
    switch (legData.transport_mode) {
      case 'road':
        pathColor = Cesium.Color.fromCssColorString('#8c9a9c');
        break;
      case 'rail':
        pathColor = Cesium.Color.fromCssColorString('#60787b');
        break;
      case 'sea':
        pathColor = Cesium.Color.fromCssColorString('#4c5657');
        break;
      case 'air':
        pathColor = Cesium.Color.fromCssColorString('#404444');
        break;
      default:
        pathColor = Cesium.Color.fromCssColorString('#202323');
    }
    
    // Calculate path based on transport mode
    const pathPositions = calculateRoutePath(
      {longitude: startPos.longitude, latitude: startPos.latitude},
      {longitude: endPos.longitude, latitude: endPos.latitude},
      legData.transport_mode
    );
    
    // Create the path entity
    const path = viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(pathPositions),
        width: 5,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: pathColor,
          outlineWidth: 2,
          outlineColor: Cesium.Color.WHITE
        }),
        clampToGround: legData.transport_mode !== 'air'
      },
      label: {
        text: `${legData.transport_mode.toUpperCase()}: ${legData.distance_km.toFixed(1)} km (${legData.co2e} kg CO₂)`,
        font: '12px sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0, -20),
        heightReference: legData.transport_mode === 'air' 
          ? Cesium.HeightReference.NONE 
          : Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
    
    entities.paths.push(path);
  }
  
  // Zoom to the route with padding
  viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 0));
  
  return entities;
};

/**
 * Calculate a realistic route path based on transport mode
 * @param {Object} start - Start location {longitude, latitude}
 * @param {Object} end - End location {longitude, latitude}
 * @param {String} transportMode - Transport mode (road, rail, sea, air)
 * @returns {Array} - Array of coordinates for the route
 */
export const calculateRoutePath = (start, end, transportMode = 'road') => {
  const positions = [];
  const steps = 50; // Increase number of points for smoother curves
  
  // Calculate the great circle distance
  const startRadians = [Cesium.Math.toRadians(start.longitude), Cesium.Math.toRadians(start.latitude)];
  const endRadians = [Cesium.Math.toRadians(end.longitude), Cesium.Math.toRadians(end.latitude)];
  
  // Determine path shape based on transport mode
  let maxHeight = 0;
  switch(transportMode) {
    case 'air':
      // Higher curve for air routes
      maxHeight = 0.3;
      break;
    case 'sea':
      // Slight curve for sea routes
      maxHeight = 0.05;
      break;
    case 'rail':
      // Small curve for rail
      maxHeight = 0.02;
      break;
    case 'road':
    default:
      // Almost straight line with minimal curve for roads
      maxHeight = 0.01;
      break;
  }
  
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    
    // Spherical linear interpolation for more accurate path
    const t = fraction;
    
    // Simple linear interpolation for longitude and latitude
    const longitude = start.longitude + (end.longitude - start.longitude) * t;
    const latitude = start.latitude + (end.latitude - start.latitude) * t;
    
    // Add curve based on transport mode
    let curvedLatitude = latitude;
    if (transportMode === 'air') {
      // For air transport, add vertical curve
      const height = Math.sin(fraction * Math.PI) * maxHeight;
      curvedLatitude = latitude + height;
    } else {
      // For other transport modes, add smaller curve
      const height = Math.sin(fraction * Math.PI) * maxHeight;
      curvedLatitude = latitude + height;
    }
    
    positions.push(longitude, curvedLatitude);
  }
  
  return positions;
};

export default {
  drawTripRoute,
  calculateRoutePath
};