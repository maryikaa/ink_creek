import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto mb-4">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order confirmed</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We&apos;ll send a confirmation email shortly.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90"
        >
          Create another gang sheet
        </Link>
      </div>
    </div>
  );
}
