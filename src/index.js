import React from 'react';
import { createRoot } from 'react-dom/client';
import TripPlanner from './components/TripPlanner';
var Cesium = require('cesium/Cesium')

// Import CSS
import './css/main.css';
import 'cesium/Widgets/widgets.css';

// Verify that the Cesium Ion access token is defined
let CESIUM_ION_ACCESS_TOKEN = window.CESIUM_ION_ACCESS_TOKEN;

if (!CESIUM_ION_ACCESS_TOKEN || CESIUM_ION_ACCESS_TOKEN === 'your_access_token_here') {
  console.error('Cesium ion access token is not set.');
  CESIUM_ION_ACCESS_TOKEN = undefined;
} else {
  Cesium.Ion.defaultAccessToken = CESIUM_ION_ACCESS_TOKEN;
}

// Initialize the Cesium viewer
var viewer = new Cesium.Viewer('cesiumContainer', {
  // Hide timeline and animation widgets
  animation: false,
  timeline: false,
  // Improve UI experience
  baseLayerPicker: true,
  geocoder: true,
  navigationHelpButton: false,
  sceneModePicker: true,
  homeButton: true,
  fullscreenButton: true
});

// Make the viewer globally accessible for the React components
window.cesiumViewer = viewer;

// Create a container for React components
const appContainer = document.createElement('div');
appContainer.id = 'app-container';
document.body.appendChild(appContainer);

// Mount React components
const root = createRoot(appContainer);
root.render(<TripPlanner />);

// Add event listener to handle window resize
window.addEventListener('resize', function() {
  viewer.resize();
});