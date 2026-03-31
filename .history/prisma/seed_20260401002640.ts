import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

const categories = [
  { name: 'Blenders & Mixers', slug: 'blenders-mixers', description: 'High-performance blenders and stand mixers for every kitchen task' },
  { name: 'Cooking Appliances', slug: 'cooking-appliances', description: 'Air fryers, pressure cookers, and smart cooking solutions' },
  { name: 'Coffee & Beverages', slug: 'coffee-beverages', description: 'Premium coffee makers, kettles, and juicers' },
  { name: 'Kitchen Essentials', slug: 'kitchen-essentials', description: 'Microwaves, toasters, and everyday kitchen must-haves' },
  { name: 'Food Preparation', slug: 'food-preparation', description: 'Food processors, choppers, and prep tools' },
];

const products = [
  { name: 'PowerBlend Pro 3000', slug: 'powerblend-pro-3000', description: 'The ultimate high-speed blender for smoothies, soups, and more. Features a 1500W motor, 6 stainless steel blades, and 10 speed settings.', shortDesc: '1500W High-Speed Blender with 10 Speed Settings', price: 45000, comparePrice: 55000, sku: 'HDB-BLEND-001', stock: 25, featured: true, categorySlug: 'blenders-mixers', image: '/images/products/blender.png', specs: { Power: '1500W', Capacity: '1.5L', Blades: '6 Stainless Steel', Speeds: '10' }, rating: 4.8, reviewCount: 124 },
  { name: 'SmartCrisp Air Fryer XL', slug: 'smartcrisp-air-fryer-xl', description: 'Cook healthier meals with up to 85% less fat. 5.8L capacity, digital touch screen, 12 preset programs.', shortDesc: '5.8L Digital Air Fryer with 12 Presets', price: 38500, comparePrice: 48000, sku: 'HDB-AFRY-002', stock: 40, featured: true, categorySlug: 'cooking-appliances', image: '/images/products/air-fryer.png', specs: { Capacity: '5.8L', Power: '1700W', Presets: '12 Programs' }, rating: 4.6, reviewCount: 89 },
  { name: 'BaristaElite Espresso Machine', slug: 'baristaelite-espresso-machine', description: 'Professional espresso with built-in grinder, milk frother, and 15-bar Italian pump.', shortDesc: '15-Bar Espresso Machine with Built-in Grinder', price: 120000, comparePrice: 150000, sku: 'HDB-COFF-003', stock: 15, featured: true, categorySlug: 'coffee-beverages', image: '/images/products/coffee-maker.png', specs: { Pump: '15-Bar Italian', Grinder: 'Built-in', WaterTank: '1.8L' }, rating: 4.9, reviewCount: 56 },
  { name: 'QuickWave Smart Microwave', slug: 'quickwave-smart-microwave', description: 'Smart microwave with sensor cooking technology. 30L capacity, sleek stainless steel design.', shortDesc: '30L Smart Microwave with Sensor Cooking', price: 32000, comparePrice: 40000, sku: 'HDB-MICR-004', stock: 50, featured: false, categorySlug: 'kitchen-essentials', image: '/images/products/microwave.png', specs: { Capacity: '30L', Power: '1000W', Programs: '8 Auto Cook' }, rating: 4.5, reviewCount: 167 },
  { name: 'NutriMaster Food Processor', slug: 'nutrimaster-food-processor', description: 'All-in-one kitchen companion with 7 attachments. 800W motor, 3.5L bowl.', shortDesc: '800W Food Processor with 7 Attachments', price: 42000, comparePrice: 52000, sku: 'HDB-FPROC-005', stock: 30, featured: true, categorySlug: 'food-preparation', image: '/images/products/food-processor.png', specs: { Power: '800W', Bowl: '3.5L', Attachments: '7 Pieces' }, rating: 4.7, reviewCount: 93 },
  { name: 'TempControl Electric Kettle', slug: 'tempcontrol-electric-kettle', description: 'Precision temperature control with 5 presets, keep-warm function, gooseneck spout.', shortDesc: 'Gooseneck Kettle with 5 Temperature Presets', price: 18500, comparePrice: 22000, sku: 'HDB-KETL-006', stock: 60, featured: false, categorySlug: 'coffee-beverages', image: '/images/products/electric-kettle.png', specs: { Capacity: '1.2L', Power: '1500W', Presets: '5 Settings' }, rating: 4.4, reviewCount: 201 },
  { name: 'ArtisanBake Stand Mixer', slug: 'artisanbake-stand-mixer', description: 'Professional stand mixer with 500W motor, planetary mixing action, tilt-head design.', shortDesc: '500W Stand Mixer with 3 Attachments', price: 55000, comparePrice: 65000, sku: 'HDB-MIXR-007', stock: 20, featured: true, categorySlug: 'blenders-mixers', image: '/images/products/stand-mixer.png', specs: { Power: '500W', Capacity: '4.5L Bowl', Speeds: '10' }, rating: 4.8, reviewCount: 78 },
  { name: 'GrillMaster Sandwich Maker', slug: 'grillmaster-sandwich-maker', description: 'Non-stick plates, adjustable temperature, floating hinge for thick sandwiches.', shortDesc: 'Non-stick Panini Press with Adjustable Temperature', price: 12800, comparePrice: 16000, sku: 'HDB-SAND-008', stock: 75, featured: false, categorySlug: 'kitchen-essentials', image: '/images/products/sandwich-maker.png', specs: { Power: '750W', Plates: 'Non-stick', Hinge: 'Floating' }, rating: 4.3, reviewCount: 145 },
  { name: 'PressurePro Multi-Cooker', slug: 'pressurepro-multi-cooker', description: '6L smart multi-cooker with 15 programs. Pressure, slow cook, steam, rice, warm.', shortDesc: '6L Smart Multi-Cooker with 15 Programs', price: 48000, comparePrice: 58000, sku: 'HDB-PRES-009', stock: 35, featured: true, categorySlug: 'cooking-appliances', image: '/images/products/pressure-cooker.png', specs: { Capacity: '6L', Power: '1000W', Programs: '15 Smart' }, rating: 4.7, reviewCount: 112 },
  { name: 'FreshPress Citrus Juicer', slug: 'freshpress-citrus-juicer', description: 'Powerful 100W citrus juicer with two cone sizes, drip-stop, dishwasher safe parts.', shortDesc: '100W Electric Citrus Juicer with Drip-Stop', price: 12500, comparePrice: 15500, sku: 'HDB-JUIC-010', stock: 55, featured: false, categorySlug: 'food-preparation', image: '/images/products/juicer.png', specs: { Power: '100W', Cones: '2 Sizes', Capacity: '1L' }, rating: 4.2, reviewCount: 178 },
  { name: 'ToastPro 4-Slice Smart Toaster', slug: 'toastpro-4-slice-smart-toaster', description: 'Smart 4-slice toaster with extra-wide slots, 7 browning levels, high-lift lever.', shortDesc: '4-Slice Toaster with 7 Browning Levels', price: 15500, comparePrice: 19000, sku: 'HDB-TOST-011', stock: 45, featured: false, categorySlug: 'kitchen-essentials', image: '/images/products/toaster.png', specs: { Slots: '4 Extra-Wide', Power: '1600W', Levels: '7' }, rating: 4.4, reviewCount: 134 },
];

async function seed() {
  console.log('Seeding database...');

  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  for (const cat of categories) {
    await db.category.create({ data: cat });
  }
  console.log(`Created ${categories.length} categories`);

  for (const prod of products) {
    const category = await db.category.findUnique({ where: { slug: prod.categorySlug } });
    if (!category) continue;
    await db.product.create({
      data: {
        name: prod.name, slug: prod.slug, description: prod.description,
        shortDesc: prod.shortDesc, price: prod.price, comparePrice: prod.comparePrice,
        sku: prod.sku, stock: prod.stock, featured: prod.featured,
        categoryId: category.id,
        images: JSON.stringify([prod.image]),
        rawImage: prod.image, enhancedImage: prod.image,
        specs: JSON.stringify(prod.specs),
        rating: prod.rating, reviewCount: prod.reviewCount,
      },
    });
  }
  console.log(`Created ${products.length} products`);

  const allProducts = await db.product.findMany();
  const orders = [
    { name: 'Adebayo Johnson', email: 'adebayo@email.com', phone: '08012345678', address: '12 Admiralty Way', city: 'Lekki', state: 'Lagos', notes: null, subtotal: 83500, shipping: 2500, total: 86000, status: 'delivered', ref: 'PAY-001', paidAt: '2025-01-15', items: [0,2], qty: [1,1] },
    { name: 'Chioma Okafor', email: 'chioma@email.com', phone: '08098765432', address: '45 Allen Avenue', city: 'Ikeja', state: 'Lagos', notes: 'Please call before delivery', subtotal: 45000, shipping: 2500, total: 47500, status: 'processing', ref: 'PAY-002', paidAt: '2025-02-20', items: [1], qty: [1] },
    { name: 'Ibrahim Musa', email: 'ibrahim@email.com', phone: '07034567890', address: '8 Buka Street', city: 'Wuse 2', state: 'Abuja', notes: null, subtotal: 97000, shipping: 0, total: 97000, status: 'shipped', ref: 'PAY-003', paidAt: '2025-03-10', items: [3,4,6], qty: [1,1,1] },
  ];
  for (const o of orders) {
    const order = await db.order.create({
      data: {
        orderNumber: `HD-${Date.now()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`,
        customerName: o.name, customerEmail: o.email, customerPhone: o.phone,
        address: o.address, city: o.city, state: o.state, notes: o.notes,
        subtotal: o.subtotal, shipping: o.shipping, total: o.total,
        status: o.status, paymentMethod: 'bank_transfer', paymentRef: o.ref,
        paidAt: o.paidAt ? new Date(o.paidAt) : null,
      },
    });
    for (let i = 0; i < o.items.length; i++) {
      const product = allProducts[o.items[i]];
      if (product) {
        await db.orderItem.create({
          data: { orderId: order.id, productId: product.id, productName: product.name, productImage: product.enhancedImage, price: product.price, quantity: o.qty[i] },
        });
      }
    }
  }
  console.log(`Created ${orders.length} sample orders`);

  const adminPassword = await bcrypt.hash('admin123', 10);
  await db.user.upsert({
    where: { email: 'admin@haydebby.ng' },
    update: {},
    create: { name: 'HayDebby Admin', email: 'admin@haydebby.ng', password: adminPassword, role: 'admin' },
  });
  console.log('Created admin user (admin@haydebby.ng / admin123)');
  console.log('Seeding complete!');
}

seed().catch((e) => { console.error('Seed error:', e); process.exit(1); }).finally(() => db.$disconnect());
