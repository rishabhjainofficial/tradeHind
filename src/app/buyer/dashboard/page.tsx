'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/context/RoleContext';
import dynamic from 'next/dynamic';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Phone,
  Store,
  PlusCircle,
  ShieldCheck,
  Building,
  Calendar,
  AlertCircle,
  Tag,
  ArrowRight,
  Repeat,
} from 'lucide-react';
import { formatINR, buildWhatsAppUrl } from '@/lib/formatters';

const RFQWizardModal = dynamic(() => import('@/components/client/RFQWizardModal'), {
  ssr: false,
});

export default function BuyerDashboardPage() {
  const { currentUser, buyLeads, quotations, sellers, respondToQuotation } = useRole();
  const [activeTab, setActiveTab] = useState<'rfqs' | 'quotes'>('quotes');
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Filter buyer's own RFQs or show relevant buyer demo RFQs
  const buyerLeads = currentUser
    ? buyLeads.filter(l => l.buyerId === currentUser.id || l.buyerEmail === currentUser.email)
    : buyLeads.slice(0, 3);

  // Filter buyer's received quotations
  const buyerQuotations = currentUser
    ? quotations.filter(q => q.buyerId === currentUser.id || q.buyerName.toLowerCase().includes(currentUser.name.toLowerCase()))
    : quotations;

  const handleRespond = (quoteId: string, status: 'accepted' | 'declined') => {
    respondToQuotation(quoteId, status);
    setFeedbackMessage(
      status === 'accepted'
        ? '✓ Quotation Accepted! Supplier has been notified to proceed with dispatch.'
        : 'Quotation has been declined.'
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const totalRFQValue = buyerLeads.reduce((sum, l) => sum + (l.targetPrice || 0), 0);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            <ShieldCheck style={{ width: '18px', height: '18px' }} />
            BUYER SOURCING DESK & QUOTE INBOX
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            {currentUser ? `${currentUser.name}'s Sourcing Hub` : 'Buyer Dashboard & Inquiries'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Manage your posted RFQ requirements, compare GST quotations, and directly communicate with verified suppliers.
          </p>
        </div>

        <button className="btn btn-orange btn-lg" onClick={() => setIsRFQModalOpen(true)}>
          <PlusCircle style={{ width: '18px', height: '18px' }} />
          Post New Requirement (RFQ)
        </button>
      </div>

      {/* Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', background: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Requirements</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ff6f00', marginTop: '0.25rem' }}>
            {buyerLeads.length} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Posted</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', background: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Digital Quotes Received</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#008080', marginTop: '0.25rem' }}>
            {buyerQuotations.length} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Quotations</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', background: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Estimated Sourcing Value</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            ₹{totalRFQValue > 0 ? totalRFQValue.toLocaleString('en-IN') : '1,50,000+'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Trust Protection</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#15803d', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px' }} /> 100% GST & Verified Suppliers
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 style={{ width: '18px', height: '18px' }} />
          {feedbackMessage}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('quotes')}
          style={{
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'quotes' ? '#008080' : '#64748b',
            borderBottom: activeTab === 'quotes' ? '3px solid #008080' : '3px solid transparent',
            marginBottom: '-2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FileText style={{ width: '16px', height: '16px' }} />
          Received Quotations ({buyerQuotations.length})
        </button>

        <button
          onClick={() => setActiveTab('rfqs')}
          style={{
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'rfqs' ? '#008080' : '#64748b',
            borderBottom: activeTab === 'rfqs' ? '3px solid #008080' : '3px solid transparent',
            marginBottom: '-2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Store style={{ width: '16px', height: '16px' }} />
          My Requirements / RFQs ({buyerLeads.length})
        </button>
      </div>

      {/* TAB 1: RECEIVED QUOTATIONS */}
      {activeTab === 'quotes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {buyerQuotations.length === 0 ? (
            <div className="card" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <FileText style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>No Quotations Received Yet</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Verified suppliers in your category will send itemized GST quotations here when they review your RFQ.
              </p>
              <button className="btn btn-orange" onClick={() => setIsRFQModalOpen(true)}>
                Post a Requirement Now
              </button>
            </div>
          ) : (
            buyerQuotations.map((quote) => {
              const matchingSeller = sellers.find(s => s.id === quote.sellerId);
              const sellerPhone = matchingSeller?.phone || '+919829012345';
              const waUrl = buildWhatsAppUrl(
                sellerPhone,
                `Hi ${quote.sellerName}, I am reviewing quotation #${quote.id} on TradeHind and would like to discuss order terms.`
              );

              return (
                <div key={quote.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                          {quote.sellerName}
                        </h3>
                        {quote.status === 'accepted' ? (
                          <span className="badge badge-open">
                            <CheckCircle2 style={{ width: '13px', height: '13px' }} /> Accepted
                          </span>
                        ) : quote.status === 'declined' ? (
                          <span className="badge badge-closed">
                            <XCircle style={{ width: '13px', height: '13px' }} /> Declined
                          </span>
                        ) : (
                          <span className="badge badge-fast-reply">
                            <Clock style={{ width: '13px', height: '13px' }} /> Awaiting Decision
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        <span>GSTIN: <strong>{quote.sellerGSTIN}</strong></span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar style={{ width: '14px', height: '14px', color: '#ff6f00' }} />
                          Valid Until: <strong>{quote.validUntil}</strong>
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>TOTAL AMOUNT (INCL. GST)</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#008080' }}>
                        ₹{quote.grandTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>
                          <th style={{ paddingBottom: '0.5rem' }}>Item Description</th>
                          <th style={{ paddingBottom: '0.5rem', width: '80px' }}>Qty</th>
                          <th style={{ paddingBottom: '0.5rem', width: '110px' }}>Rate (₹)</th>
                          <th style={{ paddingBottom: '0.5rem', width: '120px', textAlign: 'right' }}>Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quote.items.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < quote.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <td style={{ padding: '0.5rem 0', fontWeight: 600, color: '#0f172a' }}>{item.productTitle}</td>
                            <td style={{ padding: '0.5rem 0' }}>{item.qty}</td>
                            <td style={{ padding: '0.5rem 0' }}>₹{item.unitPrice.toLocaleString('en-IN')}</td>
                            <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>₹{item.total.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', borderTop: '1px solid #cbd5e1', paddingTop: '0.75rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                      <div>Subtotal: <strong>₹{quote.subtotal.toLocaleString('en-IN')}</strong></div>
                      <div style={{ color: '#16a34a' }}>GST Tax ({quote.taxRate || 18}%): <strong>+₹{quote.taxAmount.toLocaleString('en-IN')}</strong></div>
                    </div>
                  </div>

                  {quote.note && (
                    <div style={{ fontSize: '0.825rem', color: '#475569', background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <strong>Supplier Terms:</strong> {quote.note}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', paddingTop: '0.25rem' }}>
                    {quote.status !== 'accepted' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleRespond(quote.id, 'accepted')}>
                        <CheckCircle2 style={{ width: '15px', height: '15px' }} />
                        Accept Quotation
                      </button>
                    )}

                    {quote.status !== 'declined' && quote.status !== 'accepted' && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleRespond(quote.id, 'declined')}>
                        <XCircle style={{ width: '15px', height: '15px', color: '#ef4444' }} />
                        Decline
                      </button>
                    )}

                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ color: '#15803d', borderColor: '#bbf7d0', background: '#f0fdf4' }}>
                      <MessageSquare style={{ width: '14px', height: '14px' }} />
                      WhatsApp Supplier
                    </a>

                    <a href={`tel:${sellerPhone}`} className="btn btn-outline btn-sm">
                      <Phone style={{ width: '14px', height: '14px', color: '#16a34a' }} />
                      Direct Call
                    </a>

                    {matchingSeller && (
                      <Link href={`/supplier/${matchingSeller.id}`} className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
                        View Supplier Profile <ArrowRight style={{ width: '14px', height: '14px' }} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: MY REQUIREMENTS (RFQs) */}
      {activeTab === 'rfqs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {buyerLeads.map((lead) => (
            <div key={lead.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{lead.productTitle}</h3>
                    {lead.leadType === 'broadcast_deal' ? (
                      <span className="badge badge-orange">Multi-Vendor Broadcast</span>
                    ) : (
                      <span className="badge badge-trustseal">Direct Inquiry</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Posted for: <strong>{lead.buyerCity}</strong> • Urgency: <strong>{lead.urgency}</strong>
                  </div>
                </div>

                <div style={{ background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '8px', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SUPPLIERS RESPONDING</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#008080' }}>
                    {lead.unlockedBySellerIds.length} Verified Vendors
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#334155', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                "{lead.description}"
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', paddingTop: '0.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Target Volume: <strong>{lead.quantity} {lead.unit}</strong> {lead.targetPrice ? `• Budget: ₹${lead.targetPrice.toLocaleString('en-IN')}` : ''}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('quotes')}>
                    View Quotes ({buyerQuotations.filter(q => q.leadId === lead.id).length})
                  </button>
                  <button className="btn btn-orange btn-sm" onClick={() => setIsRFQModalOpen(true)}>
                    <Repeat style={{ width: '13px', height: '13px' }} /> Re-Broadcast RFQ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RFQ Modal */}
      {isRFQModalOpen && (
        <RFQWizardModal onClose={() => setIsRFQModalOpen(false)} />
      )}
    </div>
  );
}
