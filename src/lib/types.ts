export type UserRole = 'client' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  city?: string;
}

export type SubscriptionTier = 'gold' | 'silver' | 'free';

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface SellerProfile {
  id: string;
  userId: string;
  phone: string; // Seller's actual phone number for tel: and wa.me links
  companyName: string;
  tagline?: string;
  logo: string;
  banner: string;
  GSTIN: string;
  businessType: string; // e.g. Manufacturer, Wholesaler, Trader, Service Provider
  address: string;
  city: string;
  state: string;
  locationCoords: LocationCoords;
  distanceKm?: number; // Calculated dynamically based on user location search
  isOpenNow: boolean;
  businessHours: string;
  responseTimeMinutes: number;
  trustSealStatus: boolean;
  gstVerified: boolean;
  subscriptionTier: SubscriptionTier;
  leadCreditsBalance: number;
  videoUrl?: string;
  factoryPhotos: string[];
  rankScore: number;
  rating: number;
  reviewCount: number;
  establishedYear: number;
  employeeCount: string;
}

export interface Product {
  id: string;
  sellerId: string;
  seller?: SellerProfile;
  title: string;
  description: string;
  categoryId: string;
  subCategoryId?: string;
  categoryName?: string;
  pricePerUnit: number;
  currency: string;
  unit: string; // e.g. Piece, Set, Ton, Meter, Kg
  minimumOrderQty: number;
  images: string[];
  videoUrl?: string;
  pdfBrochureUrl?: string;
  specifications: Record<string, string>;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description?: string;
  image?: string;
  subCategories: {
    id: string;
    name: string;
    slug: string;
    specKeys?: string[];
  }[];
}

export type LeadType = 'direct' | 'broadcast_deal';
export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'closed' | 'lost';

export interface BuyLead {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerCity: string;
  productTitle: string;
  categoryId: string;
  categoryName?: string;
  quantity: number;
  unit: string;
  targetPrice?: number;
  description: string;
  urgency: 'Immediate (1-3 Days)' | 'Within 15 Days' | 'Planning & Research';
  leadType: LeadType;
  unlockedBySellerIds: string[];
  reportedAsInvalidBySellerIds?: string[];
  status: LeadStatus;
  createdAt: string;
  dealValue?: number;
}

export interface QuotationItem {
  productTitle: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  leadId?: string;
  sellerId: string;
  sellerName: string;
  sellerGSTIN: string;
  buyerId: string;
  buyerName: string;
  buyerCompany?: string;
  items: QuotationItem[];
  subtotal: number;
  taxRate?: number; // e.g. 0, 5, 12, 18, 28
  taxAmount: number;
  grandTotal: number;
  validUntil: string;
  note?: string;
  status?: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  text: string;
  quotation?: Quotation;
  timestamp: string;
}
