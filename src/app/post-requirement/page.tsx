'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { Send, Zap, ShieldCheck } from 'lucide-react';

export default function PostRequirementPage() {
  const { postBuyRequirement, categories, currentUser } = useRole();

  const [productTitle, setProductTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState('Units');
  const [targetPrice, setTargetPrice] = useState(50000);
  const [urgency, setUrgency] = useState<'Immediate (1-3 Days)' | 'Within 15 Days' | 'Planning & Research'>('Immediate (1-3 Days)');
  const [description, setDescription] = useState('');
  const [isBroadcast, setIsBroadcast] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Guest contact fields
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCity, setGuestCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    postBuyRequirement({
      buyerId: currentUser?.id || `guest_${Date.now()}`,
      buyerName: currentUser?.name || guestName,
      buyerPhone: currentUser?.phone || guestPhone,
      buyerEmail: currentUser?.email || '',
      buyerCity: currentUser?.city || guestCity,
      productTitle,
      categoryId,
      quantity: Number(quantity),
      unit,
      targetPrice: Number(targetPrice),
      description: description || `Looking for ${productTitle} with quick delivery and best bulk pricing.`,
      urgency,
      leadType: isBroadcast ? 'broadcast_deal' : 'direct',
    });

    setIsSubmitted(true);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '700px' }}>
      <div className="card" style={{ padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#ff6f00', fontWeight: 700, fontSize: '0.85rem', background: '#fff3e6', padding: '0.35rem 0.85rem', borderRadius: '20px', marginBottom: '0.5rem' }}>
            <Zap style={{ width: '16px', height: '16px' }} /> MULTI-VENDOR B2B BUYLEAD BROADCAST
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Post Your Buy Requirement</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Get competitive price quotes from top verified suppliers in New Delhi, Mumbai, Bengaluru & Ahmedabad.
          </p>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ background: '#dcfce7', color: '#16a34a', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Zap style={{ width: '36px', height: '36px' }} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Requirement Sent to Top Vendors</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              Top 5 suppliers matching {productTitle} in {currentUser?.city || 'New Delhi'} have received your RFQ notification.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => window.location.href = '/'}>
              Return to Homepage
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Guest contact collection */}
            {!currentUser && (
              <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e', margin: 0 }}>
                  ⚡ Enter your contact details — verified suppliers will use these to reach you
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    style={{ padding: '0.7rem 0.85rem', borderRadius: '8px', border: '1px solid #fbbf24', outline: 'none', fontSize: '0.9rem' }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number * (10 digits)"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    style={{ padding: '0.7rem 0.85rem', borderRadius: '8px', border: '1px solid #fbbf24', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Your City *"
                  value={guestCity}
                  onChange={(e) => setGuestCity(e.target.value)}
                  style={{ padding: '0.7rem 0.85rem', borderRadius: '8px', border: '1px solid #fbbf24', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Product / Service Requirement *
              </label>
              <input
                type="text"
                required
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="e.g. 200 Ton Hydraulic Press or Isopropyl Alcohol 99.9%"
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Industry Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Delivery Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
                >
                  <option value="Immediate (1-3 Days)">Immediate (1-3 Days)</option>
                  <option value="Within 15 Days">Within 15 Days</option>
                  <option value="Planning & Research">Planning & Research</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                >
                  <option value="Units">Units / Pieces</option>
                  <option value="Meters">Meters / GSM</option>
                  <option value="Litre">Litres / Drums</option>
                  <option value="Tons">Tons / Kg</option>
                  <option value="Set">Sets</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Estimated Budget (₹)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Requirement Details & Specifications
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe material grade, power rating, size, warranty terms or GST tax invoice requirement..."
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="broadcastStandalone"
                checked={isBroadcast}
                onChange={(e) => setIsBroadcast(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#ff6f00' }}
              />
              <label htmlFor="broadcastStandalone" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <strong style={{ color: '#ff6f00' }}>Justdial Multi-Vendor Broadcast:</strong> Broadcast to top 5 TrustSEAL verified sellers in your city.
              </label>
            </div>

            <button type="submit" className="btn btn-orange btn-lg" style={{ marginTop: '0.5rem' }}>
              <Send style={{ width: '18px', height: '18px' }} />
              Submit Buy Requirement & Get Deals
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
