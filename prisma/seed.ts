import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TradeHind PostgreSQL database with expanded MCAT subcategories...');

  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.product.deleteMany();
  await prisma.buyLead.deleteMany();
  await prisma.quotation.deleteMany();

  // 1. Seed Users
  await Promise.all([
    prisma.user.create({
      data: {
        id: 'user_amrit',
        name: 'Amrit Lal Chordia',
        email: 'contact@amritmarbles.com',
        phone: '+91 98290 12345',
        role: 'seller',
        companyName: 'Amrit Marbles',
        city: 'Udaipur',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_bhandari',
        name: 'J R Bhandari',
        email: 'sales@jrbhandari.com',
        phone: '+91 294 2420000',
        role: 'seller',
        companyName: 'J R Bhandari & Sons',
        city: 'Udaipur',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_wolkem',
        name: 'Wolkem India Sales',
        email: 'contact@wolkem.com',
        phone: '+91 294 2491000',
        role: 'seller',
        companyName: 'Wolkem INDIA Ltd',
        city: 'Udaipur',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_reliance_chem',
        name: 'Reliance Chemotex Sales',
        email: 'sales@reliancechemotex.com',
        phone: '+91 294 2490488',
        role: 'seller',
        companyName: 'Reliance Chemotex Industries Limited',
        city: 'Udaipur',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_rswm',
        name: 'RSWM Yarn Division',
        email: 'rswm@lnjbhilwara.com',
        phone: '+91 294 2832200',
        role: 'seller',
        companyName: 'RSWM Ltd',
        city: 'Udaipur',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_active_manpower',
        name: 'Active Services Manager',
        email: 'info@activeservices.in',
        phone: '+91 98250 99887',
        role: 'seller',
        companyName: 'Active Security & Labour Services',
        city: 'Udaipur',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_buyer_1',
        name: 'Sunil Mehta',
        email: 'sunil@mehtabuilders.in',
        phone: '+91 98999 11223',
        role: 'client',
        companyName: 'Mehta Infrastructure Group',
        city: 'New Delhi',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_admin_1',
        name: 'TradeHind Moderator',
        email: 'admin@tradehind.com',
        phone: '+91 11 4000 9000',
        role: 'admin',
        companyName: 'TradeHind HQ',
        city: 'Gurugram',
      },
    }),
  ]);

  // 2. Seed Sellers
  await Promise.all([
    prisma.sellerProfile.create({
      data: {
        id: 'seller_amrit',
        userId: 'user_amrit',
        companyName: 'Amrit Marbles',
        tagline: 'Leading Manufacturer & Supplier of Premium Marble & Tiles in Udaipur',
        logo: 'https://content.jdmagicbox.com/comp/udaipur-rajasthan/s6/9999px294.x294.151231093521.q1s6/catalogue/amrit-marbles-bhuwana-udaipur-rajasthan-tile-dealers-k7cn36gx9c.jpg',
        banner: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        GSTIN: '08AAAAM1234A1Z1',
        businessType: 'Manufacturer & Exporter',
        address: 'Bhuwana Bypass, Near Savitri Bai Phule Chatrawas, Bhuwana',
        city: 'Udaipur',
        state: 'Rajasthan',
        lat: 24.6200,
        lng: 73.7100,
        isOpenNow: true,
        businessHours: '09:00 AM - 08:00 PM (Mon-Sat)',
        responseTimeMinutes: 10,
        trustSealStatus: true,
        gstVerified: true,
        subscriptionTier: 'gold',
        leadCreditsBalance: 150,
        factoryPhotos: [],
        rankScore: 210,
        rating: 4.4,
        reviewCount: 1301,
        establishedYear: 1998,
        employeeCount: '50-100 People',
      },
    }),
    prisma.sellerProfile.create({
      data: {
        id: 'seller_bhandari',
        userId: 'user_bhandari',
        companyName: 'J R Bhandari & Sons',
        tagline: 'Leading Wholesaler of Industrial Solvents, Dyes & Lab Chemicals in Hathipole',
        logo: 'https://content.jdmagicbox.com/v2/comp/udaipur-rajasthan/j9/9999px294.x294.101012164554.b8j9/catalogue/j-r-bhandari-and-sons-hathipole-udaipur-rajasthan-chemical-dealers-os7hdwg2wr.jpg',
        banner: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
        GSTIN: '08AAAJB4321A1Z8',
        businessType: 'Wholesaler & Stockist',
        address: 'Chetak Marg, Opp SBBJ Bank, Hathipole',
        city: 'Udaipur',
        state: 'Rajasthan',
        lat: 24.5880,
        lng: 73.6870,
        isOpenNow: true,
        businessHours: '10:00 AM - 08:00 PM',
        responseTimeMinutes: 8,
        trustSealStatus: true,
        gstVerified: true,
        subscriptionTier: 'gold',
        leadCreditsBalance: 110,
        factoryPhotos: [],
        rankScore: 190,
        rating: 4.8,
        reviewCount: 185,
        establishedYear: 1985,
        employeeCount: '20-50 People',
      },
    }),
    prisma.sellerProfile.create({
      data: {
        id: 'seller_wolkem',
        userId: 'user_wolkem',
        companyName: 'Wolkem INDIA Ltd',
        tagline: 'World Leader in Calcium Carbonate & Industrial Mineral Processing',
        logo: 'https://content.jdmagicbox.com/comp/udaipur-rajasthan/y1/9999px294.x294.101101174353.w7y1/catalogue/wolkem-india-ltd-balicha-udaipur-rajasthan-chemical-calcium-carbonate-manufacturers-1alwhulzsv.jpg',
        banner: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
        GSTIN: '08BBBWK9876B1Z2',
        businessType: 'Manufacturer & Exporter',
        address: 'Mewar Industrial Area, Madri',
        city: 'Udaipur',
        state: 'Rajasthan',
        lat: 24.5600,
        lng: 73.7400,
        isOpenNow: true,
        businessHours: '09:00 AM - 06:30 PM',
        responseTimeMinutes: 5,
        trustSealStatus: true,
        gstVerified: true,
        subscriptionTier: 'gold',
        leadCreditsBalance: 200,
        factoryPhotos: [],
        rankScore: 230,
        rating: 4.9,
        reviewCount: 410,
        establishedYear: 1972,
        employeeCount: '500+ People',
      },
    }),
    prisma.sellerProfile.create({
      data: {
        id: 'seller_reliance_chem',
        userId: 'user_reliance_chem',
        companyName: 'Reliance Chemotex Industries Limited',
        tagline: 'Leading Manufacturer & Exporter of Synthetic & Blended Yarns in Kanpur Udaipur',
        logo: 'https://content.jdmagicbox.com/v2/comp/udaipur-rajasthan/36/9999pmuldelstd25336/catalogue/reliance-chemotex-industries-limited-udaipur-ho-udaipur-rajasthan-yarn-manufacturers-PvfZtiBSl3.jpg',
        banner: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&q=80',
        GSTIN: '08AAACR1122C1Z4',
        businessType: 'Manufacturer & Exporter',
        address: 'Village Kanpur, Post Box 73, Madhuban',
        city: 'Udaipur',
        state: 'Rajasthan',
        lat: 24.5500,
        lng: 73.7300,
        isOpenNow: true,
        businessHours: '09:00 AM - 07:00 PM',
        responseTimeMinutes: 10,
        trustSealStatus: true,
        gstVerified: true,
        subscriptionTier: 'gold',
        leadCreditsBalance: 160,
        factoryPhotos: [],
        rankScore: 205,
        rating: 4.6,
        reviewCount: 273,
        establishedYear: 1977,
        employeeCount: '200-500 People',
      },
    }),
    prisma.sellerProfile.create({
      data: {
        id: 'seller_rswm',
        userId: 'user_rswm',
        companyName: 'RSWM Ltd',
        tagline: 'Flagship Textile Company of LNJ Bhilwara Group - High Performance Blended Yarns',
        logo: 'https://content.jdmagicbox.com/v2/comp/udaipur-rajasthan/m8/9999px294.x294.140113183518.i5m8/catalogue/rswm-limited-rishabhdeo-udaipur-rajasthan-blended-yarn-manufacturers-g9cj5ecrbs.jpg',
        banner: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&q=80',
        GSTIN: '08AAACR9988D1Z9',
        businessType: 'Manufacturer & Global Exporter',
        address: 'Rishabhdeo Industrial Zone',
        city: 'Udaipur',
        state: 'Rajasthan',
        lat: 24.0800,
        lng: 73.6900,
        isOpenNow: true,
        businessHours: '09:00 AM - 06:00 PM',
        responseTimeMinutes: 8,
        trustSealStatus: true,
        gstVerified: true,
        subscriptionTier: 'gold',
        leadCreditsBalance: 180,
        factoryPhotos: [],
        rankScore: 215,
        rating: 4.7,
        reviewCount: 380,
        establishedYear: 1961,
        employeeCount: '500+ People',
      },
    }),
    prisma.sellerProfile.create({
      data: {
        id: 'seller_active_manpower',
        userId: 'user_active_manpower',
        companyName: 'Active Security & Labour Services',
        tagline: 'Reliable Industrial Manpower, Skilled Boiler Operators & Contract Staffing in Udaipur',
        logo: 'https://content.jdmagicbox.com/comp/def_content/manpower-on-contract-basis/8jeifcyzaa-manpower-on-contract-basis-2-nlww3.jpg',
        banner: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
        GSTIN: '08AAACA7766A1Z3',
        businessType: 'Service Provider & Contract Staffing',
        address: 'Madri GIDC Industrial Area',
        city: 'Udaipur',
        state: 'Rajasthan',
        lat: 24.5800,
        lng: 73.7200,
        isOpenNow: true,
        businessHours: '08:30 AM - 08:00 PM',
        responseTimeMinutes: 12,
        trustSealStatus: true,
        gstVerified: true,
        subscriptionTier: 'silver',
        leadCreditsBalance: 75,
        factoryPhotos: [],
        rankScore: 165,
        rating: 4.6,
        reviewCount: 140,
        establishedYear: 2011,
        employeeCount: '100-200 People',
      },
    }),
  ]);

  // 3. Seed Categories with expanded MCATs
  await Promise.all([
    prisma.category.create({
      data: {
        id: 'cat_marbles',
        name: 'Marble, Granite & Natural Stones',
        slug: 'marble-granite',
        iconName: 'Building',
        description: 'White Italian Marble, Green Marble, Granite Slabs & Custom Stones',
        image: 'https://content.jdmagicbox.com/comp/udaipur-rajasthan/s6/9999px294.x294.151231093521.q1s6/catalogue/amrit-marbles-bhuwana-udaipur-rajasthan-tile-dealers-k7cn36gx9c.jpg',
        subCategories: [
          { id: 'sub_white_marble', name: 'Italian White Marble Slabs', slug: 'white-marble' },
          { id: 'sub_green_marble', name: 'Udaipur Green Marble', slug: 'green-marble' },
          { id: 'sub_granite', name: 'Polished Granite Slabs', slug: 'granite-slabs' },
          { id: 'sub_marble_tiles', name: 'Custom Marble Tiles & Statues', slug: 'marble-tiles' },
          { id: 'sub_sandstone', name: 'Sandstone & Slate Slabs', slug: 'sandstone-slabs' },
        ],
      },
    }),
    prisma.category.create({
      data: {
        id: 'cat_chemicals',
        name: 'Chemicals, Dyes & Solvents',
        slug: 'chemicals-dyes',
        iconName: 'FlaskConical',
        description: 'Industrial Solvents, Polymers, Dyes & Minerals',
        image: 'https://content.jdmagicbox.com/v2/comp/udaipur-rajasthan/j9/9999px294.x294.101012164554.b8j9/catalogue/j-r-bhandari-and-sons-hathipole-udaipur-rajasthan-chemical-dealers-os7hdwg2wr.jpg',
        subCategories: [
          { id: 'sub_solvents', name: 'Industrial Solvents & Thinner', slug: 'solvents' },
          { id: 'sub_calcium', name: 'Calcium Carbonate & Minerals', slug: 'calcium-carbonate' },
          { id: 'sub_dyes', name: 'Organic Dyes & Pigments', slug: 'dyes-pigments' },
          { id: 'sub_construction_chem', name: 'Construction Chemical Additives', slug: 'construction-chemicals' },
        ],
      },
    }),
    prisma.category.create({
      data: {
        id: 'cat_textiles',
        name: 'Textiles, Yarns & Fabrics',
        slug: 'textiles-fabrics',
        iconName: 'Shirt',
        description: 'Synthetic Yarns, Blended Yarns & Fabrics',
        image: 'https://content.jdmagicbox.com/v2/comp/udaipur-rajasthan/36/9999pmuldelstd25336/catalogue/reliance-chemotex-industries-limited-udaipur-ho-udaipur-rajasthan-yarn-manufacturers-PvfZtiBSl3.jpg',
        subCategories: [
          { id: 'sub_yarn', name: 'Synthetic & Blended Yarns', slug: 'blended-yarn' },
          { id: 'sub_cotton', name: '100% Organic Cotton Fabric', slug: 'cotton-fabric' },
          { id: 'sub_denim', name: 'Denim & Industrial Canvas', slug: 'denim-canvas' },
          { id: 'sub_threads', name: 'Sewing Threads & Industrial Yarns', slug: 'sewing-threads' },
        ],
      },
    }),
    prisma.category.create({
      data: {
        id: 'cat_industrial',
        name: 'Industrial Machinery & Equipment',
        slug: 'industrial-machinery',
        iconName: 'Cpu',
        description: 'CNC Machines, Presses & Contract Staffing',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
        subCategories: [
          { id: 'sub_cnc', name: 'CNC Lathe & Milling Machines', slug: 'cnc-machines' },
          { id: 'sub_manpower', name: 'Industrial Manpower & Staffing', slug: 'industrial-manpower' },
          { id: 'sub_hydraulic', name: 'Hydraulic Press Systems', slug: 'hydraulic-press' },
          { id: 'sub_automation', name: 'Conveyors & Plant Automation', slug: 'plant-automation' },
        ],
      },
    }),
  ]);

  // 4. Seed Products
  await Promise.all([
    prisma.product.create({
      data: {
        id: 'prod_marble_1',
        sellerId: 'seller_amrit',
        title: 'Premium Italian White Marble Slabs (18mm Polish)',
        description: 'High-gloss polished Italian White Marble slabs sourced and processed in Udaipur for luxury flooring, countertops, and wall cladding.',
        categoryId: 'cat_marbles',
        subCategoryId: 'sub_white_marble',
        categoryName: 'Italian White Marble Slabs',
        pricePerUnit: 240,
        currency: 'INR',
        unit: 'Sq Ft',
        minimumOrderQty: 500,
        images: [
          'https://content.jdmagicbox.com/comp/udaipur-rajasthan/s6/9999px294.x294.151231093521.q1s6/catalogue/amrit-marbles-bhuwana-udaipur-rajasthan-tile-dealers-k7cn36gx9c.jpg',
        ],
        specifications: {
          'Origin': 'Udaipur, Rajasthan',
          'Thickness': '18 mm',
          'Surface Finish': 'Mirror Polished',
        },
      },
    }),
  ]);

  console.log('✅ PostgreSQL database updated with expanded MCATs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
