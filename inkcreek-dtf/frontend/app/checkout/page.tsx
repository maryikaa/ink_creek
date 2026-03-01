import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="text-primary font-semibold">← Back to builder</Link>
        </div>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600 mb-6">
          Checkout form and Stripe integration will be connected to the backend.
        </p>
        <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
          CheckoutForm component · Stripe Elements · Order submission
        </div>
      </main>
    </div>
  );
}
