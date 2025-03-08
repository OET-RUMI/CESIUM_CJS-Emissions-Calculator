// Service for interacting with the Climatiq API
import { getLocationCoordinates } from './geocodingService';

// Freight Emissions API endpoint
const FREIGHT_API_ENDPOINT = 'https://api.climatiq.io/freight/v2/intermodal';

/**
 * Calculate emissions for an intermodal trip
 * @param {Object} payload - Formatted payload for the Climatiq API
 * @returns {Promise<Object>} - The API response with emissions data
 */
export const calculateEmissions = async (payload) => {
  try {
    // Get API key from window object (set by webpack)
    const CLIMATIQ_API_KEY = window.CLIMATIQ_API_KEY;
    
    if (!CLIMATIQ_API_KEY) {
      console.error('Climatiq API key is not available.');
      return { 
        error: true, 
        message: 'API key not configured. Please set CLIMATIQ_API_KEY in your .env file.' 
      };
    }
    
    const response = await fetch(FREIGHT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to calculate emissions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calculating emissions:', error);
    return {
      error: true,
      message: error.message || 'An error occurred while calculating emissions'
    };
  }
};

/**
 * Format a trip with multiple legs for the Climatiq API
 * @param {Array} legs - Array of trip leg objects
 * @param {Object} cargo - Cargo details (weight and unit)
 * @returns {Object} - Formatted payload for the Climatiq API
 */
export const formatTripPayload = (legs, cargo = { weight: 10, weight_unit: 't' }) => {
  if (!legs || legs.length === 0) {
    throw new Error('At least one trip leg is required');
  }
  
  const route = [];
  
  // Add first location
  route.push({
    location: { query: legs[0].from }
  });
  
  // Add all legs and destinations
  legs.forEach(leg => {
    // Add transport leg
    route.push({
      transport_mode: leg.transport_mode,
      leg_details: leg.leg_details
    });
    
    // Add destination location
    route.push({
      location: { query: leg.to }
    });
  });
  
  return {
    route,
    cargo
  };
};

/**
 * Generate a mock emissions response for testing
 * @param {Object} payload - The API payload that would have been sent
 * @returns {Promise<Object>} - A mock emissions response with accurate coordinates
 */
export const generateMockEmissionsResponse = async (payload) => {
  if (!payload || !payload.route) {
    return { error: true, message: 'Invalid payload' };
  }
  
  // Count the number of legs
  const numLegs = Math.floor((payload.route.length - 1) / 2);
  const cargoWeight = payload.cargo.weight;
  
  // Generate a mock total emissions value
  const totalEmissions = Math.round(numLegs * 250 * cargoWeight);
  
  // Create mock route details with accurate coordinates
  const route = [];
  let distance = 0;
  
  // Process each location and transport leg
  for (let i = 0; i < payload.route.length; i++) {
    const item = payload.route[i];
    
    if (item.location) {
      // Get real coordinates for the location
      const locationName = item.location.query;
      const locationData = await getLocationCoordinates(locationName);
      
      if (locationData) {
        const location = {
          type: "location",
          co2e: 6,
          co2e_unit: "kg",
          name: locationData.formattedName || locationName,
          latitude: locationData.latitude,
          longitude: locationData.longitude
        };
        route.push(location);
      } else {
        // Fallback coordinates if geocoding fails
        route.push({
          type: "location",
          co2e: 6,
          co2e_unit: "kg",
          name: locationName,
          latitude: 40 + Math.random() * 20,
          longitude: -100 + Math.random() * 50
        });
      }
    } else if (item.transport_mode) {
      // For transport legs, calculate a reasonable distance
      // This would be based on the actual coordinates in a real implementation
      const prevLocation = route[route.length - 1];
      let legDistance = 0;
      
      if (i+1 < payload.route.length && payload.route[i+1].location) {
        const nextLocationName = payload.route[i+1].location.query;
        const nextLocationData = await getLocationCoordinates(nextLocationName);
        
        if (prevLocation && nextLocationData) {
          // Calculate approximate distance between coordinates
          const lat1 = prevLocation.latitude;
          const lon1 = prevLocation.longitude;
          const lat2 = nextLocationData.latitude;
          const lon2 = nextLocationData.longitude;
          
          legDistance = calculateDistance(lat1, lon1, lat2, lon2);
        } else {
          legDistance = Math.round(75 + Math.random() * 350);
        }
      } else {
        legDistance = Math.round(75 + Math.random() * 350);
      }
      
      distance += legDistance;
      
      const transportCo2e = Math.round(legDistance * cargoWeight * 0.8);
      
      const leg = {
        type: "leg",
        co2e: transportCo2e,
        vehicle_operation_co2e: Math.round(transportCo2e * 0.75),
        vehicle_energy_provision_co2e: Math.round(transportCo2e * 0.25),
        transport_mode: item.transport_mode,
        distance_km: legDistance
      };
      route.push(leg);
    }
  }
  
  return {
    co2e: totalEmissions,
    hub_equipment_co2e: Math.round(numLegs * 12),
    vehicle_operation_co2e: Math.round(totalEmissions * 0.75),
    vehicle_energy_provision_co2e: Math.round(totalEmissions * 0.25),
    co2e_unit: "kg",
    co2e_calculation_method: "ipcc_ar6_gwp100",
    cargo_tonnes: cargoWeight,
    distance_km: distance,
    route: route
  };
};

/**
 * Calculate approximate distance between two points in kilometers
 * Uses the Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return Math.round(distance);
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

export default {
  calculateEmissions,
  formatTripPayload,
  generateMockEmissionsResponse
};