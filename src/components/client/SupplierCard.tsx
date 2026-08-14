'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SellerProfile } from '@/lib/types';
import { getSellerRankScoreBreakdown } from '@/lib/ranking';
import { ShieldCheck, CheckCircle2, Star, MapPin, Phone, MessageSquare, Video, Clock, Award, Building, Sparkles, X, Info } from 'lucide-react';

import { buildWhatsAppUrl } from '@/lib/formatters';

interface SupplierCardProps {
  supplier: SellerProfile;
  onSendInquiry: (supplier: SellerProfile) => void;
}

const SupplierCard = React.memo(function SupplierCard({ supplier, onSendInquiry }: SupplierCardProps) {
  const [showRankModal, setShowRankModal] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(
    supplier.phone,
    `Hi ${supplier.companyName}, I found your profile on TradeHind and would like to get a quote.`
  );
  const breakdown = getSellerRankScoreBreakdown(supplier);

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        <img
          src={supplier.logo}
          alt={supplier.companyName}
          style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Link
              href={`/supplier/${supplier.id}`}
              style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}
              className="hover:text-[#008080]"
            >
              {supplier.companyName}
            </Link>

            {supplier.trustSealStatus && (
              <span className="badge badge-trustseal" title="TrustSEAL Verified Supplier">
                <ShieldCheck style={{ width: '13px', height: '13px' }} /> TrustSEAL
              </span>
            )}

            {supplier.gstVerified && (
              <span className="badge badge-gst" title="GSTIN Verified">
                <CheckCircle2 style={{ width: '13px', height: '13px' }} /> GST Verified
              </span>
            )}

            {supplier.subscriptionTier === 'gold' && (
              <span className="badge badge-gold">
                <Award style={{ width: '13px', height: '13px' }} /> Gold Supplier
              </span>
            )}

            {supplier.subscriptionTier === 'silver' && (
              <span className="badge badge-silver">
                Silver Supplier
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {supplier.tagline || `${supplier.businessType} in ${supplier.city}`}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.825rem', color: '#475569' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#b45309', fontWeight: 600 }}>
              <Star style={{ width: '14px', height: '14px', fill: '#f59e0b', color: '#f59e0b' }} />
              {supplier.rating} ({supplier.reviewCount} reviews)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin style={{ width: '14px', height: '14px', color: '#ff6f00' }} />
              {supplier.city}, {supplier.state}
              {supplier.distanceKm !== undefined && (
                <span style={{ fontWeight: 700, color: '#ff6f00' }}> ({supplier.distanceKm} km)</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Building style={{ width: '14px', height: '14px', color: '#64748b' }} />
              Estd. {supplier.establishedYear}
            </div>

            {supplier.isOpenNow ? (
              <span className="badge badge-open">Open Now</span>
            ) : (
              <span className="badge badge-closed">Closed</span>
            )}
          </div>
        </div>

        {/* Rank Score Pill with Clickable Transparency Modal */}
        <button
          type="button"
          onClick={() => setShowRankModal(true)}
          style={{
            background: '#f1f5f9',
            padding: '0.4rem 0.75rem',
            borderRadius: '20px',
            textAlign: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0f172a',
            border: '1px solid #cbd5e1',
            flexShrink: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'all 0.2s',
          }}
          title="Click to view Transparent Rank Score breakdown"
        >
          <Sparkles style={{ width: '12px', height: '12px', color: '#ff6f00' }} />
          Rank #{supplier.rankScore} pts
        </button>
      </div>

      {/* Media & Key Highlights Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
        {supplier.videoUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontWeight: 600 }}>
            <Video style={{ width: '15px', height: '15px' }} />
            Factory Video Available
          </div>
        )}

        <div className="badge badge-fast-reply">
          <Clock style={{ width: '13px', height: '13px' }} /> Replies in &lt; {supplier.responseTimeMinutes} mins
        </div>

        <div style={{ marginLeft: 'auto', color: '#64748b' }}>
          Team: {supplier.employeeCount}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
        <button className="btn btn-primary btn-sm" onClick={() => onSendInquiry(supplier)}>
          <MessageSquare style={{ width: '15px', height: '15px' }} />
          Send Inquiry
        </button>

        <a href={`tel:${supplier.phone}`} className="btn btn-outline btn-sm">
          <Phone style={{ width: '15px', height: '15px', color: '#16a34a' }} />
          Instant Call
        </a>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ color: '#15803d', borderColor: '#bbf7d0', background: '#f0fdf4' }}>
          WhatsApp Chat
        </a>

        <button
          className="btn btn-orange btn-sm"
          style={{ marginLeft: 'auto' }}
          onClick={() => onSendInquiry(supplier)}
        >
          Get Best Deal
        </button>
      </div>

      {/* Rank Score Transparency Modal */}
      {showRankModal && (
        <div className="modal-overlay" onClick={() => setShowRankModal(false)}>
          <div className="modal-content" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#008080', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Sparkles style={{ width: '15px', height: '15px', color: '#ff6f00' }} />
                  TRANSPARENT RANK SCORE BREAKDOWN
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {supplier.companyName}
                </h3>
              </div>
              <button onClick={() => setShowRankModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>TOTAL HYBRID RANK SCORE</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#008080' }}>
                {breakdown.totalScore} <span style={{ fontSize: '1rem', color: '#64748b' }}>pts</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Score is calculated dynamically based on verification status, subscription tier, fast response time & buyer reviews.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>Subscription Tier:</span>
                <strong style={{ color: '#0f172a' }}>{breakdown.tierLabel}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>Trust Badges:</span>
                <strong style={{ color: '#0284c7' }}>{breakdown.trustLabels.join(' + ') || 'None (+0 pts)'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>Response Speed:</span>
                <strong style={{ color: '#16a34a' }}>{breakdown.speedLabel}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>Profile & Media Completeness:</span>
                <strong style={{ color: '#0f172a' }}>{breakdown.ratingCompletenessLabels.join(', ') || 'Basic'}</strong>
              </div>
            </div>

            {breakdown.improvementTips.length > 0 && (
              <div style={{ background: '#fff3e6', border: '1px solid #ffe0b2', padding: '1rem', borderRadius: '8px', fontSize: '0.825rem' }}>
                <div style={{ fontWeight: 700, color: '#c2410c', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Info style={{ width: '14px', height: '14px' }} />
                  How to increase this score on TradeHind:
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#9a3412', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {breakdown.improvementTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.25rem' }}
                onClick={() => setShowRankModal(false)}
              >
                Close Breakdown
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SupplierCard.displayName = 'SupplierCard';
export default SupplierCard;
