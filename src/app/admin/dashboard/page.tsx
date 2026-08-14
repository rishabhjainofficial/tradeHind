'use client';

import React from 'react';
import Link from 'next/link';
import { useRole } from '@/context/RoleContext';
import { ShieldCheck, BarChart3, Users, Store, Zap, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

export default function AdminDashboard() {
  const { sellers, buyLeads, quotations, categories } = useRole();

  const totalInquiriesCount = buyLeads.length;
  const totalQuotationsValue = quotations.reduce((acc, q) => acc + q.grandTotal, 0);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem' }}>
            <BarChart3 style={{ width: '18px', height: '18px' }} />
            TRADEHIND PLATFORM CONTROL & ANALYTICS CENTER
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Platform Overview & Moderation
          </h1>
        </div>

        <Link href="/admin/sellers" className="btn btn-primary">
          <ShieldCheck style={{ width: '16px', height: '16px' }} />
          Moderate Seller TrustSEAL Badges
        </Link>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #008080' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Total Registered Sellers
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#008080' }}>
            {sellers.length} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>Vendors</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.35rem' }}>
            {sellers.filter(s => s.trustSealStatus).length} TrustSEAL Verified
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #ff6f00' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            RFQs & BuyLeads
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ff6f00' }}>
            {totalInquiriesCount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>RFQs</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
            Live buyer broadcast requirements
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Generated Quotations Value
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>
            ₹{(totalQuotationsValue / 100000).toFixed(1)} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>Lakhs</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.35rem' }}>
            18% GST Compliance Rate
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #d4af37' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Active Industry MCATs
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d4af37' }}>
            {categories.reduce((acc, c) => acc + c.subCategories.length, 0)} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>MCATs</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
            Across {categories.length} Top Categories
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Seller Performance & Verification Directory
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Company Name</th>
              <th style={{ padding: '0.75rem' }}>City</th>
              <th style={{ padding: '0.75rem' }}>GSTIN</th>
              <th style={{ padding: '0.75rem' }}>Tier</th>
              <th style={{ padding: '0.75rem' }}>TrustSEAL</th>
              <th style={{ padding: '0.75rem' }}>Rank Score</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>{s.companyName}</td>
                <td style={{ padding: '0.75rem' }}>{s.city}</td>
                <td style={{ padding: '0.75rem', color: '#64748b' }}>{s.GSTIN}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge badge-${s.subscriptionTier}`} style={{ textTransform: 'capitalize' }}>
                    {s.subscriptionTier}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {s.trustSealStatus ? (
                    <span className="badge badge-trustseal"><ShieldCheck style={{ width: '13px', height: '13px' }} /> Verified</span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>Unverified</span>
                  )}
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: '#008080' }}>
                  #{s.rankScore} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
