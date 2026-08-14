'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Lock, ShieldAlert, LogIn } from 'lucide-react';
import Link from 'next/link';

interface AuthGuardProps {
  requiredRole: 'seller' | 'admin';
  children: React.ReactNode;
}

export default function AuthGuard({ requiredRole, children }: AuthGuardProps) {
  const { currentUser } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = currentUser !== null;
  const isAuthorized = isAuthenticated && currentUser.role === requiredRole;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?requiredRole=${requiredRole}&redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, requiredRole, pathname, router]);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <div style={{ background: '#fee2e2', color: '#b91c1c', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <Lock style={{ width: '32px', height: '32px' }} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Authentication Required</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          You must be logged in as a <strong>{requiredRole.toUpperCase()}</strong> to access this page. Redirecting to login...
        </p>
        <Link href={`/login?requiredRole=${requiredRole}&redirect=${encodeURIComponent(pathname)}`} className="btn btn-primary">
          <LogIn style={{ width: '16px', height: '16px' }} />
          Go to Sign In Page
        </Link>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <div style={{ background: '#fff3e6', color: '#ff6f00', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <ShieldAlert style={{ width: '32px', height: '32px' }} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Restricted</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Your current account (<strong>{currentUser.name}</strong> - <em>{currentUser.role}</em>) does not have <strong>{requiredRole}</strong> privileges.
        </p>
        <Link href={`/login?requiredRole=${requiredRole}&redirect=${encodeURIComponent(pathname)}`} className="btn btn-orange">
          Switch to {requiredRole.toUpperCase()} Account
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
