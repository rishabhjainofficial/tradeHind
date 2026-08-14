'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, User, SellerProfile, Product, Category, BuyLead, Quotation, Message, SubscriptionTier } from '@/lib/types';
import { INITIAL_USERS, INITIAL_SELLERS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BUYLEADS, INITIAL_QUOTATIONS, INITIAL_MESSAGES } from '@/lib/data-store';
import { calculateSellerRankScore } from '@/lib/ranking';
import { apiPost } from '@/lib/api-client';

interface RoleContextType {
  currentUser: User | null;
  role: UserRole;
  activeSeller: SellerProfile | null;
  users: User[];
  sellers: SellerProfile[];
  products: Product[];
  categories: Category[];
  buyLeads: BuyLead[];
  quotations: Quotation[];
  messages: Message[];
  
  // Auth Actions
  login: (email: string) => User | null;
  loginAsRole: (targetRole: UserRole) => User | null;
  logout: () => void;

  // Data Actions
  unlockBuyLead: (leadId: string, sellerId: string) => boolean;
  refundBuyLead: (leadId: string, sellerId: string, reason: string) => boolean;
  postBuyRequirement: (lead: Omit<BuyLead, 'id' | 'unlockedBySellerIds' | 'status' | 'createdAt'>) => BuyLead;
  sendQuotation: (quotationData: Omit<Quotation, 'id' | 'createdAt'>) => Quotation;
  respondToQuotation: (quotationId: string, status: 'accepted' | 'declined') => void;
  updateLeadStatus: (leadId: string, status: BuyLead['status']) => void;
  updateSellerVerification: (sellerId: string, tier: SubscriptionTier, trustSeal: boolean) => void;
  rechargeCredits: (sellerId: string, credits: number, newTier?: SubscriptionTier) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users] = useState<User[]>(INITIAL_USERS);
  const [sellers, setSellers] = useState<SellerProfile[]>(INITIAL_SELLERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [buyLeads, setBuyLeads] = useState<BuyLead[]>(INITIAL_BUYLEADS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  // Derived role: 'client' if logged out, otherwise currentUser.role
  const role: UserRole = currentUser ? currentUser.role : 'client';

  // Active seller if logged in as seller — returns null if no match found
  const activeSeller = currentUser && currentUser.role === 'seller'
    ? sellers.find(s => s.userId === currentUser.id) || null
    : null;

  // Auth: Login by email
  const login = (email: string): User | null => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  // Auth: Login helper by Role for quick testing
  const loginAsRole = (targetRole: UserRole): User | null => {
    const user = users.find(u => u.role === targetRole);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  // Auth: Logout
  const logout = () => {
    setCurrentUser(null);
  };

  // Action: Unlock Buy Lead using 1 credit
  const unlockBuyLead = (leadId: string, sellerId: string): boolean => {
    const seller = sellers.find(s => s.id === sellerId);
    if (!seller || seller.leadCreditsBalance < 1) return false;

    // Idempotency guard — prevent double deduction if already unlocked
    const lead = buyLeads.find(l => l.id === leadId);
    if (!lead) return false;
    if (lead.unlockedBySellerIds.includes(sellerId)) return true; // already unlocked, no charge

    setSellers(prev =>
      prev.map(s => (s.id === sellerId ? { ...s, leadCreditsBalance: s.leadCreditsBalance - 1 } : s))
    );

    setBuyLeads(prev =>
      prev.map(l =>
        l.id === leadId
          ? {
              ...l,
              unlockedBySellerIds: [...l.unlockedBySellerIds, sellerId],
              status: l.status === 'new' ? 'contacted' : l.status,
            }
          : l
      )
    );

    // Background server audit logging
    apiPost('/api/leads/unlock', { leadId, sellerId, currentCredits: seller.leadCreditsBalance });

    return true;
  };

  // Action: Post Buy Requirement (RFQ)
  const postBuyRequirement = (leadData: Omit<BuyLead, 'id' | 'unlockedBySellerIds' | 'status' | 'createdAt'>): BuyLead => {
    const newLead: BuyLead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      unlockedBySellerIds: [],
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setBuyLeads(prev => [newLead, ...prev]);

    // Background server broadcast
    apiPost('/api/rfq', newLead);

    return newLead;
  };

  // Action: Send Quotation
  const sendQuotation = (quotationData: Omit<Quotation, 'id' | 'createdAt'>): Quotation => {
    const newQuotation: Quotation = {
      ...quotationData,
      status: quotationData.status || 'pending',
      id: `quote_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setQuotations(prev => [newQuotation, ...prev]);

    if (quotationData.leadId) {
      setBuyLeads(prev =>
        prev.map(l => (l.id === quotationData.leadId ? { ...l, status: 'quoted' } : l))
      );
    }

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: quotationData.leadId ? `conv_${quotationData.leadId}` : 'conv_general',
      senderId: currentUser?.id || 'user_1',
      senderRole: 'seller',
      text: `Generated quotation #${newQuotation.id} for ₹${newQuotation.grandTotal.toLocaleString('en-IN')}`,
      quotation: newQuotation,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Background server quotation log
    apiPost('/api/quotation', newQuotation);

    return newQuotation;
  };

  // Action: Lead Quality Guarantee — Refund credit for fake/unresponsive lead
  const refundBuyLead = (leadId: string, sellerId: string, reason: string): boolean => {
    const lead = buyLeads.find(l => l.id === leadId);
    if (!lead || !lead.unlockedBySellerIds.includes(sellerId)) return false;
    if (lead.reportedAsInvalidBySellerIds?.includes(sellerId)) return false; // already refunded

    // Refund credit back to seller wallet
    setSellers(prev =>
      prev.map(s => (s.id === sellerId ? { ...s, leadCreditsBalance: s.leadCreditsBalance + 1 } : s))
    );

    // Update lead with reported status
    setBuyLeads(prev =>
      prev.map(l =>
        l.id === leadId
          ? {
              ...l,
              reportedAsInvalidBySellerIds: [...(l.reportedAsInvalidBySellerIds || []), sellerId],
            }
          : l
      )
    );

    // Background server refund audit
    apiPost('/api/leads/refund', { leadId, sellerId, reason });

    return true;
  };

  // Action: Buyer Responds to Quotation (Accept/Decline)
  const respondToQuotation = (quotationId: string, status: 'accepted' | 'declined') => {
    setQuotations(prev =>
      prev.map(q => (q.id === quotationId ? { ...q, status } : q))
    );
  };

  // Action: Update Lead Status
  const updateLeadStatus = (leadId: string, status: BuyLead['status']) => {
    setBuyLeads(prev => prev.map(l => (l.id === leadId ? { ...l, status } : l)));
  };

  // Action: Admin Moderation
  const updateSellerVerification = (sellerId: string, tier: SubscriptionTier, trustSeal: boolean) => {
    setSellers(prev =>
      prev.map(s => {
        if (s.id === sellerId) {
          const updated = { ...s, subscriptionTier: tier, trustSealStatus: trustSeal };
          updated.rankScore = calculateSellerRankScore(updated);
          return updated;
        }
        return s;
      })
    );
  };

  // Action: Recharge Credits & Upgrade Tier
  const rechargeCredits = (sellerId: string, credits: number, newTier?: SubscriptionTier) => {
    setSellers(prev =>
      prev.map(s => {
        if (s.id === sellerId) {
          const updated = {
            ...s,
            leadCreditsBalance: s.leadCreditsBalance + credits,
            subscriptionTier: newTier || s.subscriptionTier,
          };
          updated.rankScore = calculateSellerRankScore(updated);
          return updated;
        }
        return s;
      })
    );

    // Background server wallet top-up log
    apiPost('/api/wallet/recharge', {
      sellerId,
      credits,
      amount: credits >= 100 ? 3499 : 999,
      paymentMethod: 'upi',
    });
  };

  // Action: Add Product
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);

    // Background server catalog publish log
    apiPost('/api/products', newProduct);

    return newProduct;
  };

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        role,
        activeSeller,
        users,
        sellers,
        products,
        categories,
        buyLeads,
        quotations,
        messages,
        login,
        loginAsRole,
        logout,
        unlockBuyLead,
        refundBuyLead,
        postBuyRequirement,
        sendQuotation,
        respondToQuotation,
        updateLeadStatus,
        updateSellerVerification,
        rechargeCredits,
        addProduct,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
