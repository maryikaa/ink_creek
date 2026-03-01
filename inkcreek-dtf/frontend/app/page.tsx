import dynamic from 'next/dynamic';
import Link from 'next/link';
import { UploadZone } from '@/components/upload/UploadZone';
import { ToolBar } from '@/components/builder/ToolBar';
import { LayerPanel } from '@/components/builder/LayerPanel';
import { PricingSidebar } from '@/components/pricing/PricingSidebar';

const GangSheetCanvas = dynamic(
  () => import('@/components/builder/GangSheetCanvas').then((m) => m.GangSheetCanvas),
  { ssr: false }
);

export default function BuilderPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="font-bold text-xl text-primary">
              InkCreek <span className="text-accent">DTF</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/checkout" className="text-sm font-medium text-primary hover:underline">
                Checkout
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Gang Sheet Builder</h1>
          <p className="text-gray-600 text-sm">Vancouver, BC · Drag designs onto the sheet, then proceed to checkout.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Upload designs</h2>
              <UploadZone />
            </div>
            <ToolBar />
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Sheet</h2>
              <div className="aspect-[13/19] max-h-[70vh]">
                <GangSheetCanvas />
              </div>
            </div>
            <LayerPanel />
          </div>
          <div className="lg:col-span-1">
            <PricingSidebar />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/checkout"
            className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90"
          >
            Continue to checkout →
          </Link>
        </div>
      </main>
    </div>
  );
}
