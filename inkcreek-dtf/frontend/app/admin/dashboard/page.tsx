import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/dashboard" className="font-bold text-primary">InkCreek Admin</Link>
          <Link href="/admin/login" className="text-sm text-gray-600">Logout</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Orders (placeholder)</p>
            <p className="text-2xl font-bold text-gray-900">—</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Revenue (placeholder)</p>
            <p className="text-2xl font-bold text-gray-900">—</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <Link href="/admin/orders/1" className="text-sm text-accent hover:underline">View orders →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
