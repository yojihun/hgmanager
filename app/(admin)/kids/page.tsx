'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Kid {
  id: string;
  name: string;
  defaultAttendSat: boolean;
  defaultAttendSun: boolean;
  defaultPickupSat: boolean;
  defaultPickupSun: boolean;
  parent: {
    name: string | null;
    phone: string | null;
    kakaoUserId: string | null;
    registeredAt: string | null;
  } | null;
}

export default function KidsPage() {
  const router = useRouter();
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    defaultAttendSat: true,
    defaultAttendSun: true,
    defaultPickupSat: false,
    defaultPickupSun: false,
  });

  useEffect(() => {
    fetchKids();
  }, []);

  const fetchKids = async () => {
    try {
      const res = await fetch('/api/kids');
      const data = await res.json();
      setKids(data);
    } catch (error) {
      console.error('Failed to fetch kids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKid = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/kids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          name: '',
          defaultAttendSat: true,
          defaultAttendSun: true,
          defaultPickupSat: false,
          defaultPickupSun: false,
        });
        setShowForm(false);
        fetchKids();
      }
    } catch (error) {
      console.error('Failed to add kid:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Kids & Families</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          {showForm ? 'Cancel' : '+ Add Kid'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddKid} className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kid's Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., 김철수"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Default Settings</p>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.defaultAttendSat}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultAttendSat: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Attends Saturday</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.defaultAttendSun}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultAttendSun: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Attends Sunday</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.defaultPickupSat}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultPickupSat: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Pickup Saturday</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.defaultPickupSun}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultPickupSun: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Pickup Sunday</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Add Kid
          </button>
        </form>
      )}

      {kids.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No kids registered yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Add the first kid
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kids.map((kid) => (
            <div key={kid.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{kid.name}</h3>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Saturday:</span> {kid.defaultAttendSat ? '✅' : '❌'}
                  {kid.defaultPickupSat && ' (Pickup)'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Sunday:</span> {kid.defaultAttendSun ? '✅' : '❌'}
                  {kid.defaultPickupSun && ' (Pickup)'}
                </p>
              </div>

              {kid.parent?.kakaoUserId ? (
                <div className="bg-green-50 rounded p-3">
                  <p className="text-xs text-green-700 font-semibold">✅ Parent Registered</p>
                  {kid.parent.registeredAt && (
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(kid.parent.registeredAt).toLocaleDateString('ko-KR')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 rounded p-3">
                  <p className="text-xs text-yellow-700 font-semibold">⏳ Waiting for parent</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
