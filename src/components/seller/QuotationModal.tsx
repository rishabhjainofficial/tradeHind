'use client';

import React, { useState } from 'react';
import { BuyLead, QuotationItem } from '@/lib/types';
import { useRole } from '@/context/RoleContext';
import { X, Plus, Trash2, FileText, Send } from 'lucide-react';

interface QuotationModalProps {
  lead?: BuyLead | null;
  onClose: () => void;
}

export default function QuotationModal({ lead, onClose }: QuotationModalProps) {
  const { sendQuotation, activeSeller } = useRole();

  const [buyerName, setBuyerName] = useState(lead?.buyerName || 'Sunil Mehta');
  const [buyerCompany, setBuyerCompany] = useState(lead?.buyerCity ? `Mehta Infra (${lead.buyerCity})` : 'Buyer Corp');
  const [validUntil, setValidUntil] = useState('2026-08-30');
  const [note, setNote] = useState('Price includes delivery, GST tax invoice, and 2 years warranty.');

  const [gstRate, setGstRate] = useState<number>(18);
  const [items, setItems] = useState<QuotationItem[]>([
    {
      productTitle: lead?.productTitle || 'Industrial Equipment / CNC System',
      qty: lead?.quantity || 1,
      unitPrice: lead?.targetPrice ? Math.round(lead.targetPrice / (lead.quantity || 1)) : 50000,
      total: lead?.targetPrice || 50000,
    },
  ]);

  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const next = [...items];
    const item = { ...next[index], [field]: value };

    if (field === 'qty' || field === 'unitPrice') {
      item.total = Number(item.qty) * Number(item.unitPrice);
    }

    next[index] = item;
    setItems(next);
  };

  const addItem = () => {
    setItems(prev => [...prev, { productTitle: 'Additional Accessory / Service', qty: 1, unitPrice: 5000, total: 5000 }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, it) => acc + (it.total || 0), 0);
  const taxAmount = Math.round(subtotal * (gstRate / 100));
  const grandTotal = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    sendQuotation({
      leadId: lead?.id,
      sellerId: activeSeller?.id || 'seller_1',
      sellerName: activeSeller?.companyName || 'Apex Industrial Automation Pvt Ltd',
      sellerGSTIN: activeSeller?.GSTIN || '07AAAAA0000A1Z5',
      buyerId: lead?.buyerId || 'user_buyer_1',
      buyerName,
      buyerCompany,
      items,
      subtotal,
      taxRate: gstRate,
      taxAmount,
      grandTotal,
      validUntil,
      note,
      status: 'pending',
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#008080', fontWeight: 700, fontSize: '0.85rem' }}>
              <FileText style={{ width: '16px', height: '16px' }} /> GST DIGITAL QUOTATION GENERATOR
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Generate Official Quote for {buyerName}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>BUYER NAME</label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '0.2rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>BUYER COMPANY</label>
              <input
                type="text"
                value={buyerCompany}
                onChange={(e) => setBuyerCompany(e.target.value)}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '0.2rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>VALID UNTIL</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '0.2rem' }}
              />
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>Line Items & Specifications</label>
              <button type="button" className="btn btn-outline btn-sm" onClick={addItem}>
                <Plus style={{ width: '14px', height: '14px' }} /> Add Line Item
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Item / Service</th>
                  <th style={{ padding: '0.5rem', width: '80px' }}>Qty</th>
                  <th style={{ padding: '0.5rem', width: '120px' }}>Unit Price (₹)</th>
                  <th style={{ padding: '0.5rem', width: '120px' }}>Total (₹)</th>
                  <th style={{ padding: '0.5rem', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.4rem' }}>
                      <input
                        type="text"
                        value={item.productTitle}
                        onChange={(e) => updateItem(idx, 'productTitle', e.target.value)}
                        style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                    <td style={{ padding: '0.4rem' }}>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateItem(idx, 'qty', Number(e.target.value))}
                        style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                    <td style={{ padding: '0.4rem' }}>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))}
                        style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                    <td style={{ padding: '0.4rem', fontWeight: 600 }}>
                      ₹{item.total.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.4rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Calculation Summary */}
          <div style={{ marginLeft: 'auto', width: '300px', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Applicable GST Slab:</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 600, background: '#ffffff' }}
              >
                <option value={0}>0% (Exempt)</option>
                <option value={5}>5% (Dyes/Solvents/Yarn)</option>
                <option value={12}>12% (Marble/Tiles/Machinery)</option>
                <option value={18}>18% (Standard/Services)</option>
                <option value={28}>28% (Heavy Auto/Luxury)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 600 }}>
              <span>GST Tax ({gstRate}%):</span>
              <span>+ ₹{taxAmount.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', borderTop: '1px solid #cbd5e1', paddingTop: '0.4rem', color: '#0f172a' }}>
              <span>Grand Total:</span>
              <span style={{ color: '#008080' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Terms & Delivery Note</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send style={{ width: '16px', height: '16px' }} />
              Send Digital Quote to Buyer Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
