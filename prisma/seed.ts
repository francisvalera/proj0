import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Clear and Seed Products/Blogs (remains the same) ---
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.blog.deleteMany();
  console.log('Cleared existing product and blog data.');
  
  const defaultImage = "/images/kklogo.jfif";

  // await prisma.product.createMany({
  //   data: [
  //     { name: "High-Performance Piston Kit", price: 2500, brandName: "Brand A", isFeatured: true, stock: 15, imageUrl: defaultImage },
  //     { name: "Racing Brake Caliper Set", price: 3800, brandName: "Brand B", isFeatured: true, stock: 8, imageUrl: defaultImage },
  //     { name: "Titanium Full Exhaust System", price: 7950, brandName: "Brand C", isFeatured: true, stock: 5, imageUrl: defaultImage },
  //     { name: "Custom CNC Side Mirrors", price: 1200, brandName: "Brand D", isFeatured: true, stock: 20, imageUrl: defaultImage },
  //   ],
  // });
  const products = [
    { name: "High-Performance Piston Kit", price: 2500, brandName: "Brand A", isFeatured: true, stock: 15 },
    { name: "Racing Brake Caliper Set",    price: 3800, brandName: "Brand B", isFeatured: true, stock: 8  },
    { name: "Titanium Full Exhaust System", price: 7950, brandName: "Brand C", isFeatured: true, stock: 5  },
    { name: "Custom CNC Side Mirrors",      price: 1200, brandName: "Brand D", isFeatured: true, stock: 20 },
  ];

  for (const p of products) {
    await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({ data: p });

      const img = await tx.productImage.create({
        data: { productId: created.id, url: defaultImage, sortOrder: 0 },
      });

      await tx.product.update({
        where: { id: created.id },
        data: { primaryImageId: img.id },
      });
    });
  }
  console.log('Products created.');

  await prisma.blog.createMany({
    data: [
        { title: "5 Essential Maintenance Checks", excerpt: "Keep your bike running smoothly.", date: "Aug 07, 2025", category: "Maintenance", imageUrl: defaultImage },
        { title: "Choosing the Right Helmet", excerpt: "A complete guide to safety.", date: "July 31, 2025", category: "Gear", imageUrl: defaultImage },
        { title: "Highlights from MotoFest 2025", excerpt: "The best bikes and gear.", date: "July 24, 2025", category: "Community", imageUrl: defaultImage },
    ]
  });
  console.log('Blogs created.');

  // --- Admin User Seeding (remains the same) ---
  const adminPassword = await bcrypt.hash('Password123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@kuyakardz.com' },
    update: {},
    create: {
      email: 'admin@kuyakardz.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created or updated.');

  // --- NEW: Seed Site Settings ---
  await prisma.settings.deleteMany();
  await prisma.settings.create({
    data: {
      storeEmail: 'bettercallkiko@gmail.com',
    },
  });
  console.log('Site settings created.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
