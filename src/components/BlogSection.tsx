import React from 'react';
import Link from 'next/link';
import type { Blog } from '@prisma/client';

// Define the props for the BlogSection component
interface BlogSectionProps {
  blogs: Blog[];
}

// The Blog Section component, now typed and using Next.js Link.
export default function BlogSection({ blogs }: BlogSectionProps) {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">LATEST NEWS</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">Stay updated with news, tips, and insights from the motorcycle world.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <Link href={`/blog/${blog.id}`} className="block">
                <img 
                  src={blog.imageUrl || `https://placehold.co/400x250/f0f0f0/333333?text=Blog+Image`}
                  className="w-full h-48 object-cover" 
                  alt={blog.title}
                />
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{blog.category} • {blog.date}</p>
                  <h3 className="font-bold text-xl text-gray-900 mb-3 h-20">{blog.title}</h3>
                  <p className="text-gray-600 text-sm">{blog.excerpt}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800">
            VIEW ALL POSTS
          </Link>
        </div>
      </div>
    </section>
  );
}
