'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRole } from '@/context/RoleContext';
import { BuyLead, LeadStatus } from '@/lib/types';
import { formatINR } from '@/lib/formatters';
import { Layers, Phone, Mail, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

const QuotationModal = dynamic(() => import('@/components/seller/QuotationModal'), {
  ssr: false,
});

export default function LeadManagerCRM() {
  const { buyLeads, activeSeller, updateLeadStatus } = useRole();
  const [selectedLeadForQuote, setSelectedLeadForQuote] = useState<BuyLead | null>(null);

  if (!activeSeller) return null;

  const unlockedLeads = buyLeads.filter(l => l.unlockedBySellerIds.includes(activeSeller.id));

  const columns: { status: LeadStatus; title: string; color: string }[] = [
    { status: 'new', title: 'New Unlocked Leads', color: '#ff6f00' },
    { status: 'contacted', title: 'Contacted Buyer', color: '#0284c7' },
    { status: 'quoted', title: 'Quotation Sent', color: '#008080' },
    { status: 'closed', title: 'Closed ✓ Won', color: '#16a34a' },
    { status: 'lost', title: 'Closed ✗ Lost', color: '#94a3b8' },
  ];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#008080', fontWeight: 700, fontSize: '0.85rem' }}>
            <Layers style={{ width: '18px', height: '18px' }} />
            INDIAMART STYLE LEAD MANAGER CRM
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Lead Pipeline & Deal Tracker
          </h1>
        </div>
      </div>

      {/* Kanban Board Grid — horizontal scroll on mobile */}
      <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(220px, 1fr))', gap: '1.25rem', minWidth: '1100px' }}>
        {columns.map((col) => {
          const colLeads = unlockedLeads.filter(l => l.status === col.status);

          return (
            <div key={col.status} style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `3px solid ${col.color}`, paddingBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{col.title}</h3>
                <span style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.15rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {colLeads.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {colLeads.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>
                    No leads in {col.title.toLowerCase()}
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <div key={lead.id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#ffffff' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                          {lead.productTitle}
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          Buyer: <strong>{lead.buyerName}</strong> ({lead.buyerCity})
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#475569', background: '#f1f5f9', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                        Qty: <strong>{lead.quantity} {lead.unit}</strong> {lead.targetPrice ? `• Budget: ${formatINR(lead.targetPrice)}` : ''}
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
                        {col.status === 'new' && (
                          <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => updateLeadStatus(lead.id, 'contacted')}>
                            Move to Contacted <ArrowRight style={{ width: '12px', height: '12px' }} />
                          </button>
                        )}

                        {col.status === 'contacted' && (
                          <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => setSelectedLeadForQuote(lead)}>
                            <FileText style={{ width: '13px', height: '13px' }} /> Create Quote
                          </button>
                        )}

                        {col.status === 'quoted' && (
                          <>
                            <button className="btn btn-orange btn-sm" style={{ width: '100%' }} onClick={() => updateLeadStatus(lead.id, 'closed')}>
                              <CheckCircle2 style={{ width: '13px', height: '13px' }} /> Mark Won
                            </button>
                            <button className="btn btn-outline btn-sm" style={{ width: '100%', color: '#94a3b8' }} onClick={() => updateLeadStatus(lead.id, 'lost')}>
                              Mark Lost
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {selectedLeadForQuote && (
        <QuotationModal lead={selectedLeadForQuote} onClose={() => setSelectedLeadForQuote(null)} />
      )}
    </div>
  );
}
