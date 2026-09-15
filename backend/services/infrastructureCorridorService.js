/**
 * LANDVISTA AI — AUTHORITATIVE INFRASTRUCTURE CORRIDOR SERVICE (BACKEND)
 * Evaluates real, verified national and state infrastructure corridors in India
 * based strictly on geodesic coordinates (Haversine formula).
 * Uses simple, everyday conversational sentences.
 */

export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export const VERIFIED_NATIONAL_CORRIDORS = [
  {
    id: 'corridor-samruddhi',
    name: 'Samruddhi Mahamarg (Mumbai-Nagpur Expressway)',
    category: 'Transport & Highway',
    authority: 'MSRDC / MoRTH Official Master Plan',
    source: 'MSRDC Express Highway Cadastre',
    status: 'EXISTING',
    lastUpdated: 'January 2026',
    description: '701 km access-controlled expressway connecting Maharashtra districts to JNPA port.',
    simpleImpact: 'Being close to this major expressway helps farm products and goods reach major ports and cities much faster.',
    boosts: { warehouse: 12, industrial: 10, commercial: 6 },
    nodes: [
      { name: 'Nagpur Node', lat: 21.0145, lng: 79.0234 },
      { name: 'Wardha Interchange', lat: 20.7453, lng: 78.5980 },
      { name: 'Amravati Access', lat: 20.9320, lng: 77.7523 },
      { name: 'Aurangabad / Jalna Node', lat: 19.8762, lng: 75.3433 },
      { name: 'Nashik / Igatpuri Hub', lat: 19.9975, lng: 73.7898 },
      { name: 'Thane / Bhiwandi Terminal', lat: 19.2965, lng: 73.0631 }
    ]
  },
  {
    id: 'corridor-pune-ring-road',
    name: 'Pune Ring Road & Metro Line 3 Corridor',
    category: 'Transport & Highway',
    authority: 'PMRDA & MSRDC Regional Plan',
    source: 'PMRDA Gazette Notification',
    status: 'UNDER_CONSTRUCTION',
    lastUpdated: 'February 2026',
    description: '128 km ring road connecting Hinjawadi, Chakan, and PCMC nodes.',
    simpleImpact: 'This upcoming ring road will make travel and transport around the city much faster, improving access to the land.',
    boosts: { commercial: 12, housing: 10, warehouse: 8 },
    nodes: [
      { name: 'Hinjawadi Western Segment', lat: 18.5913, lng: 73.7389 },
      { name: 'Chakan Industrial Node', lat: 18.7606, lng: 73.8567 },
      { name: 'Pirangut South Link', lat: 18.5120, lng: 73.6820 }
    ]
  },
  {
    id: 'corridor-wdfc',
    name: 'Western Dedicated Freight Corridor (WDFC)',
    category: 'Rail & Freight',
    authority: 'DFCCIL / Ministry of Railways',
    source: 'DFCCIL Master Plan',
    status: 'EXISTING',
    lastUpdated: 'November 2025',
    description: '1,504 km dedicated electrified train line for freight transport.',
    simpleImpact: 'Having a dedicated freight railway line nearby makes it much easier to ship heavy containers and agricultural goods.',
    boosts: { warehouse: 15, industrial: 12, agro_processing: 8 },
    nodes: [
      { name: 'JNPT Freight Terminal', lat: 18.9500, lng: 72.9500 },
      { name: 'Surat Cargo Junction', lat: 21.1702, lng: 72.8311 },
      { name: 'Vadodara Hub', lat: 22.3072, lng: 73.1812 },
      { name: 'Palanpur / Marwar Node', lat: 24.1724, lng: 72.4346 },
      { name: 'Rewari Intermodal Depot', lat: 28.1920, lng: 76.6180 }
    ]
  },
  {
    id: 'corridor-nh52-nh65',
    name: 'National Highway NH-52 / NH-65 Corridor',
    category: 'Transport & Highway',
    authority: 'NHAI / MoRTH Corridor Grid',
    source: 'NHAI Bharatmala Network',
    status: 'EXISTING',
    lastUpdated: 'December 2025',
    description: '4-lane highway connecting Western Maharashtra to Karnataka and Telangana.',
    simpleImpact: 'Having a national highway nearby provides easy road access to transport farm produce and commercial goods across state lines.',
    boosts: { warehouse: 10, commercial: 8, agriculture: 4 },
    nodes: [
      { name: 'Solapur City Junction', lat: 17.6599, lng: 75.9064 },
      { name: 'Mohol Access Point', lat: 17.8100, lng: 75.6500 },
      { name: 'Akkalkot Interchange', lat: 17.5250, lng: 76.2050 }
    ]
  },
  {
    id: 'corridor-bhadla-grid',
    name: 'Bhadla-Bikaner Green Energy Transmission Grid',
    category: 'Power Grid & Substation',
    authority: 'Power Grid Corporation (PGCIL) / CEA',
    source: 'CEA Inter-State Transmission Scheme',
    status: 'EXISTING',
    lastUpdated: 'October 2025',
    description: '765kV high-capacity electrical transmission network.',
    simpleImpact: 'Having high-capacity power lines nearby makes it much easier to connect solar power systems to the electric grid.',
    boosts: { solar: 15 },
    nodes: [
      { name: 'Bhadla Substation Hub', lat: 27.5380, lng: 71.9120 },
      { name: 'Bikaner Pooling Substation', lat: 28.0229, lng: 73.3119 }
    ]
  },
  {
    id: 'corridor-nashik-agro',
    name: 'Nashik-Dindori Agro-Export Corridor (NH-848)',
    category: 'Transport & Highway',
    authority: 'MoRTH / Maharashtra PWD',
    source: 'State Highway Master Plan',
    status: 'EXISTING',
    lastUpdated: 'January 2026',
    description: 'Main transit road serving onion, grape, and fruit clusters.',
    simpleImpact: 'Direct road access to major agricultural wholesale mandis in Nashik and Mumbai.',
    boosts: { agriculture: 12, agro_processing: 10, warehouse: 8 },
    nodes: [
      { name: 'Dindori Mandi Node', lat: 20.1984, lng: 73.8342 },
      { name: 'Nashik APMC Terminal', lat: 19.9975, lng: 73.7898 }
    ]
  },
  {
    id: 'corridor-ne7',
    name: 'Bengaluru-Chennai Expressway (NE-7)',
    category: 'Transport & Highway',
    authority: 'NHAI / MoRTH Expressways',
    source: 'NHAI Official Project Portal',
    status: 'UNDER_CONSTRUCTION',
    lastUpdated: 'January 2026',
    description: '262 km 4-lane expressway connecting Karnataka and Tamil Nadu.',
    simpleImpact: 'This upcoming highway will significantly reduce travel time to major tech hubs and industrial ports.',
    boosts: { warehouse: 12, industrial: 12, commercial: 8 },
    nodes: [
      { name: 'Hoskote Terminal', lat: 13.0710, lng: 77.7980 },
      { name: 'Malur Node', lat: 13.0030, lng: 77.9400 },
      { name: 'Bangarapet Link', lat: 12.9800, lng: 78.2000 },
      { name: 'Sriperumbudur Hub', lat: 12.9700, lng: 79.9400 }
    ]
  },
  {
    id: 'corridor-ne4',
    name: 'Delhi-Mumbai Expressway (NE-4)',
    category: 'Transport & Highway',
    authority: 'NHAI / MoRTH National Expressways',
    source: 'NHAI Master Corridor Register',
    status: 'EXISTING',
    lastUpdated: 'February 2026',
    description: '1,386 km 8-lane expressway connecting Delhi NCR to Mumbai.',
    simpleImpact: 'Cuts driving time between northern and western economic centers, making transport very convenient.',
    boosts: { warehouse: 15, industrial: 12, commercial: 10 },
    nodes: [
      { name: 'Sohna / Gurgaon Terminal', lat: 28.2470, lng: 77.0600 },
      { name: 'Dausa / Jaipur Node', lat: 26.8900, lng: 76.3300 },
      { name: 'Kota / Mukundara Section', lat: 25.1800, lng: 75.8300 },
      { name: 'Ratlam Junction', lat: 23.3300, lng: 75.0400 },
      { name: 'Vadodara Interchange', lat: 22.3100, lng: 73.1800 },
      { name: 'Virar / JNPA Link', lat: 19.4700, lng: 72.8000 }
    ]
  }
];

export function findVerifiedCorridorsForCoordinates(lat, lng, maxRadiusKm = 30.0) {
  const matchedCorridors = [];

  VERIFIED_NATIONAL_CORRIDORS.forEach((corridor) => {
    let minDistance = Infinity;
    let closestNode = corridor.nodes[0];

    corridor.nodes.forEach((node) => {
      const dist = calculateHaversineDistanceKm(lat, lng, node.lat, node.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestNode = node;
      }
    });

    if (minDistance <= maxRadiusKm) {
      matchedCorridors.push({
        id: corridor.id,
        name: `${corridor.name} (${closestNode.name})`,
        category: corridor.category,
        authority: corridor.authority,
        source: corridor.source,
        status: corridor.status,
        lastUpdatedDate: corridor.lastUpdated,
        distanceKm: minDistance,
        impactOnLand: `➡️ ${corridor.simpleImpact}`,
        boosts: corridor.boosts || {}
      });
    }
  });

  matchedCorridors.sort((a, b) => a.distanceKm - b.distanceKm);
  return matchedCorridors;
}
