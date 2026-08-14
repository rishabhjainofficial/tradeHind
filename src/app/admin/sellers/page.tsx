'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { SubscriptionTier } from '@/lib/types';
import { ShieldCheck, CheckCircle2, Award, Check, RefreshCw } from 'lucide-react';

export default function AdminSellerModeration() {
  const { sellers, updateSellerVerification } = useRole();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpdate = (sellerId: string, tier: SubscriptionTier, trustSeal: boolean) => {
    updateSellerVerification(sellerId, tier, trustSeal);
    setSuccessMessage(`Updated seller permissions & recalculated hybrid rank score.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem' }}>
          <ShieldCheck style={{ width: '18px', height: '18px' }} />
          ADMIN MODERATION DESK
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
          Seller TrustSEAL & Subscription Tier Control
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Moderate seller business credentials, toggle TrustSEAL badges, and upgrade subscription tiers to impact search ranking scores.
        </p>
      </div>

      {successMessage && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check style={{ width: '18px', height: '18px' }} />
          {successMessage}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {sellers.map((seller) => (
          <div key={seller.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={seller.logo}
                alt={seller.companyName}
                style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
              />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{seller.companyName}</h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  {seller.city}, {seller.state} • GSTIN: {seller.GSTIN}
                </p>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#008080', marginTop: '0.2rem' }}>
                  Current Rank Score: #{seller.rankScore} pts
                </div>
              </div>
            </div>

            {/* Moderation Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {/* TrustSEAL Toggle */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>
                  TRUSTSEAL BADGE
                </label>
                <button
                  className={`btn ${seller.trustSealStatus ? 'btn-primary' : 'btn-outline'} btn-sm`}
                  onClick={() => handleUpdate(seller.id, seller.subscriptionTier, !seller.trustSealStatus)}
                >
                  <ShieldCheck style={{ width: '14px', height: '14px' }} />
                  {seller.trustSealStatus ? 'TrustSEAL Active' : 'Enable TrustSEAL'}
                </button>
              </div>

              {/* Tier Select */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>
                  SUBSCRIPTION TIER
                </label>
                <select
                  value={seller.subscriptionTier}
                  onChange={(e) => handleUpdate(seller.id, e.target.value as SubscriptionTier, seller.trustSealStatus)}
                  style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  <option value="gold">Gold Star Supplier (+100 pts)</option>
                  <option value="silver">Silver Supplier (+50 pts)</option>
                  <option value="free">Free Listing (+0 pts)</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
