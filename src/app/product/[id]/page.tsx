'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRole } from '@/context/RoleContext';
import SpecsTable from '@/components/client/SpecsTable';
import { formatINR, buildWhatsAppUrl } from '@/lib/formatters';
import { ShieldCheck, CheckCircle2, Star, MapPin, Phone, MessageSquare, Video, FileText, Download, Building, ArrowLeft } from 'lucide-react';

const RFQWizardModal = dynamic(() => import('@/components/client/RFQWizardModal'), {
  ssr: false,
});

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, sellers } = useRole();
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);

  const product = products.find(p => p.id === id) || products[0];
  const seller = sellers.find(s => s.id === product.sellerId) || sellers[0];
  const whatsappUrl = buildWhatsAppUrl(seller.phone, `Hi ${seller.companyName}, I am interested in ${product.title} on TradeHind.`);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link href="/directory" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Directory
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
        {/* Left Column: Image Showcase */}
        <div>
          <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <img
              src={product.images[0]}
              alt={product.title}
              style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>

          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Thumbnail"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Price */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#008080', background: '#e6f2f2', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
              {product.categoryName || 'Industrial B2B Product'}
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              {product.title}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>ESTIMATED WHOLESALE PRICE</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#008080' }}>
              {formatINR(product.pricePerUnit)} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#475569' }}>/ {product.unit}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem' }}>
              <strong>Minimum Order Quantity (MOQ):</strong> {product.minimumOrderQty} {product.unit}
            </div>
          </div>

          {/* Seller Snapshot Box */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <img
                src={seller.logo}
                alt={seller.companyName}
                style={{ width: '54px', height: '54px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
              />
              <div>
                <Link href={`/supplier/${seller.id}`} style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }} className="hover:text-[#008080]">
                  {seller.companyName}
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                  <MapPin style={{ width: '14px', height: '14px', color: '#ff6f00' }} /> {seller.city}, {seller.state}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#b45309', fontWeight: 700 }}>
                    <Star style={{ width: '13px', height: '13px', fill: '#f59e0b', color: '#f59e0b' }} /> {seller.rating}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => setIsRFQModalOpen(true)}>
                <MessageSquare style={{ width: '18px', height: '18px' }} />
                Get Best Price Quote
              </button>
              <a href={`tel:${seller.phone}`} className="btn btn-outline btn-lg">
                <Phone style={{ width: '18px', height: '18px', color: '#16a34a' }} />
              </a>
            </div>
          </div>

          {product.pdfBrochureUrl && (
            <a
              href={product.pdfBrochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ justifyContent: 'center' }}
            >
              <Download style={{ width: '16px', height: '16px' }} /> Download Product Specifications Brochure (PDF)
            </a>
          )}
        </div>
      </div>

      {/* Specifications Section */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
          Technical Specifications Matrix
        </h3>
        <SpecsTable specifications={product.specifications} />
      </div>

      {isRFQModalOpen && (
        <RFQWizardModal targetSupplier={seller} targetProduct={product} onClose={() => setIsRFQModalOpen(false)} />
      )}
    </div>
  );
}
