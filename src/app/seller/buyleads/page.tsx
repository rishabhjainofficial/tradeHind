'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { Store, Unlock, Lock, MapPin, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/formatters';

export default function BuyLeadsMarketplace() {
  const { buyLeads, activeSeller, unlockBuyLead, refundBuyLead } = useRole();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!activeSeller) return null;

  const filteredLeads = buyLeads.filter(lead => {
    if (selectedCategory && lead.categoryId !== selectedCategory) return false;
    if (selectedCity && lead.buyerCity.toLowerCase() !== selectedCity.toLowerCase()) return false;
    return true;
  });

  const handleUnlock = (leadId: string) => {
    const success = unlockBuyLead(leadId, activeSeller.id);
    if (success) {
      setMessage({ text: 'Contact details unlocked successfully! 1 Credit deducted.', type: 'success' });
    } else {
      setMessage({ text: 'Insufficient credits balance! Please purchase more credits.', type: 'error' });
    }

    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff6f00', fontWeight: 700, fontSize: '0.85rem' }}>
            <Store style={{ width: '18px', height: '18px' }} />
            INDIAMART STYLE BUYLEADS MARKETPLACE
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Available RFQs & Buy Requirements
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Unlock direct buyer contact details (Phone, Email & GST details) using 1 Lead Credit.
          </p>
        </div>

        {/* Credit Balance Badge */}
        <div style={{ background: '#fff3e6', border: '1px solid #ffe0b2', padding: '0.75rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>CREDIT BALANCE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ff6f00' }}>
              {activeSeller.leadCreditsBalance} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Credits</span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#15803d' : '#b91c1c',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fca5a5'}`,
          }}
        >
          {message.type === 'success' ? <CheckCircle2 style={{ width: '18px', height: '18px' }} /> : <AlertCircle style={{ width: '18px', height: '18px' }} />}
          {message.text}
        </div>
      )}

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Filter BuyLeads:</div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '0.5rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
        >
          <option value="">All Categories</option>
          <option value="cat_marbles">Marble & Stone</option>
          <option value="cat_chemicals">Industrial Chemicals</option>
          <option value="cat_textiles">Textiles & Yarn</option>
          <option value="cat_industrial">Industrial Machinery</option>
          <option value="cat_manpower">Manpower & Labour</option>
        </select>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ padding: '0.5rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
        >
          <option value="">All Locations</option>
          <option value="Udaipur">Udaipur</option>
          <option value="New Delhi">New Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Ahmedabad">Ahmedabad</option>
        </select>
        {(selectedCategory || selectedCity) && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setSelectedCategory(''); setSelectedCity(''); }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* BuyLeads Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredLeads.map((lead) => {
          const isUnlocked = lead.unlockedBySellerIds.includes(activeSeller.id);

          return (
            <div key={lead.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                      {lead.productTitle}
                    </h3>
                    {lead.leadType === 'broadcast_deal' && (
                      <span className="badge badge-orange">
                        Broadcast Deal
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin style={{ width: '14px', height: '14px', color: '#ff6f00' }} />
                      Buyer Location: <strong>{lead.buyerCity}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock style={{ width: '14px', height: '14px' }} />
                      Urgency: <strong>{lead.urgency}</strong>
                    </div>
                  </div>
                </div>

                {/* Unlock Button / Masked Status */}
                {isUnlocked ? (
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Unlock style={{ width: '16px', height: '16px' }} /> Unlocked & Contact Revealed
                  </div>
                ) : (
                  <button className="btn btn-orange" onClick={() => handleUnlock(lead.id)}>
                    <Unlock style={{ width: '16px', height: '16px' }} />
                    Spend 1 Credit to Unlock Contact
                  </button>
                )}
              </div>

              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                "{lead.description}"
              </p>

              {/* Contact Info Box (Masked vs Revealed) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: isUnlocked ? '#ffffff' : '#f1f5f9', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>BUYER NAME</div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>
                    {isUnlocked ? lead.buyerName : '•••••••• (Spend 1 Credit to Reveal)'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>PHONE NUMBER</div>
                  <div style={{ fontWeight: 600, color: isUnlocked ? '#16a34a' : '#64748b' }}>
                    {isUnlocked ? lead.buyerPhone : '+91 98XXX XXXXX'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>EMAIL ADDRESS</div>
                  <div style={{ fontWeight: 600, color: isUnlocked ? '#0284c7' : '#64748b' }}>
                    {isUnlocked ? lead.buyerEmail : 'buyer.contact@XXXXX.com'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>QUANTITY & BUDGET</div>
                  <div style={{ fontWeight: 700, color: '#008080' }}>
                    {lead.quantity} {lead.unit} {lead.targetPrice ? `(Budget: ₹${lead.targetPrice.toLocaleString('en-IN')})` : ''}
                  </div>
                </div>
              </div>

              {/* Unlocked Contact Actions & Quality Guarantee */}
              {isUnlocked && (
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <a
                      href={buildWhatsAppUrl(
                        lead.buyerPhone,
                        `Hi ${lead.buyerName}, I am reaching out regarding your TradeHind requirement for ${lead.productTitle}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ color: '#15803d', borderColor: '#bbf7d0', background: '#f0fdf4' }}
                    >
                      WhatsApp Buyer
                    </a>
                    <a href={`tel:${lead.buyerPhone}`} className="btn btn-outline btn-sm">
                      Call Buyer
                    </a>
                  </div>

                  {lead.reportedAsInvalidBySellerIds?.includes(activeSeller.id) ? (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '0.3rem 0.65rem', borderRadius: '6px' }}>
                      ✓ Reported & 1 Credit Auto-Refunded
                    </span>
                  ) : (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ color: '#94a3b8', fontSize: '0.775rem' }}
                      title="TradeHind Lead Quality Guarantee: Auto-refund credit if buyer is unresponsive or invalid"
                      onClick={() => {
                        const confirmed = window.confirm(`TradeHind Lead Quality Guarantee:\n\nIs this lead unreachable or fake? 1 Credit will be instantly refunded to your wallet.`);
                        if (confirmed) {
                          const refunded = refundBuyLead(lead.id, activeSeller.id, 'unresponsive_or_invalid');
                          if (refunded) {
                            setMessage({ text: '✓ 1 Credit has been automatically refunded to your wallet under TradeHind Lead Quality Guarantee.', type: 'success' });
                            setTimeout(() => setMessage(null), 5000);
                          }
                        }
                      }}
                    >
                      Report Invalid / Claim Auto-Refund
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
