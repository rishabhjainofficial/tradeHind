import React from 'react';
import AuthGuard from '@/components/auth/AuthGuard';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="seller">{children}</AuthGuard>;
}
