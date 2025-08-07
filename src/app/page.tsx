import CarouselSection from "@/components/CarouselSection";
import ProductCard from "@/components/ProductCard";
import BlogSection from "@/components/BlogSection";
import { Star, Settings, Zap, ShieldCheck, Truck, Tag } from "lucide-react";
import prisma from "@/lib/prisma";

// Homepage updated to match the new visual requests.
export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  const latestNews = await prisma.blog.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  // Updated carousel data to match the screenshot
  const carouselImages = [
    { id: '1', title: "QUALITY TIRES & WHEELS", imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1920&h=500&fit=crop" },
    { id: '2', title: "PERFORMANCE EXHAUST SYSTEMS", imageUrl: "https://images.unsplash.com/photo-1617109826139-c51974815b5a?q=80&w=1920&h=500&fit=crop" },
    { id: '3', title: "HELMETS & RIDING GEAR", imageUrl: "https://images.unsplash.com/photo-1599824586239-658a552156a7?q=80&w=1920&h=500&fit=crop" },
    { id: '4', title: "ESSENTIAL MAINTENANCE PARTS", imageUrl: "https://images.unsplash.com/photo-1620815132790-252438503816?q=80&w=1920&h=500&fit=crop" },
    { id: '5', title: "CUSTOM ACCESSORIES", imageUrl: "https://images.unsplash.com/photo-1617097241033-5c4d69352136?q=80&w=1920&h=500&fit=crop" },
  ];

  return (
    <>
      <CarouselSection images={carouselImages} />

      {/* Stats Section - Commented out as requested
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-black p-8 rounded-lg">
              <h3 className="text-4xl font-extrabold text-white">5000+</h3>
              <p className="text-sm text-gray-400 mt-2">Products Sold</p>
            </div>
            <div className="bg-black p-8 rounded-lg">
              <h3 className="text-4xl font-extrabold text-white">15K+</h3>
              <p className="text-sm text-gray-400 mt-2">Happy Customers</p>
            </div>
            <div className="bg-black p-8 rounded-lg">
              <h3 className="text-4xl font-extrabold text-white">10+</h3>
              <p className="text-sm text-gray-400 mt-2">Years of Experience</p>
            </div>
            <div className="bg-black p-8 rounded-lg">
              <h3 className="text-4xl font-extrabold text-red-500">99%</h3>
              <p className="text-sm text-gray-400 mt-2">Positive Feedback</p>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Featured Products Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">FEATURED PRODUCTS</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">Top picks from our curated collection of premium parts.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">WHY CHOOSE US</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">Your trusted partner for quality, service, and speed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mx-auto mb-4"><ShieldCheck size={32} /></div>
              <h3 className="text-xl font-bold text-gray-900">Premium Quality</h3>
              <p className="mt-2 text-gray-500">We source only the best parts and accessories to ensure durability and performance.</p>
            </div>
            <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mx-auto mb-4"><Settings size={32} /></div>
              <h3 className="text-xl font-bold text-gray-900">Expert Service</h3>
              <p className="mt-2 text-gray-500">Our knowledgeable team is here to help you find the perfect fit for your ride.</p>
            </div>
            <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mx-auto mb-4"><Truck size={32} /></div>
              <h3 className="text-xl font-bold text-gray-900">Fast Delivery</h3>
              <p className="mt-2 text-gray-500">Get your parts delivered to your doorstep quickly and reliably, nationwide.</p>
            </div>
          </div>
        </div>
      </section>

      <BlogSection blogs={latestNews} />

      {/* Ready to Ride? (CTA) Section */}
      <section className="bg-gradient-to-r from-black to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-extrabold text-white">READY TO RIDE?</h2>
          <p className="mt-4 text-lg text-gray-200">Browse our extensive collection of parts and accessories to get started.</p>
          <div className="mt-8 flex justify-center space-x-4">
            <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-200">EXPLORE PRODUCTS</a>
            <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-black">CONTACT SUPPORT</a>
          </div>
        </div>
      </section>
    </>
  );
}
