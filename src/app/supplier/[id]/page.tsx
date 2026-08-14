'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRole } from '@/context/RoleContext';
import SpecsTable from '@/components/client/SpecsTable';
import { buildWhatsAppUrl } from '@/lib/formatters';
import { ShieldCheck, CheckCircle2, Star, MapPin, Phone, MessageSquare, Video, Clock, Building, Calendar, Users, Award, ExternalLink } from 'lucide-react';

const RFQWizardModal = dynamic(() => import('@/components/client/RFQWizardModal'), {
  ssr: false,
});

export default function SupplierProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { sellers, products } = useRole();
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);

  const supplier = sellers.find(s => s.id === id) || sellers[0];
  const supplierProducts = products.filter(p => p.sellerId === supplier.id);

  const whatsappUrl = buildWhatsAppUrl(
    supplier.phone,
    `Hi ${supplier.companyName}, I saw your profile on TradeHind and would like to request details.`
  );

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Banner */}
      <div style={{ height: '220px', width: '100%', background: `url(${supplier.banner}) center/cover no-repeat`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.2), rgba(15,23,42,0.7))' }} />
      </div>

      <div className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
        {/* Header Profile Box */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
            <img
              src={supplier.logo}
              alt={supplier.companyName}
              style={{ width: '110px', height: '110px', borderRadius: '16px', objectFit: 'cover', border: '3px solid #ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            />

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{supplier.companyName}</h1>

                {supplier.trustSealStatus && (
                  <span className="badge badge-trustseal">
                    <ShieldCheck style={{ width: '14px', height: '14px' }} /> TrustSEAL Verified
                  </span>
                )}

                {supplier.gstVerified && (
                  <span className="badge badge-gst">
                    <CheckCircle2 style={{ width: '14px', height: '14px' }} /> GSTIN: {supplier.GSTIN}
                  </span>
                )}

                {supplier.subscriptionTier === 'gold' && (
                  <span className="badge badge-gold">
                    <Award style={{ width: '14px', height: '14px' }} /> Gold Star
                  </span>
                )}
              </div>

              <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '0.85rem' }}>{supplier.tagline}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.875rem', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin style={{ width: '16px', height: '16px', color: '#ff6f00' }} />
                  {supplier.address}, {supplier.city}, {supplier.state}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#b45309', fontWeight: 600 }}>
                  <Star style={{ width: '16px', height: '16px', fill: '#f59e0b', color: '#f59e0b' }} />
                  {supplier.rating} ({supplier.reviewCount} Reviews)
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar style={{ width: '16px', height: '16px' }} /> Estd. {supplier.establishedYear}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Users style={{ width: '16px', height: '16px' }} /> {supplier.employeeCount}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '200px' }}>
              <button className="btn btn-primary btn-lg" onClick={() => setIsRFQModalOpen(true)}>
                <MessageSquare style={{ width: '18px', height: '18px' }} />
                Send Inquiry
              </button>

              <a href={`tel:${supplier.phone}`} className="btn btn-outline" style={{ justifyContent: 'center' }}>
                <Phone style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                Instant Call
              </a>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ justifyContent: 'center', color: '#15803d', borderColor: '#bbf7d0', background: '#f0fdf4' }}>
                WhatsApp Chat
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Video Tour Section */}
            {supplier.videoUrl && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0284c7', fontWeight: 700 }}>
                  <Video style={{ width: '20px', height: '20px' }} />
                  Factory & Facility Video Tour
                </div>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Factory Tour"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Products Catalog */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
                Product Showcase ({supplierProducts.length} Items)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {supplierProducts.map((prod) => (
                  <div key={prod.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.25rem', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '10px', background: '#ffffff' }}>
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <Link href={`/product/${prod.id}`} style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }} className="hover:text-[#008080]">
                          {prod.title}
                        </Link>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#008080' }}>
                          ₹{prod.pricePerUnit.toLocaleString('en-IN')} / {prod.unit}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                        {prod.description}
                      </p>

                      <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem' }}>
                        <strong>MOQ:</strong> {prod.minimumOrderQty} {prod.unit}
                      </div>

                      <SpecsTable specifications={prod.specifications} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                Business Hours & Status
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Current Status:</span>
                  {supplier.isOpenNow ? <span className="badge badge-open">Open Now</span> : <span className="badge badge-closed">Closed</span>}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.825rem' }}>{supplier.businessHours}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#166534', background: '#f0fdf4', padding: '0.5rem', borderRadius: '6px', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  <Clock style={{ width: '14px', height: '14px' }} /> Replies typically in &lt; {supplier.responseTimeMinutes} mins
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                Verification Documents
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} /> GST Certificate Verified
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7' }}>
                  <ShieldCheck style={{ width: '16px', height: '16px' }} /> TradeHind TrustSEAL Verified
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                  <Building style={{ width: '16px', height: '16px' }} /> Factory Physical Address Verified
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {isRFQModalOpen && (
        <RFQWizardModal targetSupplier={supplier} onClose={() => setIsRFQModalOpen(false)} />
      )}
    </div>
  );
}
