import React from 'react';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="admin">{children}</AuthGuard>;
}
