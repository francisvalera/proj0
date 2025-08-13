import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ---- BRANDS ------------------------------------------------------------
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];
  const brandMap = new Map<string, string>();
  for (const name of brands) {
    const b = await prisma.brand.upsert({
      where: { name },
      create: { name },
      update: {},
    });
    brandMap.set(name, b.id);
  }

  // ---- CATEGORIES / SUBCATEGORIES --------------------------------------
  const catalog: Record<string, string[]> = {
    Engine: ["Pistons", "Exhaust"],
    Body: ["Mirrors", "Aerodynamics"],
  };

  const subMap = new Map<string, string>(); // key: `${Category}:${Sub}` -> subcategoryId

  for (const [catName, subs] of Object.entries(catalog)) {
    const cat = await prisma.category.upsert({
      where: { name: catName },
      create: { name: catName },
      update: {},
    });

    for (const s of subs) {
      const sub = await prisma.subcategory.upsert({
        where: { categoryId_name: { categoryId: cat.id, name: s } },
        create: { name: s, categoryId: cat.id },
        update: {},
      });
      subMap.set(`${catName}:${s}`, sub.id);
    }
  }

  // ---- PRODUCTS ---------------------------------------------------------
  // Dev-only: clear existing products so relationships re-seed cleanly
  await prisma.product.deleteMany();

  // inside your creates for each product…
await prisma.product.create({
  data: {
    name: "High-Performance Piston Kit",
    price: 2500,
    brandName: "Brand A",
    stock: 15,
    isFeatured: true,
    // NEW:
    model: "CBR150/CBR250",
    size: "Standard",
    sku: "HP-PST-001",
    // keep your existing relations (subcategoryId/images/etc.)
  },
});

await prisma.product.create({
  data: {
    name: "Racing Brake Caliper Set",
    price: 3800,
    brandName: "Brand B",
    stock: 8,
    isFeatured: true,
    model: "Universal Sport",
    size: "Large",
    sku: "RB-CLP-002",
  },
});

await prisma.product.create({
  data: {
    name: "Titanium Full Exhaust System",
    price: 7950,
    brandName: "Brand C",
    stock: 5,
    isFeatured: true,
    model: "YZF-R3",
    size: "Long",
    sku: "TF-EXH-003",
  },
});

await prisma.product.create({
  data: {
    name: "Custom CNC Side Mirrors",
    price: 1200,
    brandName: "Brand D",
    stock: 20,
    isFeatured: true,
    model: "Naked/Street",
    size: "Pair",
    sku: "CSM-MIR-004",
  },
});

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


// import { PrismaClient, Prisma } from "@prisma/client";
// const prisma = new PrismaClient();

// async function main() {
//   // BRANDS
//   const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];
//   const brandMap = new Map<string, string>();
//   for (const name of brands) {
//     const b = await prisma.brand.upsert({
//       where: { name },
//       create: { name },
//       update: {},
//     });
//     brandMap.set(name, b.id);
//   }

//   // CATEGORIES / SUBCATEGORIES (from earlier)
//   const catalog = {
//     Engine: ["Pistons", "Exhaust"],
//     Body: ["Mirrors", "Aerodynamics"],
//   } as const;

//   const subMap = new Map<string, string>(); // "Engine:Pistons" -> subcategoryId
//   for (const [catName, subs] of Object.entries(catalog)) {
//     const cat = await prisma.category.upsert({
//       where: { name: catName },
//       create: { name: catName },
//       update: {},
//     });
//     for (const s of subs) {
//       const sub = await prisma.subcategory.upsert({
//         where: { categoryId_name: { categoryId: cat.id, name: s } },
//         create: { name: s, categoryId: cat.id },
//         update: {},
//       });
//       subMap.set(`${catName}:${s}`, sub.id);
//     }
//   }

//   // Reset products (dev seed)
//   await prisma.product.deleteMany();

//   const products: Prisma.ProductCreateInput[] = [
//     {
//       name: "High-Performance Piston Kit",
//       price: new Prisma.Decimal(2500),
//       brandName: "Brand A",
//       brand: { connect: { id: brandMap.get("Brand A")! } },
//       sku: "HP-PST-001",
//       size: "Standard",
//       isFeatured: false,
//       stock: 15,
//       productSubcategories: {
//         create: [{ subcategoryId: subMap.get("Engine:Pistons")! }],
//       },
//     },
//     {
//       name: "Racing Brake Caliper Set",
//       price: new Prisma.Decimal(3800),
//       brandName: "Brand B",
//       brand: { connect: { id: brandMap.get("Brand B")! } },
//       sku: "RB-CLP-002",
//       size: "Large",
//       isFeatured: false,
//       stock: 8,
//       productSubcategories: {
//         create: [{ subcategoryId: subMap.get("Body:Aerodynamics")! }],
//       },
//     },
//     {
//       name: "Titanium Full Exhaust System",
//       price: new Prisma.Decimal(7950),
//       brandName: "Brand C",
//       brand: { connect: { id: brandMap.get("Brand C")! } },
//       sku: "TF-EXH-003",
//       size: "Long",
//       isFeatured: false,
//       stock: 5,
//       productSubcategories: {
//         create: [{ subcategoryId: subMap.get("Engine:Exhaust")! }],
//       },
//     },
//     {
//       name: "Custom CNC Side Mirrors",
//       price: new Prisma.Decimal(1200),
//       brandName: "Brand D",
//       brand: { connect: { id: brandMap.get("Brand D")! } },
//       sku: "CSM-MIR-004",
//       size: "Pair",
//       isFeatured: false,
//       stock: 20,
//       productSubcategories: {
//         create: [{ subcategoryId: subMap.get("Body:Mirrors")! }],
//       },
//     },
//   ];

//   for (const p of products) {
//     await prisma.product.create({ data: p });
//   }
// }

// main().finally(() => prisma.$disconnect());


// /* prisma/seed.ts */
// import { PrismaClient, Prisma } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   // 1) Categories & subcategories
//   const catalog = {
//     Engine: ["Pistons", "Exhaust"],
//     Body: ["Mirrors", "Aerodynamics"],
//   } as const;

//   const subMap = new Map<string, string>(); // "Engine:Pistons" -> subcategoryId

//   for (const [catName, subs] of Object.entries(catalog)) {
//     const cat = await prisma.category.upsert({
//       where: { name: catName },
//       create: { name: catName },
//       update: {},
//     });
//     for (const s of subs) {
//       const sub = await prisma.subcategory.upsert({
//         where: { categoryId_name: { categoryId: cat.id, name: s } },
//         create: { name: s, categoryId: cat.id },
//         update: {},
//       });
//       subMap.set(`${catName}:${s}`, sub.id);
//     }
//   }

//   // 2) Products (same four you’ve been using)
//   const products: Array<Prisma.ProductCreateInput> = [
//     {
//       name: "High-Performance Piston Kit",
//       price: new Prisma.Decimal(2500),
//       brandName: "Brand A",
//       isFeatured: false,
//       stock: 15,
//       productSubcategories: {
//         create: [{ subcategoryId: subMap.get("Engine:Pistons")! }],
//       },
//     },
//     {
//       name: "Racing Brake Caliper Set",
//       price: new Prisma.Decimal(3800),
//       brandName: "Brand B",
//       isFeatured: false,
//       stock: 8,
//       productSubcategories: {
//         create: [{ subcategoryId: subMap.get("Body:Aerodynamics")! }],
//       },
//     },
//     {
//       name: "Titanium Full Exhaust System",
//       price: new Prisma.Decimal(7950),
//       brandName: "Brand C",
//       isFeatured: false,
//       stock: 5,
//       productSubcategories: {
//         create: [{ subcategoryId: subMap.get("Engine:Exhaust")! }],
//       },
//     },
//     {
//       name: "Custom CNC Side Mirrors",
//       price: new Prisma.Decimal(1200),
//       brandName: "Brand D",
//       isFeatured: false,
//       stock: 20,
//       productSubcategories: {
//         create: [{ subcategoryId: subMap.get("Body:Mirrors")! }],
//       },
//     },
//   ];

//   // Wipe & re-seed products for a clean mapping (dev-only behavior)
//   await prisma.product.deleteMany();
//   for (const p of products) {
//     await prisma.product.create({ data: p });
//   }
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });


// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Start seeding ...');

//   // --- Clear and Seed Products/Blogs (remains the same) ---
//   await prisma.orderItem.deleteMany();
//   await prisma.product.deleteMany();
//   await prisma.blog.deleteMany();
//   console.log('Cleared existing product and blog data.');
  
//   const defaultImage = "/images/kklogo.jfif";

//   // await prisma.product.createMany({
//   //   data: [
//   //     { name: "High-Performance Piston Kit", price: 2500, brandName: "Brand A", isFeatured: true, stock: 15, imageUrl: defaultImage },
//   //     { name: "Racing Brake Caliper Set", price: 3800, brandName: "Brand B", isFeatured: true, stock: 8, imageUrl: defaultImage },
//   //     { name: "Titanium Full Exhaust System", price: 7950, brandName: "Brand C", isFeatured: true, stock: 5, imageUrl: defaultImage },
//   //     { name: "Custom CNC Side Mirrors", price: 1200, brandName: "Brand D", isFeatured: true, stock: 20, imageUrl: defaultImage },
//   //   ],
//   // });
//   const products = [
//     { name: "High-Performance Piston Kit", price: 2500, brandName: "Brand A", isFeatured: true, stock: 15 },
//     { name: "Racing Brake Caliper Set",    price: 3800, brandName: "Brand B", isFeatured: true, stock: 8  },
//     { name: "Titanium Full Exhaust System", price: 7950, brandName: "Brand C", isFeatured: true, stock: 5  },
//     { name: "Custom CNC Side Mirrors",      price: 1200, brandName: "Brand D", isFeatured: true, stock: 20 },
//   ];

//   for (const p of products) {
//     await prisma.$transaction(async (tx) => {
//       const created = await tx.product.create({ data: p });

//       const img = await tx.productImage.create({
//         data: { productId: created.id, url: defaultImage, sortOrder: 0 },
//       });

//       await tx.product.update({
//         where: { id: created.id },
//         data: { primaryImageId: img.id },
//       });
//     });
//   }
//   console.log('Products created.');

//   await prisma.blog.createMany({
//     data: [
//         { title: "5 Essential Maintenance Checks", excerpt: "Keep your bike running smoothly.", date: "Aug 07, 2025", category: "Maintenance", imageUrl: defaultImage },
//         { title: "Choosing the Right Helmet", excerpt: "A complete guide to safety.", date: "July 31, 2025", category: "Gear", imageUrl: defaultImage },
//         { title: "Highlights from MotoFest 2025", excerpt: "The best bikes and gear.", date: "July 24, 2025", category: "Community", imageUrl: defaultImage },
//     ]
//   });
//   console.log('Blogs created.');

//   // --- Admin User Seeding (remains the same) ---
//   const adminPassword = await bcrypt.hash('Password123!', 10);
//   await prisma.user.upsert({
//     where: { email: 'admin@kuyakardz.com' },
//     update: {},
//     create: {
//       email: 'admin@kuyakardz.com',
//       name: 'Admin User',
//       password: adminPassword,
//       role: 'ADMIN',
//     },
//   });
//   console.log('Admin user created or updated.');

//   // --- NEW: Seed Site Settings ---
//   await prisma.settings.deleteMany();
//   await prisma.settings.create({
//     data: {
//       storeEmail: 'bettercallkiko@gmail.com',
//     },
//   });
//   console.log('Site settings created.');

//   console.log('Seeding finished.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
