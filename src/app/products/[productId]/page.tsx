import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDisplay from '@/components/ProductDisplay';
import type { Metadata } from 'next';

// This is the new standard for typing and handling props on dynamic pages.
export async function generateMetadata(
  props: { params: Promise<{ productId: string }> }
): Promise<Metadata> {
  const { productId } = await props.params; // Await params

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} - Kuya Kards`,
    description: `Details for ${product.name}`,
  };
}

export default async function ProductPage(
  props: { params: Promise<{ productId: string }> }
) {
  const { productId } = await props.params; // Await params

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  return <ProductDisplay product={product} />;
}
