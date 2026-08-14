'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import Input from '@/components/ui/Input';
import { Building2, LogIn, ShieldCheck, Store, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/lib/types';

function LoginContent() {
  const { login, loginAsRole } = useRole();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get('redirect');
  const requiredRole = (searchParams.get('requiredRole') as UserRole) || 'seller';

  const [selectedRole, setSelectedRole] = useState<UserRole>(requiredRole || 'seller');
  const [email, setEmail] = useState('contact@amritmarbles.com');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState<string | null>(null);

  // Sync default email when switching role tabs
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'seller') {
      setEmail('contact@amritmarbles.com');
    } else if (role === 'admin') {
      setEmail('admin@tradehind.com');
    } else {
      setEmail('sunil@mehtabuilders.in');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email);

    if (user) {
      redirectUser(user.role);
    } else {
      // Fallback: login directly by selected role persona
      const roleUser = loginAsRole(selectedRole);
      if (roleUser) {
        redirectUser(roleUser.role);
      } else {
        setError('Invalid login details.');
      }
    }
  };

  const redirectUser = (userRole: string) => {
    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (userRole === 'seller') {
      router.push('/seller/dashboard');
    } else if (userRole === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <img src="/logo.png" alt="TradeHind" style={{ height: '60px', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Sign In to Your Account</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Select your account role persona below to sign in.
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* Role Persona Selection Tabs */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            Select Account Role
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: '12px' }}>
            <button
              type="button"
              onClick={() => handleRoleSelect('client')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.65rem 0.5rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedRole === 'client' ? '#ffffff' : 'transparent',
                color: selectedRole === 'client' ? '#0284c7' : '#64748b',
                fontWeight: selectedRole === 'client' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: selectedRole === 'client' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <UserCheck style={{ width: '16px', height: '16px' }} />
              Buyer
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('seller')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.65rem 0.5rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedRole === 'seller' ? '#ffffff' : 'transparent',
                color: selectedRole === 'seller' ? '#008080' : '#64748b',
                fontWeight: selectedRole === 'seller' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: selectedRole === 'seller' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Store style={{ width: '16px', height: '16px' }} />
              Seller
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.65rem 0.5rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedRole === 'admin' ? '#ffffff' : 'transparent',
                color: selectedRole === 'admin' ? '#ff6f00' : '#64748b',
                fontWeight: selectedRole === 'admin' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: selectedRole === 'admin' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <ShieldCheck style={{ width: '16px', height: '16px' }} />
              Admin
            </button>
          </div>

          {/* Selected Role Info Banner */}
          <div style={{ marginTop: '0.85rem', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.825rem', background: selectedRole === 'seller' ? '#e6f2f2' : selectedRole === 'admin' ? '#fff3e6' : '#f0f9ff', color: selectedRole === 'seller' ? '#006666' : selectedRole === 'admin' ? '#c2410c' : '#0369a1', border: '1px solid currentColor' }}>
            {selectedRole === 'seller' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span><strong>Seller Account:</strong> Access BuyLeads credit marketplace, CRM Kanban board & GST quotes.</span>
              </div>
            )}

            {selectedRole === 'client' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span><strong>Buyer Account:</strong> Public directory access, RFQ requirement post wizard & quote tracking.</span>
              </div>
            )}

            {selectedRole === 'admin' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span><strong>Admin Desk Account:</strong> Platform analytics, top categories & TrustSEAL document moderation desk.</span>
              </div>
            )}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            id="email-field"
            label="Email Address"
            type="text"
            inputMode="email"
            name="user_identity"
            required
            autoComplete="off"
            data-tempmail-ignore="true"
            data-1p-ignore="true"
            data-lpignore="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />

          <Input
            id="password-field"
            label="Password"
            type="password"
            required
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          <button
            type="submit"
            className="btn btn-lg"
            style={{
              marginTop: '0.5rem',
              background: selectedRole === 'seller' ? '#008080' : selectedRole === 'admin' ? '#ff6f00' : '#0284c7',
              color: '#ffffff',
            }}
          >
            <LogIn style={{ width: '18px', height: '18px' }} />
            Sign In as {selectedRole.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
