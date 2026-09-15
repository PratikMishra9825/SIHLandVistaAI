import type { SearchLocationResult } from '../types/parcelIntelligence';

// Popular Indian agro-industrial & renewable energy presets for instant one-click testing
export const POPULAR_LOCATION_PRESETS: SearchLocationResult[] = [
  {
    id: 'preset-solapur',
    displayName: 'Solapur, Maharashtra, India',
    shortName: 'Solapur (Agri & Solar Belt)',
    lat: 17.6599,
    lng: 75.9064,
    type: 'district'
  },
  {
    id: 'preset-pavagada',
    displayName: 'Pavagada Solar Park, Tumakuru, Karnataka, India',
    shortName: 'Pavagada (Ultra Mega Solar Park)',
    lat: 14.2818,
    lng: 77.2697,
    type: 'solar_park'
  },
  {
    id: 'preset-bhadla',
    displayName: 'Bhadla Solar Park, Phalodi, Rajasthan, India',
    shortName: 'Bhadla (World Largest Solar Hub)',
    lat: 27.5386,
    lng: 71.9167,
    type: 'solar_park'
  },
  {
    id: 'preset-nashik',
    displayName: 'Dindori Agricultural Zone, Nashik, Maharashtra, India',
    shortName: 'Nashik (Horticulture & Vineyards)',
    lat: 20.2036,
    lng: 73.8344,
    type: 'agricultural'
  },
  {
    id: 'preset-chakan',
    displayName: 'Chakan Industrial Corridor, Pune, Maharashtra, India',
    shortName: 'Chakan (Logistics & Auto Hub)',
    lat: 18.7606,
    lng: 73.8567,
    type: 'industrial'
  },
  {
    id: 'preset-kutch',
    displayName: 'Khavda Hybrid Renewable Energy Park, Kutch, Gujarat, India',
    shortName: 'Kutch Khavda (Hybrid Wind-Solar)',
    lat: 23.8343,
    lng: 69.7282,
    type: 'renewable'
  }
];

/**
 * Parses coordinate string like "17.6599, 75.9064" or "17.6599N 75.9064E"
 */
export const parseCoordinatesQuery = (query: string): { lat: number; lng: number } | null => {
  const clean = query.replace(/[°NSEW]/gi, ' ').trim();
  const parts = clean.split(/[,;\s]+/).filter(Boolean);
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }
  return null;
};

/**
 * Search locations using OpenStreetMap Nominatim with local presets
 */
export const searchLocations = async (query: string): Promise<SearchLocationResult[]> => {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return POPULAR_LOCATION_PRESETS.slice(0, 4);
  }

  // Check if query is direct lat/lng coordinates
  const coordMatch = parseCoordinatesQuery(trimmed);
  if (coordMatch) {
    return [
      {
        id: `coord-${coordMatch.lat}-${coordMatch.lng}`,
        displayName: `Coordinates: ${coordMatch.lat.toFixed(5)}°N, ${coordMatch.lng.toFixed(5)}°E`,
        shortName: `${coordMatch.lat.toFixed(4)}°N, ${coordMatch.lng.toFixed(4)}°E`,
        lat: coordMatch.lat,
        lng: coordMatch.lng,
        type: 'coordinate'
      }
    ];
  }

  // Match local presets first
  const matchedPresets = POPULAR_LOCATION_PRESETS.filter(
    (p) =>
      p.displayName.toLowerCase().includes(trimmed.toLowerCase()) ||
      p.shortName.toLowerCase().includes(trimmed.toLowerCase())
  );

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      trimmed
    )}&format=json&addressdetails=1&limit=6&countrycodes=in`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const nominatimResults: SearchLocationResult[] = data.map((item: any, idx: number) => ({
        id: `osm-${item.place_id || idx}`,
        displayName: item.display_name,
        shortName: item.name || item.display_name.split(',')[0],
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type || 'place',
        boundingbox: item.boundingbox
      }));

      // Combine presets + nominatim
      const combined = [...matchedPresets, ...nominatimResults];
      // Deduplicate by proximity
      return combined.filter(
        (v, i, a) => a.findIndex((t) => Math.abs(t.lat - v.lat) < 0.01 && Math.abs(t.lng - v.lng) < 0.01) === i
      );
    }
  } catch (e) {
    // Network / timeout fallback
  }

  return matchedPresets.length > 0 ? matchedPresets : POPULAR_LOCATION_PRESETS;
};
