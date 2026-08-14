'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import SupplierCard from '@/components/client/SupplierCard';
import { SellerProfile } from '@/lib/types';
import { calculateSellerRankScore } from '@/lib/ranking';
import { slugToTitleCase } from '@/lib/formatters';
import { MapPin, ShieldCheck, PlusCircle, ArrowRight, Building, Award, CheckCircle2, ChevronRight, HelpCircle, Star, Sparkles } from 'lucide-react';

const RFQWizardModal = dynamic(() => import('@/components/client/RFQWizardModal'), {
  ssr: false,
});

export default function ProgrammaticSupplierListingPage() {
  const params = useParams();
  const rawCity = typeof params.city === 'string' ? params.city : 'udaipur';
  const rawCategory = typeof params.category === 'string' ? params.category : 'marble-stone';

  const { sellers, categories, products } = useRole();
  const [selectedSupplierForRFQ, setSelectedSupplierForRFQ] = useState<SellerProfile | null>(null);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);

  // Normalize city name using centralized slugToTitleCase helper
  const cityName = slugToTitleCase(rawCity);

  // Match category
  const matchingCategory = categories.find(
    c => c.slug.toLowerCase() === rawCategory.toLowerCase() || c.id.toLowerCase().includes(rawCategory.toLowerCase())
  ) || categories[0];

  const categoryName = matchingCategory ? matchingCategory.name : 'Industrial & Commercial';

  // Filter sellers matching this city and/or category products
  const matchingSellers = sellers
    .map(s => {
      const sellerProductCategoryIds = products
        .filter(p => p.sellerId === s.id)
        .map(p => p.categoryId);

      return {
        ...s,
        rankScore: calculateSellerRankScore(
          s,
          cityName,
          cityName.toLowerCase() === 'udaipur' ? 24.5800 : undefined,
          cityName.toLowerCase() === 'udaipur' ? 73.7100 : undefined,
          matchingCategory?.id,
          sellerProductCategoryIds
        ),
      };
    })
    .filter(s => {
      const isCityMatch = s.city.toLowerCase() === cityName.toLowerCase();
      const isCategoryMatch = products.some(
        p => p.sellerId === s.id && (p.categoryId === matchingCategory?.id || p.subCategoryId === matchingCategory?.id)
      );
      return isCityMatch || isCategoryMatch;
    })
    .sort((a, b) => b.rankScore - a.rankScore);

  const handleOpenRFQ = (supplier?: SellerProfile) => {
    setSelectedSupplierForRFQ(supplier || null);
    setIsRFQModalOpen(true);
  };

  // Google JSON-LD Structured Data Schema for Local B2B Hub Ranking
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tradehind.com' },
          { '@type': 'ListItem', position: 2, name: 'Directory', item: 'https://tradehind.com/directory' },
          { '@type': 'ListItem', position: 3, name: `${cityName} ${categoryName}`, item: `https://tradehind.com/suppliers/${rawCity}/${rawCategory}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Top ${categoryName} Suppliers in ${cityName}`,
        description: `Verified directory of top rated manufacturers and wholesale suppliers of ${categoryName} in ${cityName}, India.`,
        numberOfItems: matchingSellers.length,
        itemListElement: matchingSellers.map((s, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'LocalBusiness',
            name: s.companyName,
            address: {
              '@type': 'PostalAddress',
              addressLocality: s.city,
              addressRegion: s.state,
              addressCountry: 'IN',
            },
            telephone: s.phone,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: s.rating || 4.8,
              reviewCount: s.reviewCount || 12,
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How do I find verified ${categoryName} suppliers in ${cityName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `TradeHind lists verified manufacturers and wholesalers in ${cityName} with physical factory audits, GSTIN verification, and direct phone contact.`,
            },
          },
          {
            '@type': 'Question',
            name: `Can I get wholesale price quotations for ${categoryName} in ${cityName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, submit an RFQ on TradeHind to receive instant itemized GST price quotations directly from verified ${cityName} suppliers with 0% middleman commission.`,
            },
          },
        ],
      },
    ],
  };

  const nearbyCities = ['Udaipur', 'Ahmedabad', 'Jaipur', 'Mumbai', 'Surat'].filter(
    c => c.toLowerCase() !== cityName.toLowerCase()
  );

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
      {/* Inject Google JSON-LD Rich Snippet Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Breadcrumbs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <Link href="/" className="hover:text-[#008080]">Home</Link>
        <ChevronRight style={{ width: '14px', height: '14px' }} />
        <Link href="/directory" className="hover:text-[#008080]">Directory</Link>
        <ChevronRight style={{ width: '14px', height: '14px' }} />
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{cityName} {categoryName}</span>
      </nav>

      {/* SEO Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #008080 0%, #004d4d 100%)', color: '#ffffff', padding: '2.5rem 2rem', borderRadius: '16px', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <MapPin style={{ width: '14px', height: '14px', color: '#ff6f00' }} />
            {cityName} Industrial Sourcing Hub • Top Ranked
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Top {categoryName} Suppliers & Manufacturers in {cityName}
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#ccfbf1', lineHeight: 1.5 }}>
            Connect directly with {matchingSellers.length} verified manufacturers and wholesale distributors in {cityName}. Get instant GST price quotes and factory pricing with zero intermediary commissions.
          </p>
        </div>

        <button className="btn btn-orange btn-lg" onClick={() => handleOpenRFQ()}>
          <PlusCircle style={{ width: '18px', height: '18px' }} />
          Get Instant Quotes in {cityName}
        </button>
      </div>

      {/* Main Listing & Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column: Verified Suppliers Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
              Verified {categoryName} Suppliers ({matchingSellers.length})
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Ranked by TrustSEAL & Hyperlocal Proximity
            </span>
          </div>

          {matchingSellers.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <Building style={{ width: '40px', height: '40px', color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <h3>Expanding Suppliers in {cityName}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Post your requirement now and our regional sourcing team will connect you with vetted suppliers in {cityName} within 24 hours.
              </p>
              <button className="btn btn-primary" onClick={() => handleOpenRFQ()}>
                Post Requirement for {cityName}
              </button>
            </div>
          ) : (
            matchingSellers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} onSendInquiry={handleOpenRFQ} />
            ))
          )}
        </div>

        {/* Right Column: Local Sourcing Guide, FAQs & Internal Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Sourcing Tips Card */}
          <div className="card" style={{ padding: '1.5rem', background: '#f8fafc' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck style={{ width: '18px', height: '18px', color: '#008080' }} />
              {cityName} Sourcing Checklist
            </h3>
            <ul style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.25rem', margin: 0 }}>
              <li>Always check for the <strong>TrustSEAL Verified</strong> badge indicating physical premises verification.</li>
              <li>Ask for an official <strong>GST Tax Invoice</strong> with clear HSN/SAC codes before dispatch.</li>
              <li>Request a 30-second factory or quarry video walkthrough to inspect ready stock quality.</li>
            </ul>
          </div>

          {/* Local Category FAQs (Programmatic SEO Schema Target) */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HelpCircle style={{ width: '18px', height: '18px', color: '#ff6f00' }} />
              Frequently Asked Questions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                  How do I get the best wholesale price for {categoryName} in {cityName}?
                </strong>
                <span style={{ color: '#64748b' }}>
                  Post a broadcast RFQ on TradeHind. Top 5 TrustSEAL verified suppliers in {cityName} will submit competitive price quotations directly to your inbox.
                </span>
              </div>

              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                  What is the delivery turnaround time from {cityName}?
                </strong>
                <span style={{ color: '#64748b' }}>
                  Most manufacturers offer dispatch within 1–3 business days for stock items with full transit insurance across India.
                </span>
              </div>
            </div>
          </div>

          {/* Related Sourcing Hubs (Internal PageRank Flow) */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles style={{ width: '16px', height: '16px', color: '#008080' }} />
              Related Sourcing Hubs
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {nearbyCities.map((c) => (
                <Link
                  key={c}
                  href={`/suppliers/${c.toLowerCase().replace(/\s+/g, '-')}/${rawCategory}`}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.35rem 0.65rem',
                    background: '#f1f5f9',
                    borderRadius: '6px',
                    color: '#334155',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                  className="hover:bg-[#e2e8f0] hover:text-[#008080]"
                >
                  {categoryName} in {c} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isRFQModalOpen && (
        <RFQWizardModal
          targetSupplier={selectedSupplierForRFQ}
          onClose={() => setIsRFQModalOpen(false)}
        />
      )}
    </div>
  );
}
