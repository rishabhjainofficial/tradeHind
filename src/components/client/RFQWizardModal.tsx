'use client';

import React, { useState } from 'react';
import { SellerProfile, Product } from '@/lib/types';
import { useRole } from '@/context/RoleContext';
import { X, Send, ShieldCheck, Zap } from 'lucide-react';

interface RFQWizardModalProps {
  targetSupplier?: SellerProfile | null;
  targetProduct?: Product | null;
  onClose: () => void;
}

export default function RFQWizardModal({ targetSupplier, targetProduct, onClose }: RFQWizardModalProps) {
  const { postBuyRequirement, categories, currentUser } = useRole();

  const [productTitle, setProductTitle] = useState(
    targetProduct?.title || (targetSupplier ? `Requirement for ${targetSupplier.companyName}` : '')
  );
  const [categoryId, setCategoryId] = useState(targetProduct?.categoryId || categories[0]?.id || '');
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState('Units');
  const [targetPrice, setTargetPrice] = useState(targetProduct?.pricePerUnit || 10000);
  const [urgency, setUrgency] = useState<'Immediate (1-3 Days)' | 'Within 15 Days' | 'Planning & Research'>('Immediate (1-3 Days)');
  const [description, setDescription] = useState('');
  const [isBroadcast, setIsBroadcast] = useState(!targetSupplier);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Guest contact fields (used when user is not logged in)
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCity, setGuestCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isGuest = !currentUser;

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
      description: description || `Looking for ${productTitle} with fast delivery and competitive rates.`,
      urgency,
      leadType: isBroadcast ? 'broadcast_deal' : 'direct',
    });

    setIsSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              {isSubmitted ? 'Requirement Posted Successfully!' : targetSupplier ? `Get Quote from ${targetSupplier.companyName}` : 'Post Buy Requirement (Get Best Deal)'}
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Connect with verified B2B suppliers across India & get instant quotations.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ background: '#dcfce7', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#16a34a' }}>
              <Zap style={{ width: '32px', height: '32px' }} />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>RFQ Broadcasted to Verified Suppliers</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Top suppliers matching your requirements in {currentUser?.city || 'your area'} have been notified. You will receive quotes directly in your inbox.
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Done & View Inquiries
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Guest contact collection — only shown when not logged in */}
            {!currentUser && (
              <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.825rem', fontWeight: 700, color: '#92400e', margin: 0 }}>
                  ⚡ Enter your contact details so verified suppliers can reach you
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #fbbf24', outline: 'none', fontSize: '0.875rem' }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number * (+91...)"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #fbbf24', outline: 'none', fontSize: '0.875rem' }}
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Your City *"
                  value={guestCity}
                  onChange={(e) => setGuestCity(e.target.value)}
                  style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #fbbf24', outline: 'none', fontSize: '0.875rem' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Product / Service Name *
              </label>
              <input
                type="text"
                required
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="e.g. 5-Axis CNC Milling Machine or Organic Cotton Fabric"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Industry Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Delivery Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                >
                  <option value="Immediate (1-3 Days)">Immediate (1-3 Days)</option>
                  <option value="Within 15 Days">Within 15 Days</option>
                  <option value="Planning & Research">Planning & Research</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                >
                  <option value="Units">Units / Pieces</option>
                  <option value="Meters">Meters / GSM</option>
                  <option value="Litre">Litres / Barrels</option>
                  <option value="Tons">Tons / Kg</option>
                  <option value="Set">Sets</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Estimated Budget (₹)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Requirement Specifications & Details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention specific grade, material, power rating, location preferences or GST invoice requirements..."
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
              />
            </div>

            {/* Broadcast Option */}
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="broadcastCheck"
                checked={isBroadcast}
                onChange={(e) => setIsBroadcast(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="broadcastCheck" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <strong style={{ color: '#ff6f00' }}>Justdial Multi-Vendor Blast:</strong> Send this inquiry to top 5 verified suppliers in this category to get the best price faster.
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-orange">
                <Send style={{ width: '16px', height: '16px' }} />
                Submit Buy Requirement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
