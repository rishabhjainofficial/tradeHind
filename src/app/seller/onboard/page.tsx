'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Building, Store, ShieldCheck, Video, Plus, CheckCircle2, ArrowRight, ArrowLeft, Upload, Sparkles, MapPin } from 'lucide-react';
import MediaUpload from '@/components/common/MediaUpload';

export default function SellerOnboardingPage() {
  const router = useRouter();
  const { categories, addProduct, activeSeller } = useRole();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Business Details
  const [companyName, setCompanyName] = useState(activeSeller?.companyName || '');
  const [businessType, setBusinessType] = useState(activeSeller?.businessType || 'Manufacturer');
  const [city, setCity] = useState(activeSeller?.city || 'Udaipur');
  const [state, setState] = useState(activeSeller?.state || 'Rajasthan');
  const [gstin, setGstin] = useState(activeSeller?.GSTIN || '08AABCB1234F1Z0');
  const [phone, setPhone] = useState(activeSeller?.phone || '+91 98290 12345');
  const [establishedYear, setEstablishedYear] = useState(activeSeller?.establishedYear || 2012);
  const [businessHours, setBusinessHours] = useState(activeSeller?.businessHours || '09:00 AM - 08:00 PM (Mon-Sat)');

  // Step 2: First Product
  const [productTitle, setProductTitle] = useState('Premium White Marble Slab (Udaipur Cut)');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_marbles');
  const [pricePerUnit, setPricePerUnit] = useState(140);
  const [unit, setUnit] = useState('Sq Ft');
  const [moq, setMoq] = useState(500);
  const [productDesc, setProductDesc] = useState('High grade pure white polished marble slab suitable for villas, luxury flooring & export.');
  const [productImage, setProductImage] = useState('https://content.jdmagicbox.com/comp/udaipur-rajasthan/s6/9999px294.x294.151231093521.q1s6/catalogue/amrit-marbles-bhuwana-udaipur-rajasthan-tile-dealers-k7cn36gx9c.jpg');

  // Step 3: Trust Badges & Media
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=demo_factory_tour');
  const [applyTrustSeal, setApplyTrustSeal] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const selectedCategoryObj = categories.find(c => c.id === categoryId) || categories[0];

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    addProduct({
      sellerId: activeSeller?.id || `seller_${Date.now()}`,
      title: productTitle,
      categoryId,
      categoryName: selectedCategoryObj.name,
      subCategoryId: selectedCategoryObj.subCategories[0]?.id || 'sub_1',
      description: productDesc,
      pricePerUnit: Number(pricePerUnit),
      currency: 'INR',
      unit,
      minimumOrderQty: Number(moq),
      images: [productImage],
      specifications: {
        'Material Grade': 'Grade A Export Quality',
        'Origin Location': city,
        'Packaging Type': 'Wooden Crates / Heavy Duty Pallets',
      },
    });

    setIsCompleted(true);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#008080', fontWeight: 700, fontSize: '0.85rem', background: '#e6f2f2', padding: '0.35rem 0.85rem', borderRadius: '20px', marginBottom: '0.5rem' }}>
          <Sparkles style={{ width: '15px', height: '15px', color: '#ff6f00' }} />
          JOIN 10,000+ VERIFIED INDIAN MANUFACTURERS
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
          Seller Onboarding & Catalog Listing Wizard
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Complete your profile in 3 simple steps to get listed, earn TrustSEAL verification, and start receiving broadcast BuyLeads.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: step >= 1 ? '#008080' : '#f1f5f9', color: step >= 1 ? '#ffffff' : '#64748b', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}>
          1. Company & GST Details
        </div>
        <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: step >= 2 ? '#008080' : '#f1f5f9', color: step >= 2 ? '#ffffff' : '#64748b', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}>
          2. First Product Catalog
        </div>
        <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: step >= 3 ? '#008080' : '#f1f5f9', color: step >= 3 ? '#ffffff' : '#64748b', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}>
          3. Video & TrustSEAL
        </div>
      </div>

      {isCompleted ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 style={{ width: '40px', height: '40px' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Congratulations, {companyName}!
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2rem' }}>
            Your business catalog and first product have been published to the TradeHind network. Your TrustSEAL verification application is now in review (+30 pts rank boost).
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary btn-lg" onClick={() => router.push('/seller/dashboard')}>
              Open Seller Dashboard
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => router.push('/directory')}>
              View Live in Directory
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          {/* Left Form */}
          <div className="card" style={{ padding: '2rem' }}>
            {/* STEP 1: BUSINESS DETAILS */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  Business Identification & Tax Details
                </h3>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Company / Firm Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Amrit Marbles & Tiles Pvt Ltd"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Primary Business Type *
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    >
                      <option value="Manufacturer">Manufacturer / Producer</option>
                      <option value="Wholesaler">Wholesaler / Stockist</option>
                      <option value="Trader">Trader / Exporter</option>
                      <option value="Service Provider">Industrial Service Provider</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      GSTIN Tax ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="e.g. 08AABCB1234F1Z0"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      City / Cluster *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Udaipur"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98290 12345"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-end', marginTop: '1rem' }}
                  onClick={() => setStep(2)}
                >
                  Continue to Product Catalog <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            )}

            {/* STEP 2: PRODUCT CATALOG */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  Add Your Primary Product / Service
                </h3>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="e.g. Premium White Marble Slab"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
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
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Price Per Unit (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Unit Measure *
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    >
                      <option value="Sq Ft">Sq Ft</option>
                      <option value="Metric Ton">Metric Ton</option>
                      <option value="Barrel">Barrel / Litre</option>
                      <option value="Piece">Piece / Unit</option>
                      <option value="Kg">Kg</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Minimum Order Quantity (MOQ) *
                    </label>
                    <input
                      type="number"
                      required
                      value={moq}
                      onChange={(e) => setMoq(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Product Description & Specifications
                  </label>
                  <textarea
                    rows={3}
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                {/* MediaUpload WebP Converter for Product Image */}
                <MediaUpload
                  acceptType="image"
                  label="Upload Product Image (Auto-Converts to WebP)"
                  helperText="Images are automatically converted to optimized WebP format with 75%+ size reduction for instant loading."
                  onImageOptimized={(res) => setProductImage(res.dataUrl)}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                    <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                    Continue to Verification <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: VIDEO & TRUSTSEAL */}
            {step === 3 && (
              <form onSubmit={handleFinish} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  TrustSEAL & Video Verification Walkthrough
                </h3>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#166534' }}>
                  <strong>TradeHind Video Differentiator:</strong> Adding a 30-second factory video tour boosts your rank score by <strong>+15 points</strong> and increases buyer inquiries by 3.4x.
                </div>

                {/* MediaUpload Video Compressor for Factory Walkthrough */}
                <MediaUpload
                  acceptType="video"
                  label="Upload 30-60s Factory Walkthrough Video"
                  helperText="Upload MP4 or WebM video. Automatically extracts poster frame thumbnail and verifies bandwidth optimization."
                  onVideoOptimized={(res) => setVideoUrl(res.thumbnailUrl)}
                />

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    id="trustSealToggle"
                    checked={applyTrustSeal}
                    onChange={(e) => setApplyTrustSeal(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#008080' }}
                  />
                  <label htmlFor="trustSealToggle" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                    <strong>Apply for Free TrustSEAL Verification:</strong> Schedule quick premises & GSTIN audit (+30 pts rank boost).
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                    <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back
                  </button>
                  <button type="submit" className="btn btn-orange btn-lg">
                    <CheckCircle2 style={{ width: '18px', height: '18px' }} /> Complete Onboarding & Publish
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Live Preview Card */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Live Listing Preview
            </div>

            <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#008080', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                  {companyName ? companyName.charAt(0) : 'T'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    {companyName || 'Your Company Name'}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {businessType} in {city}, {state}
                  </div>
                </div>
              </div>

              {applyTrustSeal && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-trustseal"><ShieldCheck style={{ width: '12px', height: '12px' }} /> TrustSEAL Verified</span>
                  <span className="badge badge-gst">GSTIN Verified</span>
                </div>
              )}

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Primary Product:</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{productTitle}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#008080', marginTop: '0.2rem' }}>
                  ₹{pricePerUnit} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>/ {unit}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>MOQ: {moq} {unit}</div>
              </div>

              {videoUrl && (
                <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Video style={{ width: '14px', height: '14px' }} /> Factory Tour Available (+15 pts)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
