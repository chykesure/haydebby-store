import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Seed data
const categories = [
  {
    name: 'Blenders & Mixers',
    slug: 'blenders-mixers',
    description: 'High-performance blenders and stand mixers for every kitchen task',
  },
  {
    name: 'Cooking Appliances',
    slug: 'cooking-appliances',
    description: 'Air fryers, pressure cookers, and smart cooking solutions',
  },
  {
    name: 'Coffee & Beverages',
    slug: 'coffee-beverages',
    description: 'Premium coffee makers, kettles, and juicers',
  },
  {
    name: 'Kitchen Essentials',
    slug: 'kitchen-essentials',
    description: 'Microwaves, toasters, and everyday kitchen must-haves',
  },
  {
    name: 'Food Preparation',
    slug: 'food-preparation',
    description: 'Food processors, choppers, and prep tools',
  },
];

const products = [
  {
    name: 'PowerBlend Pro 3000',
    slug: 'powerblend-pro-3000',
    description: 'The ultimate high-speed blender for smoothies, soups, and more. Features a 1500W motor, 6 stainless steel blades, and 10 speed settings. Built to handle the toughest ingredients with ease. The BPA-free Tritan jar holds up to 1.5 liters, perfect for family-sized portions.',
    shortDesc: '1500W High-Speed Blender with 10 Speed Settings',
    price: 45000,
    comparePrice: 55000,
    sku: 'HDB-BLEND-001',
    stock: 25,
    featured: true,
    categorySlug: 'blenders-mixers',
    image: '/images/products/blender.png',
    specs: JSON.stringify({ Power: '1500W', Capacity: '1.5L', Blades: '6 Stainless Steel', Speeds: '10', Material: 'BPA-Free Tritan', Color: 'Stainless Steel / Black' }),
    rating: 4.8,
    reviewCount: 124,
  },
  {
    name: 'SmartCrisp Air Fryer XL',
    slug: 'smartcrisp-air-fryer-xl',
    description: 'Cook healthier meals with up to 85% less fat using our SmartCrisp technology. The 5.8L capacity basket is perfect for families, and the digital touch screen makes cooking effortless. Features 12 preset cooking programs and rapid air circulation for perfectly crispy results every time.',
    shortDesc: '5.8L Digital Air Fryer with 12 Presets',
    price: 38500,
    comparePrice: 48000,
    sku: 'HDB-AFRY-002',
    stock: 40,
    featured: true,
    categorySlug: 'cooking-appliances',
    image: '/images/products/air-fryer.png',
    specs: JSON.stringify({ Capacity: '5.8L', Power: '1700W', Presets: '12 Programs', Technology: 'Rapid Air Circulation', Display: 'Digital Touch Screen', Timer: '60 Minutes' }),
    rating: 4.6,
    reviewCount: 89,
  },
  {
    name: 'BaristaElite Espresso Machine',
    slug: 'baristaelite-espresso-machine',
    description: 'Bring the coffee shop experience home with the BaristaElite. Features a built-in grinder, milk frother, and programmable brewing options. The 15-bar Italian pump delivers authentic espresso every time. Perfect for coffee enthusiasts who demand quality and convenience.',
    shortDesc: '15-Bar Espresso Machine with Built-in Grinder',
    price: 120000,
    comparePrice: 150000,
    sku: 'HDB-COFF-003',
    stock: 15,
    featured: true,
    categorySlug: 'coffee-beverages',
    image: '/images/products/coffee-maker.png',
    specs: JSON.stringify({ Pump: '15-Bar Italian', Grinder: 'Built-in Conical Burr', Boiler: 'Stainless Steel Thermoblock', WaterTank: '1.8L', Frother: 'Automatic Milk Frother', Presets: '6 Coffee Programs' }),
    rating: 4.9,
    reviewCount: 56,
  },
  {
    name: 'QuickWave Smart Microwave',
    slug: 'quickwave-smart-microwave',
    description: 'Reheat, defrost, and cook with precision using our smart microwave. Features sensor cooking technology that automatically adjusts time and power levels. The 30L capacity fits large dishes, and the sleek stainless steel design complements any modern kitchen.',
    shortDesc: '30L Smart Microwave with Sensor Cooking',
    price: 32000,
    comparePrice: 40000,
    sku: 'HDB-MICR-004',
    stock: 50,
    featured: false,
    categorySlug: 'kitchen-essentials',
    image: '/images/products/microwave.png',
    specs: JSON.stringify({ Capacity: '30L', Power: '1000W', Technology: 'Sensor Cooking', Display: 'LED Digital', Programs: '8 Auto Cook', Turntable: '315mm Glass' }),
    rating: 4.5,
    reviewCount: 167,
  },
  {
    name: 'NutriMaster Food Processor',
    slug: 'nutrimaster-food-processor',
    description: 'The all-in-one kitchen companion for chopping, slicing, shredding, and kneading. Comes with 7 attachments including a dough blade, slicing disc, and shredding disc. The powerful 800W motor handles any task, while the 3.5L bowl accommodates large batches.',
    shortDesc: '800W Food Processor with 7 Attachments',
    price: 42000,
    comparePrice: 52000,
    sku: 'HDB-FPROC-005',
    stock: 30,
    featured: true,
    categorySlug: 'food-preparation',
    image: '/images/products/food-processor.png',
    specs: JSON.stringify({ Power: '800W', Bowl: '3.5L', Attachments: '7 Pieces', Speeds: '2 + Pulse', Material: 'Stainless Steel Blades', Safety: 'Lock System' }),
    rating: 4.7,
    reviewCount: 93,
  },
  {
    name: 'TempControl Electric Kettle',
    slug: 'tempcontrol-electric-kettle',
    description: 'Boil water to the exact temperature you need with our precision temperature control kettle. Features 5 preset temperatures for different beverages, keep-warm function, and a sleek gooseneck spout for easy pouring. The double-wall insulation keeps water hot while the exterior stays cool.',
    shortDesc: 'Gooseneck Kettle with 5 Temperature Presets',
    price: 18500,
    comparePrice: 22000,
    sku: 'HDB-KETL-006',
    stock: 60,
    featured: false,
    categorySlug: 'coffee-beverages',
    image: '/images/products/electric-kettle.png',
    specs: JSON.stringify({ Capacity: '1.2L', Power: '1500W', Presets: '5 Temperature Settings', Spout: 'Gooseneck', Insulation: 'Double-Wall', Material: 'Stainless Steel' }),
    rating: 4.4,
    reviewCount: 201,
  },
  {
    name: 'ArtisanBake Stand Mixer',
    slug: 'artisanbake-stand-mixer',
    description: 'Unleash your baking creativity with our professional stand mixer. The 500W motor and planetary mixing action ensure thorough, consistent mixing every time. Comes with flat beater, dough hook, and wire whip. The tilt-head design makes adding ingredients and changing attachments effortless.',
    shortDesc: '500W Stand Mixer with 3 Attachments',
    price: 55000,
    comparePrice: 65000,
    sku: 'HDB-MIXR-007',
    stock: 20,
    featured: true,
    categorySlug: 'blenders-mixers',
    image: '/images/products/stand-mixer.png',
    specs: JSON.stringify({ Power: '500W', Capacity: '4.5L Bowl', Speeds: '10', Attachments: 'Flat Beater, Dough Hook, Wire Whip', Design: 'Tilt-Head', Color: 'Retro Red' }),
    rating: 4.8,
    reviewCount: 78,
  },
  {
    name: 'GrillMaster Sandwich Maker',
    slug: 'grillmaster-sandwich-maker',
    description: 'Create perfect paninis, grilled sandwiches, and more with our versatile grill. Features non-stick plates, adjustable temperature control, and a floating hinge that accommodates thick sandwiches. The indicator lights let you know when it is ready to cook.',
    shortDesc: 'Non-stick Panini Press with Adjustable Temperature',
    price: 12800,
    comparePrice: 16000,
    sku: 'HDB-SAND-008',
    stock: 75,
    featured: false,
    categorySlug: 'kitchen-essentials',
    image: '/images/products/sandwich-maker.png',
    specs: JSON.stringify({ Power: '750W', Plates: 'Non-stick Coated', Hinge: 'Floating', Temperature: 'Adjustable', Indicator: 'Ready Light', Size: 'Large Plate Area' }),
    rating: 4.3,
    reviewCount: 145,
  },
  {
    name: 'PressurePro Multi-Cooker',
    slug: 'pressurepro-multi-cooker',
    description: 'Cook meals up to 70% faster with our smart multi-cooker. Functions as a pressure cooker, slow cooker, rice cooker, steamer, and warmer all in one. Features 15 smart programs, a 6L capacity, and an easy-to-use digital control panel.',
    shortDesc: '6L Smart Multi-Cooker with 15 Programs',
    price: 48000,
    comparePrice: 58000,
    sku: 'HDB-PRES-009',
    stock: 35,
    featured: true,
    categorySlug: 'cooking-appliances',
    image: '/images/products/pressure-cooker.png',
    specs: JSON.stringify({ Capacity: '6L', Power: '1000W', Programs: '15 Smart Programs', Functions: 'Pressure, Slow Cook, Steam, Rice, Warm', Safety: '12 Safety Features', Pot: 'Non-stick Inner Pot' }),
    rating: 4.7,
    reviewCount: 112,
  },
  {
    name: 'FreshPress Citrus Juicer',
    slug: 'freshpress-citrus-juicer',
    description: 'Start your day with freshly squeezed juice using our powerful citrus juicer. The 100W motor extracts maximum juice with minimal effort. Features two cone sizes for different citrus fruits, a drip-stop function, and an easy-pour spout. All removable parts are dishwasher safe.',
    shortDesc: '100W Electric Citrus Juicer with Drip-Stop',
    price: 12500,
    comparePrice: 15500,
    sku: 'HDB-JUIC-010',
    stock: 55,
    featured: false,
    categorySlug: 'food-preparation',
    image: '/images/products/juicer.png',
    specs: JSON.stringify({ Power: '100W', Cones: '2 Sizes (Large/Small)', Capacity: '1L Jug', Spout: 'Anti-Drip', Parts: 'Dishwasher Safe', Material: 'Stainless Steel Sieve' }),
    rating: 4.2,
    reviewCount: 178,
  },
  {
    name: 'ToastPro 4-Slice Smart Toaster',
    slug: 'toastpro-4-slice-smart-toaster',
    description: 'Perfect toast every time with our smart 4-slice toaster. Features extra-wide slots for artisan bread, 7 browning levels, and smart sensors that adjust toasting time based on bread type. The high-lift lever makes removing small items easy and safe.',
    shortDesc: '4-Slice Toaster with 7 Browning Levels',
    price: 15500,
    comparePrice: 19000,
    sku: 'HDB-TOST-011',
    stock: 45,
    featured: false,
    categorySlug: 'kitchen-essentials',
    image: '/images/products/toaster.png',
    specs: JSON.stringify({ Slots: '4 Extra-Wide', Power: '1600W', Levels: '7 Browning', Functions: 'Defrost, Reheat, Bagel', Lift: 'High-Lift Lever', Crumb: 'Removable Tray' }),
    rating: 4.4,
    reviewCount: 134,
  },
];

const sampleOrders = [
  {
    customerName: 'Adebayo Johnson',
    customerEmail: 'adebayo@email.com',
    customerPhone: '08012345678',
    address: '12 Admiralty Way',
    city: 'Lekki',
    state: 'Lagos',
    notes: null,
    subtotal: 83500,
    shipping: 2500,
    total: 86000,
    status: 'delivered',
    paymentMethod: 'bank_transfer',
    paymentRef: 'PAY-001',
    paidAt: new Date('2025-01-15'),
    itemIndices: [0, 2],
    quantities: [1, 1],
  },
  {
    customerName: 'Chioma Okafor',
    customerEmail: 'chioma@email.com',
    customerPhone: '08098765432',
    address: '45 Allen Avenue',
    city: 'Ikeja',
    state: 'Lagos',
    notes: 'Please call before delivery',
    subtotal: 45000,
    shipping: 2500,
    total: 47500,
    status: 'processing',
    paymentMethod: 'bank_transfer',
    paymentRef: 'PAY-002',
    paidAt: new Date('2025-02-20'),
    itemIndices: [1],
    quantities: [1],
  },
  {
    customerName: 'Ibrahim Musa',
    customerEmail: 'ibrahim@email.com',
    customerPhone: '07034567890',
    address: '8 Buka Street',
    city: 'Wuse 2',
    state: 'Abuja',
    notes: null,
    subtotal: 97000,
    shipping: 0,
    total: 97000,
    status: 'shipped',
    paymentMethod: 'bank_transfer',
    paymentRef: 'PAY-003',
    paidAt: new Date('2025-03-10'),
    itemIndices: [3, 4, 6],
    quantities: [1, 1, 1],
  },
  {
    customerName: 'Fatima Abdullahi',
    customerEmail: 'fatima@email.com',
    customerPhone: '08056781234',
    address: '22 Aminu Kano Crescent',
    city: 'Wuse 2',
    state: 'Abuja',
    notes: 'Gate code: 4521',
    subtotal: 18500,
    shipping: 2500,
    total: 21000,
    status: 'pending',
    paymentMethod: 'bank_transfer',
    paymentRef: null,
    paidAt: null,
    itemIndices: [5],
    quantities: [1],
  },
];

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data in correct order
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  // Create categories
  for (const cat of categories) {
    await db.category.create({ data: cat });
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Create products
  for (const prod of products) {
    const category = await db.category.findUnique({
      where: { slug: prod.categorySlug },
    });
    if (!category) {
      console.error(`❌ Category not found: ${prod.categorySlug}`);
      continue;
    }

    await db.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        shortDesc: prod.shortDesc,
        price: prod.price,
        comparePrice: prod.comparePrice,
        sku: prod.sku,
        stock: prod.stock,
        featured: prod.featured,
        categoryId: category.id,
        images: JSON.stringify([prod.image]),
        rawImage: prod.image,
        enhancedImage: prod.image,
        specs: prod.specs,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
      },
    });
  }
  console.log(`✅ Created ${products.length} products`);

  // Create sample orders
  const allProducts = await db.product.findMany();

  for (const orderData of sampleOrders) {
    const order = await db.order.create({
      data: {
        orderNumber: `HD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state,
        notes: orderData.notes,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total,
        status: orderData.status,
        paymentMethod: orderData.paymentMethod,
        paymentRef: orderData.paymentRef,
        paidAt: orderData.paidAt,
      },
    });

    for (let i = 0; i < orderData.itemIndices.length; i++) {
      const product = allProducts[orderData.itemIndices[i]];
      if (product) {
        await db.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            productName: product.name,
            productImage: product.enhancedImage,
            price: product.price,
            quantity: orderData.quantities[i],
          },
        });
      }
    }
  }
  console.log(`✅ Created ${sampleOrders.length} sample orders`);
  console.log('🎉 Seeding complete!');

  return {
    categories: categories.length,
    products: products.length,
    orders: sampleOrders.length,
  };
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await seed();
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: result,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
