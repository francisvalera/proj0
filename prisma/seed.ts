import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Products and Blogs Seeding ---
  await prisma.product.deleteMany();
  await prisma.blog.deleteMany();
  console.log('Cleared existing product and blog data.');
  
  const defaultImage = "/images/kklogo.jfif";

  // Corrected: Reverted to createMany and removed all slug-related logic.
  await prisma.product.createMany({
    data: [
      { name: "High-Performance Piston Kit", price: 2500, brandName: "Brand A", isFeatured: true, stock: 15, imageUrl: defaultImage },
      { name: "Racing Brake Caliper Set", price: 3800, brandName: "Brand B", isFeatured: true, stock: 8, imageUrl: defaultImage },
      { name: "Titanium Full Exhaust System", price: 7950, brandName: "Brand C", isFeatured: true, stock: 5, imageUrl: defaultImage },
      { name: "Custom CNC Side Mirrors", price: 1200, brandName: "Brand D", isFeatured: true, stock: 20, imageUrl: defaultImage },
      { name: "AGV Pista GP RR Helmet", price: 25000, brandName: "AGV", isFeatured: false, stock: 10, imageUrl: defaultImage },
      { name: "Dainese Racing 3 Jacket", price: 18500, brandName: "Dainese", isFeatured: false, stock: 12, imageUrl: defaultImage },
    ],
  });
  console.log('Products created.');

  const blogsToCreate = [
      { title: "5 Essential Maintenance Checks for Your Motorcycle", excerpt: "Learn the crucial checks that will keep your bike running smoothly and safely all year round.", date: "August 07, 2025", category: "Maintenance Tips", imageUrl: defaultImage },
      { title: "Choosing the Right Helmet: A Complete Guide", excerpt: "Safety first! We break down the types, fits, and features to look for in your next helmet.", date: "July 31, 2025", category: "Gear Guide", imageUrl: defaultImage },
      { title: "Highlights from the Annual MotoFest 2025", excerpt: "A look back at the best bikes, coolest gear, and exciting events from this year's biggest gathering.", date: "July 24, 2025", category: "Community", imageUrl: defaultImage },
  ];

  await prisma.blog.createMany({
      data: blogsToCreate,
  });
  console.log('Blogs created.');

  // --- Admin User Seeding ---
  const adminPassword = await bcrypt.hash('Password123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@kuyakardz.com' },
    update: {}, // No updates needed if user exists
    create: {
      email: 'admin@kuyakardz.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created or updated.');

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
