'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRole } from '@/context/RoleContext';
import { Store, ShieldCheck, Clock, FileText, CheckCircle2, TrendingUp, Layers, Users, Download, PlusCircle, Sparkles, Zap, Phone, Mail, Award } from 'lucide-react';
import { formatINR, buildWhatsAppUrl } from '@/lib/formatters';

const CreditRechargeModal = dynamic(() => import('@/components/seller/CreditRechargeModal'), {
  ssr: false,
});

export default function SellerDashboard() {
  const { activeSeller, buyLeads, quotations } = useRole();
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!activeSeller) return null;

  const unlockedLeads = buyLeads.filter(l => l.unlockedBySellerIds.includes(activeSeller.id));
  const activeQuotesCount = quotations.filter(q => q.sellerId === activeSeller.id).length;

  // Competitive Differentiator: Export Leads CSV (Sellers Own Their Data)
  const handleExportCSV = () => {
    if (unlockedLeads.length === 0) {
      setExportNotice('No unlocked leads to export yet. Unlock leads from the marketplace first.');
      setTimeout(() => setExportNotice(null), 3000);
      return;
    }

    const headers = ['Lead ID', 'Product Title', 'Buyer Name', 'Phone', 'Email', 'City', 'Quantity', 'Unit', 'Budget INR', 'Status', 'Date'];
    const rows = unlockedLeads.map(l => [
      l.id,
      `"${l.productTitle.replace(/"/g, '""')}"`,
      `"${l.buyerName.replace(/"/g, '""')}"`,
      l.buyerPhone,
      l.buyerEmail,
      l.buyerCity,
      l.quantity,
      l.unit,
      l.targetPrice || '',
      l.status,
      l.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TradeHind_Leads_${activeSeller.companyName.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('✓ Leads exported successfully! You own 100% of your buyer contact data on TradeHind.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Seller Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#008080', fontWeight: 700, fontSize: '0.85rem' }}>
            <Store style={{ width: '18px', height: '18px' }} />
            SELLER PORTAL & LEAD MANAGEMENT CENTER
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Welcome, {activeSeller.companyName}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {activeSeller.city}, {activeSeller.state} • GSTIN: {activeSeller.GSTIN}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button className="btn btn-orange" onClick={() => setIsRechargeModalOpen(true)}>
            <Zap style={{ width: '16px', height: '16px' }} />
            Recharge Credits
          </button>
          <Link href="/seller/buyleads" className="btn btn-primary">
            <Store style={{ width: '16px', height: '16px' }} />
            Browse BuyLeads ({activeSeller.leadCreditsBalance} Left)
          </Link>
          <Link href="/seller/lead-manager" className="btn btn-outline">
            Open Lead CRM
          </Link>
          <Link href="/seller/onboard" className="btn btn-outline">
            <PlusCircle style={{ width: '16px', height: '16px' }} /> Add Catalog / Product
          </Link>
        </div>
      </div>

      {exportNotice && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 style={{ width: '18px', height: '18px' }} />
          {exportNotice}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #ff6f00', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Lead Credits Balance
            </div>
            <button
              onClick={() => setIsRechargeModalOpen(true)}
              style={{ background: 'transparent', border: 'none', color: '#ff6f00', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              + Add
            </button>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ff6f00' }}>
            {activeSeller.leadCreditsBalance} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>Credits</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.35rem' }}>
            Pay-as-you-go • Auto-refunds active
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #008080' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Unlocked BuyLeads
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#008080' }}>
            {unlockedLeads.length} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>Leads</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
            Direct buyer contacts revealed
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Sent Quotations
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>
            {activeQuotesCount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>Quotes</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '0.35rem' }}>
            GST itemized quotes in chat
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #16a34a' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Response Time Score
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>
            &lt; {activeSeller.responseTimeMinutes} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>Mins</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.35rem' }}>
            Fast Reply Badge Active
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column: Recent Unlocked Leads */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Unlocked BuyLeads ({unlockedLeads.length})</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
                <Download style={{ width: '14px', height: '14px' }} /> Export CSV
              </button>
              <Link href="/seller/lead-manager" className="btn btn-outline btn-sm">
                Open CRM Pipeline
              </Link>
            </div>
          </div>

          {unlockedLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
              <Store style={{ width: '40px', height: '40px', color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
              <p>No BuyLeads unlocked yet. Visit the BuyLeads marketplace to discover active buyer RFQs!</p>
              <Link href="/seller/buyleads" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                Browse BuyLeads
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {unlockedLeads.map((lead) => (
                <div key={lead.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{lead.productTitle}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Buyer: <strong>{lead.buyerName}</strong> ({lead.buyerCity})</span>
                    </div>
                    <span className="badge badge-open" style={{ textTransform: 'capitalize' }}>
                      Status: {lead.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.825rem', color: '#475569', marginTop: '0.5rem' }}>
                    <div><strong>Phone:</strong> {lead.buyerPhone}</div>
                    <div><strong>Email:</strong> {lead.buyerEmail}</div>
                    <div><strong>Qty:</strong> {lead.quantity} {lead.unit}</div>
                    {lead.targetPrice && <div><strong>Budget:</strong> {formatINR(lead.targetPrice)}</div>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                    <a
                      href={buildWhatsAppUrl(
                        lead.buyerPhone,
                        `Hi ${lead.buyerName}, I saw your RFQ for ${lead.productTitle} on TradeHind.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ color: '#15803d', borderColor: '#bbf7d0', background: '#f0fdf4' }}
                    >
                      WhatsApp
                    </a>
                    <a href={`tel:${lead.buyerPhone}`} className="btn btn-outline btn-sm">
                      Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Seller Profile, Badges & Retention Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              Trust & Ranking Badges
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>TrustSEAL Verified:</span>
                {activeSeller.trustSealStatus ? (
                  <span className="badge badge-trustseal"><ShieldCheck style={{ width: '13px', height: '13px' }} /> Active</span>
                ) : (
                  <span style={{ color: '#94a3b8' }}>Inactive</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Subscription Tier:</span>
                <span className={`badge badge-${activeSeller.subscriptionTier}`} style={{ textTransform: 'capitalize' }}>
                  {activeSeller.subscriptionTier} Supplier
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Hybrid Rank Score:</span>
                <span style={{ fontWeight: 800, color: '#008080' }}>#{activeSeller.rankScore} pts</span>
              </div>
            </div>

            <button
              className="btn btn-outline btn-sm"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => setIsRechargeModalOpen(true)}
            >
              <Award style={{ width: '14px', height: '14px', color: '#ff6f00' }} />
              Upgrade to Gold Supplier (+100 pts)
            </button>
          </div>

          {/* Quick Value Added Services Card */}
          <div className="card" style={{ padding: '1.25rem', background: '#fffaf5', border: '1px solid #ffe0b2' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#c2410c', marginBottom: '0.35rem' }}>
              ⚡ MSME Enablement Hub
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#7c2d12', marginBottom: '0.75rem' }}>
              Grow your manufacturing digital presence with TradeHind value-added services:
            </p>
            <ul style={{ fontSize: '0.775rem', color: '#9a3412', listStyle: 'none', padding: 0, margin: '0 0 0.85rem 0', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li>✓ Video Walkthrough Verification (+15 pts)</li>
              <li>✓ Branded GST PDF Catalog Generator</li>
              <li>✓ Instant Export of Unlocked Leads (CSV)</li>
            </ul>
            <Link href="/seller/onboard" className="btn btn-orange btn-sm" style={{ width: '100%' }}>
              Upload Products & Video
            </Link>
          </div>
        </div>
      </div>

      {isRechargeModalOpen && (
        <CreditRechargeModal onClose={() => setIsRechargeModalOpen(false)} />
      )}
    </div>
  );
}
