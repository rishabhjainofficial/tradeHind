'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import SupplierCard from '@/components/client/SupplierCard';
import { SellerProfile } from '@/lib/types';
import { calculateSellerRankScore } from '@/lib/ranking';
import { resolveSearchIntent } from '@/lib/search-intent';
import { Search, MapPin, ShieldCheck, Zap, ArrowRight, Cpu, FlaskConical, Shirt, Store, CheckCircle2, Award, Clock, Building, Layers, Boxes } from 'lucide-react';

// Lazy-load modal to reduce initial JS payload
const RFQWizardModal = dynamic(() => import('@/components/client/RFQWizardModal'), {
  ssr: false,
});

export default function HomePage() {
  const { sellers, categories, buyLeads, products } = useRole();
  const [selectedSupplierForRFQ, setSelectedSupplierForRFQ] = useState<SellerProfile | null>(null);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [nearMeOnly, setNearMeOnly] = useState(false);

  // Filter & rank suppliers
  const rankedSellers = [...sellers]
    .map(s => {
      const distance = nearMeOnly && (cityFilter === 'Udaipur' || s.city === 'Udaipur') ? 4.5 : undefined;
      const sellerProductCategoryIds = products
        .filter(p => p.sellerId === s.id)
        .map(p => p.categoryId);

      return {
        ...s,
        distanceKm: distance,
        rankScore: calculateSellerRankScore(
          s,
          cityFilter,
          nearMeOnly ? 24.5800 : undefined,
          nearMeOnly ? 73.7100 : undefined,
          undefined,
          sellerProductCategoryIds
        ),
      };
    })
    .sort((a, b) => b.rankScore - a.rankScore);

  const handleOpenRFQ = useCallback((supplier?: SellerProfile) => {
    setSelectedSupplierForRFQ(supplier || null);
    setIsRFQModalOpen(true);
  }, []);

  const router = useRouter();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && !cityFilter) return;
    const intent = resolveSearchIntent(searchQuery, cityFilter);
    router.push(intent.destinationUrl);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Hero Search Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #004d4d 0%, #008080 50%, #006666 100%)',
          color: '#ffffff',
          padding: '4rem 1rem 5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="badge badge-gold" style={{ marginBottom: '1rem' }}>
            <Zap style={{ width: '14px', height: '14px' }} /> INDIA'S HYBRID B2B DIRECTORY & BUYLEADS MARKETPLACE
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: '1.2', marginBottom: '1rem' }}>
            Find Verified Manufacturers, Wholesale Suppliers & Local Businesses
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2.5rem', fontWeight: 400 }}>
            Synthesizing IndiaMART wholesale BuyLeads CRM with Justdial hyperlocal direct contact search.
          </p>

          {/* Search Box Form */}
          <form
            onSubmit={handleHeroSearch}
            style={{
              background: '#ffffff',
              padding: '0.5rem',
              borderRadius: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              textAlign: 'left',
            }}
          >
            <div style={{ flex: 2, minWidth: '220px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: '14px', color: '#94a3b8', width: '20px', height: '20px' }} />
              <input
                type="text"
                placeholder="e.g. 5-Axis CNC Machine, Isopropyl Alcohol, Marble Slabs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  paddingRight: '12px',
                  height: '48px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#0f172a',
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '160px', position: 'relative', display: 'flex', alignItems: 'center', borderLeft: '1px solid #e2e8f0' }}>
              <MapPin style={{ position: 'absolute', left: '12px', color: '#ff6f00', width: '18px', height: '18px' }} />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '38px',
                  height: '48px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <option value="">All India</option>
                <option value="Udaipur">Udaipur</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>

            <button type="submit" className="btn btn-orange btn-lg" style={{ borderRadius: '12px' }}>
              Search Suppliers
            </button>
          </form>

          {/* Quick Filters */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', opacity: 0.95 }}>
              <input
                type="checkbox"
                checked={nearMeOnly}
                onChange={(e) => setNearMeOnly(e.target.checked)}
                style={{ accentColor: '#ff6f00', width: '16px', height: '16px' }}
              />
              Near Me (Hyperlocal Search)
            </label>
            <span>•</span>
            <Link href="/directory?trustSeal=true" style={{ textDecoration: 'underline', color: '#ffffff', opacity: 0.95 }}>
              TrustSEAL Verified Suppliers Only
            </Link>
          </div>
        </div>
      </section>

      {/* Live Ticker: Recent RFQ Buy Requirements */}
      <section className="container">
        <div style={{ background: '#fff3e6', border: '1px solid #ffe0b2', borderRadius: '12px', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
          <span style={{ background: '#ff6f00', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '4px', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
            Live RFQ Feed
          </span>

          <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#0f172a' }}>
            {buyLeads.map((lead) => (
              <div key={lead.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>{lead.buyerCity}:</span>
                <span>{lead.productTitle}</span>
                <span style={{ color: '#008080', fontWeight: 700 }}>({lead.quantity} {lead.unit})</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>• 5m ago</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top B2B Categories Grid */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Explore Industry Categories</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Browse high-demand industrial products, machinery, marble, and raw materials.</p>
          </div>
          <Link href="/directory" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
            View All Categories <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>

        <div className="grid-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/directory?cat=${cat.id}`}
              className="card"
              style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ background: '#e6f2f2', color: '#008080', padding: '0.65rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cat.iconName === 'Cpu' && <Cpu style={{ width: '24px', height: '24px' }} />}
                  {cat.iconName === 'FlaskConical' && <FlaskConical style={{ width: '24px', height: '24px' }} />}
                  {cat.iconName === 'Shirt' && <Shirt style={{ width: '24px', height: '24px' }} />}
                  {cat.iconName === 'Zap' && <Zap style={{ width: '24px', height: '24px' }} />}
                  {(cat.iconName === 'Building' || cat.id === 'cat_marbles') && <Building style={{ width: '24px', height: '24px' }} />}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                  {cat.subCategories.length} MCATs
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: '1.4' }}>{cat.description}</p>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {cat.subCategories.map((sub) => (
                  <span key={sub.id} style={{ fontSize: '0.75rem', background: '#f8fafc', color: '#475569', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    {sub.name}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Verified Suppliers Section */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <ShieldCheck style={{ width: '18px', height: '18px' }} />
              HYBRID RANKING ENGINE ACTIVE
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Top Ranked Verified Suppliers</h2>
          </div>
          <button className="btn btn-orange" onClick={() => handleOpenRFQ()}>
            Get Quotes From All Top Vendors
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {rankedSellers.slice(0, 3).map((seller) => (
            <SupplierCard key={seller.id} supplier={seller} onSendInquiry={handleOpenRFQ} />
          ))}
        </div>
      </section>

      {/* Post Requirement Callout */}
      <section className="container">
        <div style={{ background: 'linear-gradient(135deg, #008080 0%, #004d4d 100%)', color: '#ffffff', padding: '3rem 2rem', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
          <div style={{ maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Can't Find Exact Specifications? Post Your Requirement Now!
            </h3>
            <p style={{ color: '#ccfbf1', fontSize: '1rem', lineHeight: '1.5' }}>
              Tell us what you need. Our automated broadcast system will alert top verified manufacturers in New Delhi, Mumbai & Bengaluru to send you competitive price quotes within hours.
            </p>
          </div>
          <button className="btn btn-orange btn-lg" style={{ borderRadius: '30px' }} onClick={() => handleOpenRFQ()}>
            Post Requirement (Free)
          </button>
        </div>
      </section>

      {/* Modal */}
      {isRFQModalOpen && (
        <RFQWizardModal targetSupplier={selectedSupplierForRFQ} onClose={() => setIsRFQModalOpen(false)} />
      )}
    </div>
  );
}
