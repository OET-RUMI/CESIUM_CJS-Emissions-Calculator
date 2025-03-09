import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { searchLocations } from '../services/geocodingService';

const AutocompleteInput = ({ 
  id, 
  label, 
  placeholder = "Search for a location", 
  value = "", 
  onChange, 
  required = false, 
  className = ""
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Update search results when input changes
  useEffect(() => {
    if (!showSuggestions) return;
    
    const fetchSuggestions = async () => {
      if (inputValue.trim().length < 1) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchLocations(inputValue);
        setSuggestions(results);
        console.log('Fetched suggestions:', results.length);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Reduce debounce delay to make it feel more responsive
    const debounce = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounce);
  }, [inputValue, showSuggestions]);

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    
    // If value is empty, clear suggestions
    if (!value.trim()) {
      setSuggestions([]);
    }
  };

  // Handle selection
  const handleSelect = (suggestion) => {
    setInputValue(suggestion.formattedAddress);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Ensure the onChange handler is called with the updated value
    if (onChange) {
      // Create a synthetic event object
      const syntheticEvent = {
        target: {
          name: id,
          value: suggestion.formattedAddress
        }
      };
      // Use setTimeout to ensure state update completes first
      setTimeout(() => onChange(syntheticEvent), 0);
    }
  };

  // Handle input blur
  const handleBlur = () => {};

  // Handle input focus
  const handleFocus = () => {
    if (inputValue.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={className}>
      {label && <Label htmlFor={id} className="text-sm mb-1 block text-white">{label}</Label>}
      <div className="relative min-h-10">
      <Input
        ref={inputRef}
        id={id}
        name={id}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (onChange) {
              onChange({
                target: {
                  name: id,
                  value: inputValue
                }
              });
            }
            setShowSuggestions(false);
          }
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        className="w-full bg-gray-800 text-white transition-all duration-200"
        style={{width: "100%", boxSizing: "border-box"}}
        autoComplete="off"
      />
        
        {showSuggestions && suggestions.length > 0 && (
          <ul 
            ref={suggestionsRef}
            className="absolute z-50 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg mt-1 max-h-60 overflow-auto"
            style={{ position: "absolute", width: "100%" }}
          >
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion.id}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.formattedAddress}
              </li>
            ))}
          </ul>
        )}
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="animate-spin inline-block h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutocompleteInput;