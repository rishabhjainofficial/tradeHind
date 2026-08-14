'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { SubscriptionTier } from '@/lib/types';
import { X, CheckCircle2, ShieldCheck, Zap, CreditCard, QrCode, Building, Sparkles, FileText, ArrowRight, Award } from 'lucide-react';

interface CreditRechargeModalProps {
  onClose: () => void;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  perCreditText: string;
  popular?: boolean;
  tier?: SubscriptionTier;
  features: string[];
}

const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Lead Pack',
    price: 999,
    credits: 20,
    perCreditText: '₹50 per verified lead',
    features: [
      '20 High-Intent BuyLeads',
      '90-Day Credit Validity',
      'Lead Quality Guarantee (Auto-Refund)',
      'Direct WhatsApp & Call Access',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Pack',
    price: 3499,
    credits: 100,
    perCreditText: '₹35 per verified lead (Save 30%)',
    popular: true,
    features: [
      '100 High-Intent BuyLeads',
      'No Expiration Date',
      'Lead Quality Guarantee (Auto-Refund)',
      'Lead CSV Export (Own Your Data)',
      'TrustSEAL Priority Verification',
    ],
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly Membership',
    price: 2499,
    credits: 200,
    perCreditText: 'Unlimited Category Inquiries',
    tier: 'gold',
    features: [
      '200 Initial Lead Credits',
      'Gold Supplier Star Badge (+100 pts Rank)',
      'Top 3 Featured Search Placement',
      'WhatsApp Lead Instant Alerts',
      'Monthly PDF Lead Performance Report',
    ],
  },
  {
    id: 'pro_annual',
    name: 'Pro Annual Enterprise',
    price: 19999,
    credits: 1000,
    perCreditText: 'Best Value (₹1,666/mo equivalent)',
    tier: 'gold',
    features: [
      '1,000 Lead Credits / Year',
      'Permanent Gold Supplier Status',
      'Branded GST PDF Catalog Generator',
      'Zero Commission on Deals',
      'Dedicated Account Manager',
    ],
  },
];

export default function CreditRechargeModal({ onClose }: CreditRechargeModalProps) {
  const { activeSeller, rechargeCredits } = useRole();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(PLANS[1]);
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment' | 'success'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('business@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');

  if (!activeSeller) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      rechargeCredits(activeSeller.id, selectedPlan.credits, selectedPlan.tier);
      setInvoiceId(`INV-TH-${Date.now().toString().slice(-6)}`);
      setIsProcessing(false);
      setPaymentStep('success');
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: paymentStep === 'select' ? '860px' : '560px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff6f00', fontWeight: 700, fontSize: '0.85rem' }}>
              <Zap style={{ width: '16px', height: '16px' }} />
              TRANSPARENT PAY-AS-YOU-GO CREDIT WALLET
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              {paymentStep === 'select'
                ? 'Recharge BuyLead Credits'
                : paymentStep === 'payment'
                ? 'Complete Secure Payment'
                : 'Payment Successful & Credits Added!'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* STEP 1: SELECT PLAN */}
        {paymentStep === 'select' && (
          <div>
            {/* Value Proposition Alert */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', color: '#166534', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck style={{ width: '20px', height: '20px', flexShrink: 0, color: '#15803d' }} />
              <div>
                <strong>TradeHind Guarantee:</strong> 60–80% cheaper than IndiaMART. No annual lock-in, no auto-debit, and fake leads are automatically refunded.
              </div>
            </div>

            {/* Plans Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              {PLANS.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    style={{
                      border: isSelected ? '2px solid #ff6f00' : '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      background: isSelected ? '#fffaf5' : '#ffffff',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {plan.popular && (
                      <span style={{ position: 'absolute', top: '-10px', right: '12px', background: '#ff6f00', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '10px', textTransform: 'uppercase' }}>
                        Most Popular
                      </span>
                    )}

                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{plan.name}</h4>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{plan.perCreditText}</div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: isSelected ? '#ff6f00' : '#008080' }}>
                        ₹{plan.price.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>
                        +{plan.credits} BuyLead Credits
                      </div>
                    </div>

                    <ul style={{ fontSize: '0.75rem', color: '#475569', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0, padding: 0 }}>
                      {plan.features.map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                          <CheckCircle2 style={{ width: '12px', height: '12px', color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Selection Summary & Proceed */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Selected Package:</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedPlan.name} • ₹{selectedPlan.price.toLocaleString('en-IN')} (+{selectedPlan.credits} Credits)
                </div>
              </div>

              <button className="btn btn-orange btn-lg" onClick={() => setPaymentStep('payment')}>
                Proceed to Checkout <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SIMULATED PAYMENT */}
        {paymentStep === 'payment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{selectedPlan.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Wallet: {activeSeller.companyName}</div>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#008080' }}>
                ₹{selectedPlan.price.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Select Payment Method
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: paymentMethod === 'upi' ? '2px solid #ff6f00' : '1px solid #cbd5e1',
                    background: paymentMethod === 'upi' ? '#fffaf5' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <QrCode style={{ width: '20px', height: '20px', color: '#ff6f00' }} />
                  UPI / QR
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: paymentMethod === 'card' ? '2px solid #008080' : '1px solid #cbd5e1',
                    background: paymentMethod === 'card' ? '#f0fdf4' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <CreditCard style={{ width: '20px', height: '20px', color: '#008080' }} />
                  Debit / Card
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: paymentMethod === 'netbanking' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: paymentMethod === 'netbanking' ? '#f0f9ff' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Building style={{ width: '20px', height: '20px', color: '#0284c7' }} />
                  Net Banking
                </button>
              </div>
            </div>

            {paymentMethod === 'upi' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  UPI Virtual Payment Address (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setPaymentStep('select')}>
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={isProcessing}
                onClick={handlePay}
              >
                {isProcessing ? 'Processing Transaction...' : `Pay ₹${selectedPlan.price.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & GST RECEIPT */}
        {paymentStep === 'success' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <CheckCircle2 style={{ width: '36px', height: '36px' }} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                +{selectedPlan.credits} Lead Credits Added!
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                New wallet balance: <strong>{activeSeller.leadCreditsBalance + selectedPlan.credits} Credits</strong>
              </p>
            </div>

            {/* GST Tax Invoice Receipt Card */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>TradeHind Technologies Pvt Ltd</span>
                <span style={{ color: '#64748b' }}>{invoiceId}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>Billed To:</span>
                <strong>{activeSeller.companyName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>GSTIN:</span>
                <span>{activeSeller.GSTIN}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>Plan:</span>
                <span>{selectedPlan.name} ({selectedPlan.credits} Credits)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem', marginTop: '0.5rem', fontWeight: 800 }}>
                <span>Total Paid (incl. 18% GST):</span>
                <span style={{ color: '#008080' }}>₹{selectedPlan.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={onClose}>
              Done & Start Unlocking Leads
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
