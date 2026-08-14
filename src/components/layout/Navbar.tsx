'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Search, MapPin, Building2, LogIn, LogOut, ShieldCheck, PlusCircle, LayoutDashboard, Store, Layers, BarChart3, User, FileText } from 'lucide-react';

import { resolveSearchIntent } from '@/lib/search-intent';

export default function Navbar() {
  const { currentUser, role, logout, activeSeller } = useRole();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && !selectedCity) return;
    const intent = resolveSearchIntent(searchQuery, selectedCity);
    router.push(intent.destinationUrl);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="TradeHind" style={{ height: '48px', objectFit: 'contain' }} />
        </Link>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '480px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', width: '16px', height: '16px' }} />
            <input
              type="text"
              placeholder="Search products, suppliers, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '36px',
                paddingRight: '12px',
                height: '40px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                fontSize: '0.875rem',
                background: '#f8fafc',
              }}
            />
          </div>

          <div style={{ position: 'relative', width: '130px' }}>
            <MapPin style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ff6f00', width: '15px', height: '15px' }} />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '30px',
                height: '40px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                fontSize: '0.825rem',
                background: '#f8fafc',
                cursor: 'pointer',
              }}
            >
              <option value="">All India</option>
              <option value="Udaipur">Udaipur</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Ahmedabad">Ahmedabad</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '20px' }}>
            Search
          </button>
        </form>

        {/* Role Nav & Auth Actions */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Public / Buyer Links */}
          <Link href="/directory" className="btn btn-outline btn-sm">
            Directory
          </Link>

          <Link href="/buyer/dashboard" className="btn btn-outline btn-sm">
            <FileText style={{ width: '14px', height: '14px', color: '#008080' }} />
            Buyer Inbox
          </Link>

          <Link href="/post-requirement" className="btn btn-orange btn-sm">
            <PlusCircle style={{ width: '15px', height: '15px' }} />
            Post Requirement
          </Link>

          {/* Seller Links if logged in as seller */}
          {currentUser && role === 'seller' && (
            <>
              <Link href="/seller/dashboard" className="btn btn-outline btn-sm">
                <LayoutDashboard style={{ width: '15px', height: '15px' }} />
                Dashboard
              </Link>
              <Link href="/seller/buyleads" className="btn btn-primary btn-sm">
                <Store style={{ width: '15px', height: '15px' }} />
                BuyLeads ({activeSeller?.leadCreditsBalance} Credits)
              </Link>
              <Link href="/seller/lead-manager" className="btn btn-outline btn-sm">
                <Layers style={{ width: '15px', height: '15px' }} />
                CRM
              </Link>
            </>
          )}

          {/* Admin Links if logged in as admin */}
          {currentUser && role === 'admin' && (
            <>
              <Link href="/admin/dashboard" className="btn btn-outline btn-sm">
                <BarChart3 style={{ width: '15px', height: '15px' }} />
                Analytics
              </Link>
              <Link href="/admin/sellers" className="btn btn-primary btn-sm">
                <ShieldCheck style={{ width: '15px', height: '15px' }} />
                Moderation Desk
              </Link>
            </>
          )}

          {/* Auth Button: Login vs User Pill */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                <User style={{ width: '14px', height: '14px', color: '#008080' }} />
                <span>{currentUser.name}</span>
                <span className={`badge badge-${role === 'admin' ? 'gold' : role === 'seller' ? 'trustseal' : 'gst'}`} style={{ fontSize: '0.65rem' }}>
                  {role}
                </span>
              </div>

              <button className="btn btn-outline btn-sm" onClick={handleLogout} title="Sign Out">
                <LogOut style={{ width: '14px', height: '14px', color: '#ef4444' }} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm" style={{ borderRadius: '20px' }}>
              <LogIn style={{ width: '15px', height: '15px' }} />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
