export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
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
            Your order <span className="font-medium text-gray-900">#{params.orderId}</span> has been placed successfully.
          </p>
          <p className="mt-2 text-base text-gray-500">
            We are processing your order and will send updates to the contact details you provided.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="text-base font-medium text-red-600 hover:text-red-500"
            >
              Continue Shopping<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
