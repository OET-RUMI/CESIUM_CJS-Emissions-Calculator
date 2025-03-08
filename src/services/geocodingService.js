/**
 * A simple geocoding service using Nominatim (OpenStreetMap)
 * This provides location search with proper coordinates
 */

// Base URL for Nominatim API
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// Cache for geocoding results to reduce API calls
const geocodeCache = {};

/**
 * Search for locations based on a query string
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of matching locations
 */
export const searchLocations = async (query) => {
  if (!query || query.trim().length < 1) {
    return [];
  }
  
  // Check cache first
  if (geocodeCache[query]) {
    return geocodeCache[query];
  }
  
  try {
    // Add cache-busting parameter to prevent caching issues
    const cacheBuster = new Date().getTime();
    const response = await fetch(
      `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(query)}&limit=5&_=${cacheBuster}`,
      {
        headers: {
          // Add user agent as required by Nominatim usage policy
          'User-Agent': 'CarbonEmissionsCalculator/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    console.log('Geocoding results for:', query, data);
    
    // Format the results to match our needs
    const results = data.map(item => ({
      id: item.place_id,
      name: item.display_name,
      formattedAddress: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon)
    }));
    
    // Cache the results
    geocodeCache[query] = results;
    
    return results;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

/**
 * Get coordinates for a specific location
 * @param {string} locationName - Name of the location to geocode
 * @returns {Promise<Object>} - Location object with coordinates
 */
export const getLocationCoordinates = async (locationName) => {
  if (!locationName) {
    return null;
  }
  
  try {
    const results = await searchLocations(locationName);
    if (results && results.length > 0) {
      return {
        name: locationName,
        formattedName: results[0].name,
        latitude: results[0].latitude,
        longitude: results[0].longitude
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
};

export default {
  searchLocations,
  getLocationCoordinates,
};