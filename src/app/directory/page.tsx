'use client';

import React, { useState, useMemo, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import SupplierCard from '@/components/client/SupplierCard';
import { SellerProfile } from '@/lib/types';
import { calculateSellerRankScore } from '@/lib/ranking';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, MapPin, Filter, ShieldCheck, CheckCircle2, Award, Clock } from 'lucide-react';

// Lazy-load modal to reduce initial JS bundle size
const RFQWizardModal = dynamic(() => import('@/components/client/RFQWizardModal'), {
  ssr: false,
});

function DirectoryContent() {
  const searchParams = useSearchParams();
  const { sellers, categories, products } = useRole();

  const queryParam = searchParams.get('q') || '';
  const cityParam = searchParams.get('city') || '';
  const catParam = searchParams.get('cat') || '';
  const nearMeParam = searchParams.get('nearMe') === 'true';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCity, setSelectedCity] = useState(cityParam);
  const [selectedCategory, setSelectedCategory] = useState(catParam);
  const [trustSealOnly, setTrustSealOnly] = useState(false);
  const [goldOnly, setGoldOnly] = useState(false);
  const [nearMeOnly, setNearMeOnly] = useState(nearMeParam);
  const [selectedSupplierForRFQ, setSelectedSupplierForRFQ] = useState<SellerProfile | null>(null);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);

  // React Optimization: Debounce search term to prevent re-filtering on every keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const availableCities = useMemo(() => {
    return Array.from(new Set(sellers.map(s => s.city).filter(Boolean)));
  }, [sellers]);

  // Filter & rank suppliers dynamically with memoization
  const filteredSuppliers = useMemo(() => {
    return sellers
      .map(seller => {
        const distance = nearMeOnly && (selectedCity === seller.city || seller.city === 'Udaipur') ? 4.5 : undefined;
        const sellerProductCategoryIds = products
          .filter(p => p.sellerId === seller.id)
          .map(p => p.categoryId);

        const rank = calculateSellerRankScore(
          seller,
          selectedCity,
          nearMeOnly ? 24.5800 : undefined,
          nearMeOnly ? 73.7100 : undefined,
          selectedCategory || undefined,
          sellerProductCategoryIds
        );

        return {
          ...seller,
          distanceKm: distance,
          rankScore: rank,
        };
      })
      .filter(seller => {
        if (debouncedSearchQuery) {
          const q = debouncedSearchQuery.toLowerCase();
          const matchesName = seller.companyName.toLowerCase().includes(q);
          const matchesTagline = seller.tagline?.toLowerCase().includes(q);
          const matchesCity = seller.city.toLowerCase().includes(q);
          const matchesProduct = products.some(
            p => p.sellerId === seller.id && (
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.categoryName?.toLowerCase().includes(q)
            )
          );
          if (!matchesName && !matchesTagline && !matchesCity && !matchesProduct) return false;
        }

        if (selectedCity && seller.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }

        if (selectedCategory) {
          const sellsCategory = products.some(
            p => p.sellerId === seller.id && (p.categoryId === selectedCategory || p.subCategoryId === selectedCategory)
          );
          if (!sellsCategory) return false;
        }

        if (trustSealOnly && !seller.trustSealStatus) return false;
        if (goldOnly && seller.subscriptionTier !== 'gold') return false;
        if (nearMeOnly && seller.distanceKm !== undefined && seller.distanceKm > 10) return false;

        return true;
      })
      .sort((a, b) => b.rankScore - a.rankScore);
  }, [sellers, products, debouncedSearchQuery, selectedCity, selectedCategory, trustSealOnly, goldOnly, nearMeOnly]);

  // Memoize event handler to keep SupplierCard React.memo effective
  const handleOpenRFQ = useCallback((supplier?: SellerProfile) => {
    setSelectedSupplierForRFQ(supplier || null);
    setIsRFQModalOpen(true);
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          {selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name || 'Category'} Suppliers` : 'B2B Suppliers & Local Directory'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Showing {filteredSuppliers.length} verified manufacturers and suppliers {selectedCity ? `in ${selectedCity}` : 'across India'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        {/* Filters Sidebar */}
        <aside className="card" style={{ padding: '1.25rem', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter style={{ width: '16px', height: '16px', color: '#008080' }} /> Filters
            </h3>
            {(selectedCity || selectedCategory || trustSealOnly || goldOnly || nearMeOnly) && (
              <button
                onClick={() => {
                  setSelectedCity('');
                  setSelectedCategory('');
                  setTrustSealOnly(false);
                  setGoldOnly(false);
                  setNearMeOnly(false);
                }}
                style={{ fontSize: '0.75rem', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}
              >
                Reset All
              </button>
            )}
          </div>

          <hr style={{ borderColor: '#f1f5f9' }} />

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Search Keywords</label>
            <input
              type="text"
              placeholder="Product or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Location / City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            >
              <option value="">All Cities</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Industry Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <hr style={{ borderColor: '#f1f5f9' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={nearMeOnly}
                onChange={(e) => setNearMeOnly(e.target.checked)}
                style={{ accentColor: '#ff6f00' }}
              />
              <span style={{ fontWeight: 600, color: '#ff6f00' }}>Suppliers Near Me (&lt; 10 km)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={trustSealOnly}
                onChange={(e) => setTrustSealOnly(e.target.checked)}
                style={{ accentColor: '#0284c7' }}
              />
              <span>TrustSEAL Verified Only</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={goldOnly}
                onChange={(e) => setGoldOnly(e.target.checked)}
                style={{ accentColor: '#d4af37' }}
              />
              <span>Gold Star Suppliers Only</span>
            </label>
          </div>
        </aside>

        {/* Right Directory Content */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredSuppliers.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Suppliers Found</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try adjusting your search keywords, city, or proximity filters.
              </p>
              <button className="btn btn-primary" onClick={() => { setSearchQuery(''); setSelectedCity(''); setTrustSealOnly(false); setNearMeOnly(false); }}>
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} onSendInquiry={handleOpenRFQ} />
            ))
          )}
        </main>
      </div>

      {isRFQModalOpen && (
        <RFQWizardModal targetSupplier={selectedSupplierForRFQ} onClose={() => setIsRFQModalOpen(false)} />
      )}
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Directory...</div>}>
      <DirectoryContent />
    </Suspense>
  );
}
