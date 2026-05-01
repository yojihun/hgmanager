import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/lib/auth';
import SignOutButton from '@/components/SignOutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">⚾ HGManager</h1>
          <p className="text-sm text-gray-600">Home Ground Baseball</p>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <Link
            href="/"
            className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium hover:text-blue-600"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/kids"
            className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium hover:text-blue-600"
          >
            👦 Kids & Families
          </Link>
          <Link
            href="/sessions"
            className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium hover:text-blue-600"
          >
            📅 Sessions
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-200">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">Logged in as</p>
            <p className="font-semibold text-gray-900">Admin</p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
