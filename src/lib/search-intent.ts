/**
 * TradeHind Search Intent Parser & Smart SEO Router
 * Translates natural language queries (e.g. "marble suppliers in udaipur")
 * directly into high-converting Programmatic SEO landing hubs.
 */

import { INITIAL_CATEGORIES } from '@/lib/data-store';

const KNOWN_CITIES: Record<string, string> = {
  udaipur: 'udaipur',
  ahmedabad: 'ahmedabad',
  mumbai: 'mumbai',
  delhi: 'new-delhi',
  'new delhi': 'new-delhi',
  surat: 'surat',
  jaipur: 'jaipur',
  rajkot: 'rajkot',
  bengaluru: 'bengaluru',
  bangalore: 'bengaluru',
  pune: 'pune',
  chennai: 'chennai',
  kolkata: 'kolkata',
  hyderabad: 'hyderabad',
};

const CATEGORY_KEYWORDS: Record<string, string> = {
  marble: 'marble-stone',
  granite: 'marble-stone',
  stone: 'marble-stone',
  sandstone: 'marble-stone',
  chemical: 'chemicals-dyes',
  chemicals: 'chemicals-dyes',
  dye: 'chemicals-dyes',
  dyes: 'chemicals-dyes',
  solvent: 'chemicals-dyes',
  polymer: 'chemicals-dyes',
  machine: 'industrial-machinery',
  machinery: 'industrial-machinery',
  cnc: 'industrial-machinery',
  lathe: 'industrial-machinery',
  hydraulic: 'industrial-machinery',
  valve: 'industrial-machinery',
  textile: 'textiles-fabrics',
  textiles: 'textiles-fabrics',
  fabric: 'textiles-fabrics',
  cotton: 'textiles-fabrics',
  yarn: 'textiles-fabrics',
  electronic: 'electronics-electrical',
  electronics: 'electronics-electrical',
  pcb: 'electronics-electrical',
  transformer: 'electronics-electrical',
  solar: 'electronics-electrical',
  inverter: 'electronics-electrical',
  construction: 'building-construction',
  cement: 'building-construction',
  steel: 'building-construction',
  tmt: 'building-construction',
};

export interface ParsedSearchIntent {
  isProgrammaticMatch: boolean;
  destinationUrl: string;
  matchedCity?: string;
  matchedCategory?: string;
}

/**
 * Analyzes search text and resolves the best landing page URL
 */
export function resolveSearchIntent(query: string, explicitCity = ''): ParsedSearchIntent {
  const lower = query.toLowerCase().trim();

  // If explicit city is passed via dropdown
  let resolvedCitySlug: string | undefined = undefined;
  if (explicitCity) {
    const cleanExplicit = explicitCity.toLowerCase().trim();
    resolvedCitySlug = KNOWN_CITIES[cleanExplicit] || cleanExplicit.replace(/\s+/g, '-');
  }

  // Check if city name is embedded in natural search query (e.g. "in udaipur", "udaipur")
  if (!resolvedCitySlug) {
    for (const [cityName, citySlug] of Object.entries(KNOWN_CITIES)) {
      if (lower.includes(cityName)) {
        resolvedCitySlug = citySlug;
        break;
      }
    }
  }

  // Check category keywords
  let resolvedCategorySlug: string | undefined = undefined;
  for (const [keyword, catSlug] of Object.entries(CATEGORY_KEYWORDS)) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(lower)) {
      resolvedCategorySlug = catSlug;
      break;
    }
  }

  // If both City and Category matched, direct to Programmatic SEO Hub!
  if (resolvedCitySlug && resolvedCategorySlug) {
    return {
      isProgrammaticMatch: true,
      destinationUrl: `/suppliers/${resolvedCitySlug}/${resolvedCategorySlug}`,
      matchedCity: resolvedCitySlug,
      matchedCategory: resolvedCategorySlug,
    };
  }

  // Fallback to standard Directory query
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (explicitCity) params.set('city', explicitCity);

  return {
    isProgrammaticMatch: false,
    destinationUrl: `/directory?${params.toString()}`,
  };
}
