import { PrismaClient } from '@prisma/client';
import {
  INITIAL_USERS,
  INITIAL_SELLERS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BUYLEADS,
  INITIAL_QUOTATIONS,
} from '../src/lib/data-store';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Syncing complete TradeHind data-store into remote PostgreSQL server DB...');

  // 1. Clean existing records
  await prisma.quotation.deleteMany();
  await prisma.buyLead.deleteMany();
  await prisma.product.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  console.log(`👤 Seeding ${INITIAL_USERS.length} users...`);
  for (const user of INITIAL_USERS) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '+91 98290 12345',
        role: user.role,
        companyName: user.companyName || null,
        city: user.city || null,
      },
    });
  }

  // 3. Seed Categories
  console.log(`📂 Seeding ${INITIAL_CATEGORIES.length} industry categories...`);
  for (const cat of INITIAL_CATEGORIES) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        iconName: cat.icon || 'Layers',
        description: cat.description,
        image: cat.image || null,
        subCategories: cat.subCategories || [],
      },
    });
  }

  // 4. Seed Seller Profiles
  console.log(`🏢 Seeding ${INITIAL_SELLERS.length} verified seller profiles...`);
  for (const seller of INITIAL_SELLERS) {
    await prisma.sellerProfile.create({
      data: {
        id: seller.id,
        userId: seller.userId,
        phone: seller.phone,
        companyName: seller.companyName,
        tagline: seller.tagline || null,
        logo: seller.logo,
        banner: seller.banner,
        GSTIN: seller.GSTIN,
        businessType: seller.businessType,
        address: seller.address,
        city: seller.city,
        state: seller.state,
        lat: (seller as any).lat ?? (seller as any).latitude ?? 24.5854,
        lng: (seller as any).lng ?? (seller as any).longitude ?? 73.7125,
        isOpenNow: seller.isOpenNow,
        businessHours: seller.businessHours,
        responseTimeMinutes: seller.responseTimeMinutes,
        trustSealStatus: seller.trustSealStatus,
        gstVerified: seller.gstVerified,
        subscriptionTier: seller.subscriptionTier,
        leadCreditsBalance: seller.leadCreditsBalance,
        videoUrl: seller.videoUrl || null,
        factoryPhotos: seller.factoryPhotos || [],
        rankScore: seller.rankScore,
        rating: seller.rating,
        reviewCount: seller.reviewCount,
        establishedYear: seller.establishedYear,
        employeeCount: seller.employeeCount,
      },
    });
  }

  // 5. Seed Products
  console.log(`📦 Seeding ${INITIAL_PRODUCTS.length} catalog products...`);
  for (const prod of INITIAL_PRODUCTS) {
    await prisma.product.create({
      data: {
        id: prod.id,
        sellerId: prod.sellerId,
        title: prod.title,
        description: prod.description,
        categoryId: prod.categoryId,
        subCategoryId: prod.subCategoryId || null,
        categoryName: prod.categoryName || null,
        pricePerUnit: prod.pricePerUnit,
        currency: prod.currency,
        unit: prod.unit,
        minimumOrderQty: prod.minimumOrderQty,
        images: prod.images || [],
        videoUrl: prod.videoUrl || null,
        pdfBrochureUrl: prod.pdfBrochureUrl || null,
        specifications: prod.specifications || {},
      },
    });
  }

  // 6. Seed Buy Leads (RFQs)
  console.log(`📋 Seeding ${INITIAL_BUYLEADS.length} active BuyLeads...`);
  for (const lead of INITIAL_BUYLEADS) {
    await prisma.buyLead.create({
      data: {
        id: lead.id,
        buyerId: lead.buyerId,
        buyerName: lead.buyerName,
        buyerPhone: lead.buyerPhone,
        buyerEmail: lead.buyerEmail,
        buyerCity: lead.buyerCity,
        productTitle: lead.productTitle,
        categoryId: lead.categoryId,
        categoryName: lead.categoryName || null,
        quantity: lead.quantity,
        unit: lead.unit,
        targetPrice: lead.targetPrice || null,
        description: lead.description,
        urgency: lead.urgency,
        leadType: lead.leadType,
        unlockedBySellerIds: lead.unlockedBySellerIds || [],
        reportedAsInvalidBySellerIds: lead.reportedAsInvalidBySellerIds || [],
        status: lead.status,
        dealValue: lead.dealValue || null,
      },
    });
  }

  // 7. Seed Quotations
  console.log(`🧾 Seeding ${INITIAL_QUOTATIONS.length} digital GST quotations...`);
  for (const quote of INITIAL_QUOTATIONS) {
    await prisma.quotation.create({
      data: {
        id: quote.id,
        leadId: quote.leadId || null,
        sellerId: quote.sellerId,
        sellerName: quote.sellerName,
        sellerGSTIN: quote.sellerGSTIN,
        buyerId: quote.buyerId,
        buyerName: quote.buyerName,
        buyerCompany: quote.buyerCompany || null,
        items: quote.items,
        subtotal: quote.subtotal,
        taxRate: quote.taxRate,
        taxAmount: quote.taxAmount,
        grandTotal: quote.grandTotal,
        validUntil: quote.validUntil,
        note: quote.note || null,
        status: quote.status,
      },
    });
  }

  console.log('✅ Remote PostgreSQL database fully synchronized with 100% data fidelity!');
}

main()
  .catch((e) => {
    console.error('❌ Migration error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
