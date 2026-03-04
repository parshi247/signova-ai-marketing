import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';

export interface AddressParts {
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (parts: AddressParts) => void;
  placeholder?: string;
  hasError?: boolean;
  tabIndex?: number;
}

interface NominatimResult {
  place_id: number;
  osm_id: number;
  osm_type: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country_code?: string;
    country?: string;
  };
}

const NOMINATIM_SEARCH = 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_LOOKUP = 'https://nominatim.openstreetmap.org/lookup';

const SUPPORTED_COUNTRY_CODES = ['US','CA','GB','AU','DE','FR','NL','SE','NO','DK','FI','CH','AT','BE','IE','NZ','SG','IN','JP','BR','MX'];

/**
 * Fetches the precise postcode for a specific OSM object using Nominatim lookup.
 * This is more accurate than the search endpoint for postal codes.
 */
async function fetchPrecisePostcode(osmType: string, osmId: number): Promise<string | null> {
  try {
    const osmRef = `${osmType.charAt(0).toUpperCase()}${osmId}`;
    const params = new URLSearchParams({
      osm_ids: osmRef,
      format: 'json',
      addressdetails: '1',
    });
    const res = await fetch(`${NOMINATIM_LOOKUP}?${params}`, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'SignovaAI/1.0 (checkout)' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data[0] && data[0].address?.postcode) {
      return data[0].address.postcode;
    }
  } catch {
    // Silently fail — caller will use original postcode
  }
  return null;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = 'Start typing your address...',
  hasError = false,
  tabIndex,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQueryRef = useRef('');
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 4) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (query === lastQueryRef.current) return;
    lastQueryRef.current = query;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '6',
        // Use 'address' feature type for better postal code accuracy
        // (includes house numbers with correct postcodes)
        featuretype: 'house',
        // Also search for postal addresses
        dedupe: '1',
      });
      const response = await fetch(`${NOMINATIM_SEARCH}?${params}`, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'SignovaAI/1.0 (checkout)' },
      });
      if (!response.ok) throw new Error('Nominatim error');
      const data: NominatimResult[] = await response.json();
      
      // If no house-level results, try broader search
      if (data.length === 0) {
        const params2 = new URLSearchParams({
          q: query,
          format: 'json',
          addressdetails: '1',
          limit: '6',
        });
        const response2 = await fetch(`${NOMINATIM_SEARCH}?${params2}`, {
          headers: { 'Accept-Language': 'en', 'User-Agent': 'SignovaAI/1.0 (checkout)' },
        });
        if (response2.ok) {
          const data2: NominatimResult[] = await response2.json();
          setSuggestions(data2);
          setShowSuggestions(data2.length > 0);
          setActiveSuggestion(-1);
          return;
        }
      }
      
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
      setActiveSuggestion(-1);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  }, [onChange, fetchSuggestions]);

  const selectSuggestion = useCallback(async (result: NominatimResult) => {
    const addr = result.address;
    const houseNumber = addr.house_number || '';
    const road = addr.road || '';
    const addressLine1 = houseNumber ? `${houseNumber} ${road}`.trim() : road || result.display_name.split(',')[0];
    const city = addr.city || addr.town || addr.village || addr.municipality || addr.suburb || addr.county || '';
    const state = addr.state || '';
    let zip = addr.postcode || '';
    const countryCode = (addr.country_code || 'us').toUpperCase();
    const country = SUPPORTED_COUNTRY_CODES.includes(countryCode) ? countryCode : 'OTHER';

    // For house-level results, fetch precise postcode via lookup endpoint
    // This significantly improves postal code accuracy for Canada and other countries
    if (result.osm_type && result.osm_id && houseNumber) {
      const preciseZip = await fetchPrecisePostcode(result.osm_type, result.osm_id);
      if (preciseZip) {
        zip = preciseZip;
      }
    }

    onAddressSelect({ addressLine1, city, state, zip, country });
    onChange(addressLine1);
    setSuggestions([]);
    setShowSuggestions(false);
  }, [onChange, onAddressSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeSuggestion]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, [showSuggestions, suggestions, activeSuggestion, selectSuggestion]);

  const handleContainerBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current && containerRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    setShowSuggestions(false);
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  return (
    <div ref={containerRef} className="relative" onBlur={handleContainerBlur}>
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`h-11 pr-8 ${hasError ? 'border-red-400 focus:ring-red-400' : ''}`}
          autoComplete="off"
          tabIndex={tabIndex}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => {
            const addr = suggestion.address;
            const houseNum = addr.house_number || '';
            const road = addr.road || '';
            const city = addr.city || addr.town || addr.village || addr.municipality || '';
            const state = addr.state || '';
            const zip = addr.postcode || '';
            const country = addr.country || '';

            const primaryLine = houseNum ? `${houseNum} ${road}`.trim() : road || suggestion.display_name.split(',')[0];
            const secondaryLine = [city, state, zip, country].filter(Boolean).join(', ');

            return (
              <li
                key={suggestion.place_id}
                role="option"
                aria-selected={index === activeSuggestion}
                className={`px-4 py-3 cursor-pointer border-b border-slate-50 last:border-0 transition-colors ${
                  index === activeSuggestion ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(suggestion);
                }}
              >
                <p className="text-sm font-medium text-slate-900 truncate">{primaryLine}</p>
                {secondaryLine && (
                  <p className="text-xs text-slate-500 truncate mt-0.5">{secondaryLine}</p>
                )}
              </li>
            );
          })}
          <li className="px-4 py-2 text-xs text-slate-400 text-right bg-slate-50">
            Powered by OpenStreetMap · Postal code may need correction
          </li>
        </ul>
      )}
    </div>
  );
}
