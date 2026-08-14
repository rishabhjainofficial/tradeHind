import type { MetadataRoute } from 'next';
import { INITIAL_CATEGORIES, INITIAL_SELLERS, INITIAL_PRODUCTS } from '@/lib/data-store';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradehind.com';

  // 1. Core High-Priority Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/post-requirement`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Programmatic SEO City x Category Hubs (e.g. /suppliers/udaipur/marble-stone)
  const popularCities = ['udaipur', 'ahmedabad', 'mumbai', 'new-delhi', 'surat', 'jaipur', 'rajkot', 'bengaluru'];
  const programmaticHubs: MetadataRoute.Sitemap = [];

  for (const city of popularCities) {
    for (const cat of INITIAL_CATEGORIES) {
      programmaticHubs.push({
        url: `${baseUrl}/suppliers/${city}/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  }

  // 3. Verified Supplier Profiles (e.g. /supplier/seller_1)
  const supplierRoutes: MetadataRoute.Sitemap = INITIAL_SELLERS.map((seller) => ({
    url: `${baseUrl}/supplier/${seller.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  // 4. Product Catalog Items (e.g. /product/prod_1)
  const productRoutes: MetadataRoute.Sitemap = INITIAL_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/product/${prod.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...programmaticHubs, ...supplierRoutes, ...productRoutes];
}
