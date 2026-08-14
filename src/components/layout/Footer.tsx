import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '3.5rem 0 2rem', borderTop: '1px solid #1e293b' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <img src="/logo.png" alt="TradeHind" style={{ height: '48px', objectFit: 'contain', background: '#ffffff', padding: '0.35rem 0.65rem', borderRadius: '8px' }} />
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              India's Hybrid B2B Marketplace & Hyperlocal Directory. Synthesizing IndiaMART's bulk RFQ leads with Justdial's verified local search.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#0284c7' }}>
              <ShieldCheck style={{ width: '16px', height: '16px' }} /> 100% TrustSEAL & GST Verified Network
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Top B2B Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link href="/directory?cat=cat_industrial">Industrial CNC & Machinery</Link></li>
              <li><Link href="/directory?cat=cat_chemicals">Industrial Chemicals & Solvents</Link></li>
              <li><Link href="/directory?cat=cat_textiles">Organic Cotton & Textiles</Link></li>
              <li><Link href="/directory?cat=cat_industrial">Industrial CNC & Machinery</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Sourcing & Solutions</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link href="/post-requirement">Post Buy Requirement (RFQ)</Link></li>
              <li><Link href="/directory">Suppliers Near Me (Hyperlocal)</Link></li>
              <li><Link href="/seller/buyleads">BuyLeads Credit Marketplace</Link></li>
              <li><Link href="/seller/lead-manager">Lead CRM & Quote Generator</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Corporate Office</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin style={{ width: '18px', height: '18px', color: '#ff6f00', flexShrink: 0 }} />
                <span>TradeHind Tower, Cyber City Phase II, Gurugram, Haryana 122002</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone style={{ width: '16px', height: '16px', color: '#008080' }} />
                <span>+91 11 4000 9000 (Toll Free)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail style={{ width: '16px', height: '16px', color: '#008080' }} />
                <span>support@tradehind.com</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          © 2026 TradeHind Technologies Pvt Ltd. All rights reserved. Powered by Open-Source Technology Stack.
        </div>
      </div>
    </footer>
  );
}
