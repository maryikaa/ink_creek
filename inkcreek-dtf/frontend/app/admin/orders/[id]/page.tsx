import Link from 'next/link';

export default function AdminOrderPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/admin/dashboard" className="text-primary font-medium">← Dashboard</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order #{params.id}</h1>
        <p className="text-gray-600 mb-6">Order details will load from API.</p>
      </main>
    </div>
  );
}
