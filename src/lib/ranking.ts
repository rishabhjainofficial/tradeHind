import { SellerProfile } from './types';

export interface RankScoreBreakdown {
  tierScore: number;
  tierLabel: string;
  trustScore: number;
  trustLabels: string[];
  proximityScore: number;
  proximityLabel: string;
  categoryScore: number;
  categoryLabel: string;
  speedScore: number;
  speedLabel: string;
  ratingCompletenessScore: number;
  ratingCompletenessLabels: string[];
  totalScore: number;
  improvementTips: string[];
}

/**
 * Calculates dynamic Seller Ranking Score based on IndiaMART + Justdial hybrid formula:
 * Rank Score = Tier Weight + Trust Badges + Proximity Bonus + Category Match + Response Speed + Rating & Completeness
 */
export function calculateSellerRankScore(
  seller: SellerProfile,
  searchCity?: string,
  userLat?: number,
  userLng?: number,
  searchCategoryId?: string,
  sellerProductCategoryIds?: string[]
): number {
  return getSellerRankScoreBreakdown(
    seller,
    searchCity,
    userLat,
    userLng,
    searchCategoryId,
    sellerProductCategoryIds
  ).totalScore;
}

/**
 * Provides a fully transparent, itemized breakdown of how a seller's rank score is calculated,
 * along with actionable tips to increase their ranking on TradeHind.
 */
export function getSellerRankScoreBreakdown(
  seller: SellerProfile,
  searchCity?: string,
  userLat?: number,
  userLng?: number,
  searchCategoryId?: string,
  sellerProductCategoryIds?: string[]
): RankScoreBreakdown {
  let tierScore = 0;
  let tierLabel = 'Free Listing (+0 pts)';
  if (seller.subscriptionTier === 'gold') {
    tierScore = 100;
    tierLabel = 'Gold Star Supplier (+100 pts)';
  } else if (seller.subscriptionTier === 'silver') {
    tierScore = 50;
    tierLabel = 'Silver Supplier (+50 pts)';
  }

  let trustScore = 0;
  const trustLabels: string[] = [];
  if (seller.trustSealStatus) {
    trustScore += 30;
    trustLabels.push('TrustSEAL Verified (+30 pts)');
  }
  if (seller.gstVerified) {
    trustScore += 15;
    trustLabels.push('GSTIN Verified (+15 pts)');
  }

  let proximityScore = 0;
  let proximityLabel = 'National Reach';
  if (searchCity && seller.city.toLowerCase() === searchCity.toLowerCase()) {
    proximityScore += 20;
    proximityLabel = `Local City (${seller.city}) (+20 pts)`;
  }

  if (userLat !== undefined && userLng !== undefined && seller.locationCoords) {
    const dist = calculateHaversineDistance(
      userLat,
      userLng,
      seller.locationCoords.lat,
      seller.locationCoords.lng
    );
    if (dist <= 10) {
      proximityScore += 15;
      proximityLabel = `Hyperlocal < 10km (${dist}km) (+35 pts)`;
    } else if (dist <= 25) {
      proximityScore += 8;
      proximityLabel = `Near Buyer < 25km (${dist}km) (+28 pts)`;
    }
  }

  // Category Specialization Bonus
  let categoryScore = 0;
  let categoryLabel = 'General Catalog';
  if (
    searchCategoryId &&
    sellerProductCategoryIds &&
    sellerProductCategoryIds.includes(searchCategoryId)
  ) {
    categoryScore = 40;
    categoryLabel = 'Direct Category Specialist (+40 pts)';
  }

  // Response Speed (Fast Reply Bonus)
  let speedScore = 0;
  let speedLabel = 'Standard Response';
  if (seller.responseTimeMinutes <= 15) {
    speedScore = 25;
    speedLabel = `Ultra Fast Reply < 15m (${seller.responseTimeMinutes}m) (+25 pts)`;
  } else if (seller.responseTimeMinutes <= 60) {
    speedScore = 12;
    speedLabel = `Quick Reply < 1hr (${seller.responseTimeMinutes}m) (+12 pts)`;
  }

  // Rating & Completeness
  let ratingCompletenessScore = 0;
  const ratingCompletenessLabels: string[] = [];
  if (seller.rating >= 4.5) {
    ratingCompletenessScore += 20;
    ratingCompletenessLabels.push(`Top Rated ${seller.rating}★ (+20 pts)`);
  } else if (seller.rating >= 4.0) {
    ratingCompletenessScore += 10;
    ratingCompletenessLabels.push(`Good Rating ${seller.rating}★ (+10 pts)`);
  }

  if (seller.videoUrl) {
    ratingCompletenessScore += 15;
    ratingCompletenessLabels.push('Factory Video Tour (+15 pts)');
  }
  if (seller.factoryPhotos && seller.factoryPhotos.length > 0) {
    ratingCompletenessScore += 10;
    ratingCompletenessLabels.push(`${seller.factoryPhotos.length} Facility Photos (+10 pts)`);
  }

  const totalScore =
    tierScore +
    trustScore +
    proximityScore +
    categoryScore +
    speedScore +
    ratingCompletenessScore;

  // Actionable tips
  const improvementTips: string[] = [];
  if (!seller.videoUrl) {
    improvementTips.push('Upload a 30-second factory / warehouse video walkthrough (+15 pts)');
  }
  if (!seller.trustSealStatus) {
    improvementTips.push('Apply for TrustSEAL physical & business verification (+30 pts)');
  }
  if (seller.subscriptionTier === 'free') {
    improvementTips.push('Upgrade to Silver (+50 pts) or Gold (+100 pts) Supplier tier');
  }
  if (seller.responseTimeMinutes > 15) {
    improvementTips.push('Enable WhatsApp lead notifications to respond under 15 minutes (+25 pts)');
  }
  if (!seller.factoryPhotos || seller.factoryPhotos.length === 0) {
    improvementTips.push('Add real production machinery and factory photos (+10 pts)');
  }

  return {
    tierScore,
    tierLabel,
    trustScore,
    trustLabels,
    proximityScore,
    proximityLabel,
    categoryScore,
    categoryLabel,
    speedScore,
    speedLabel,
    ratingCompletenessScore,
    ratingCompletenessLabels,
    totalScore,
    improvementTips,
  };
}

/**
 * Helper to calculate Haversine distance in kilometers between two lat/lng points
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal point
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
