import Link from 'next/link';

// This is the new standard for typing and handling props on dynamic pages.
export default async function OrderConfirmationPage(
  props: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await props.params; // Await params

  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">
            Thank you!
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Your order has been placed
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Your order <span className="font-medium text-gray-900">#{orderId}</span> has been placed successfully.
          </p>
          <p className="mt-2 text-base text-gray-500">
            We are processing your order and will send updates to the contact details you provided.
          </p>
          <div className="mt-6">
            <Link href="/" className="inline-flex items-center rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
          Continue Shopping →
        </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
