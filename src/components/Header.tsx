"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  LogIn,
  LogOut,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  // This effect triggers the cart icon animation
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: '/' });
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Products", href: "/products" },
    {
      name: "Helmets & Gears",
      href: "/categories/helmets-gears",
      subLinks: [
        { name: "Full-face Helmets", href: "/products?category=full-face" },
        { name: "Riding Jacket", href: "/products?category=jackets" },
        { name: "Gloves", href: "/products?category=gloves" },
      ],
    },
    {
      name: "Performance Parts",
      href: "/categories/performance",
      subLinks: [
        { name: "Engine Essentials", href: "/products?category=engine" },
        { name: "Brake Systems", href: "/products?category=brakes" },
      ],
    },
    {
      name: "Tires",
      href: "/categories/tires",
      subLinks: [
        { name: "Street Tires", href: "/products?category=street-tires" },
        { name: "Sport Tires", href: "/products?category=sport-tires" },
        { name: "Mag Wheels", href: "/products?category=wheels" },
      ],
    },
    {
      name: "Accessories",
      href: "/categories/accessories",
      subLinks: [
        { name: "LED Headlamps", href: "/products?category=led" },
      ],
    },
    { name: "Brands", href: "/brands" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-4">
            <img src="/images/kklogo.jfif" alt="Kuya Kards Logo" className="h-14 w-14 rounded-lg" />
            <div>
              <h1 className="font-extrabold text-2xl tracking-tight text-gray-900">KUYA KARDS</h1>
              <p className="text-xs font-semibold text-gray-500 tracking-wider">Motorcycle Trading</p>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input type="search" placeholder="Search for parts, brands..." className="w-full bg-gray-100 text-gray-900 border-gray-300 rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500" />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative group p-2 text-gray-700 hover:text-black">
              <div className={`absolute -inset-1 rounded-full transition-all duration-300 ${animateCart ? 'bg-red-100 scale-125' : 'bg-transparent scale-100'}`}></div>
              <ShoppingCart className="h-6 w-6 relative" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-right">
                  <p className="font-medium text-gray-700">Hello, {session.user.name?.split(' ')[0]}!</p>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" className="text-xs text-red-600 hover:underline font-semibold">Admin Panel</Link>
                  )}
                </div>
                <button onClick={handleSignOut} disabled={isLoggingOut} className="p-2 text-gray-500 hover:text-black cursor-pointer disabled:opacity-50" title="Sign Out">
                  {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800">
                <LogIn className="w-4 h-4 mr-2" /> Login
              </Link>
            )}
            
            <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      <nav className="hidden md:flex bg-white text-black h-12 items-center justify-center border-t border-gray-200">
        <ul className="flex space-x-8">
          {navLinks.map((link) => (
            <li key={link.name} className="relative group py-4 after:content-[''] after:absolute after:bottom-[0.75rem] after:left-0 after:right-0 after:h-[2px] after:bg-red-500 after:scale-x-0 after:transition-transform after:duration-200 after:ease-in-out group-hover:after:scale-x-100">
              <Link href={link.href} className="flex items-center text-sm font-bold uppercase tracking-wider text-gray-700 transition-colors duration-200 ease-in-out group-hover:text-red-500">
                {link.name}
                {link.subLinks && <ChevronDown className="h-4 w-4 ml-1" />}
              </Link>
              {link.subLinks && (
                <ul className="absolute left-0 mt-4 w-56 bg-white text-black rounded-b-md shadow-lg hidden group-hover:block z-20">
                  {link.subLinks.map((subLink) => (
                    <li key={subLink.name}>
                      <Link href={subLink.href} className="block px-4 py-3 text-sm hover:bg-gray-100">{subLink.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link href={link.href} className="block py-2 font-semibold">{link.name}</Link>
                {link.subLinks && (
                  <div className="pl-4">
                    {link.subLinks.map((subLink) => (
                       <Link key={subLink.name} href={subLink.href} className="block py-2 text-gray-600">{subLink.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
