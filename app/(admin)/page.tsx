import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getDashboardStats() {
  const totalKids = await prisma.kid.count();
  const registeredParents = await prisma.parent.count({
    where: { kakaoUserId: { not: null } },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeekEnd = new Date(today);
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);

  const upcomingSessions = await prisma.session.findMany({
    where: {
      date: {
        gte: today,
        lt: nextWeekEnd,
      },
      status: { in: ['UPCOMING', 'ACTIVE'] },
    },
    orderBy: { date: 'asc' },
    include: {
      attendance: {
        select: {
          status: true,
        },
      },
    },
  });

  return {
    totalKids,
    registeredParents,
    upcomingSessions,
  };
}

const sessionTypeLabels = {
  SAT_REGULAR: '토요일 정규 훈련',
  SUN_REGULAR: '일요일 정규 훈련',
  SPECIAL_MATCH: '특별 매치',
};

export default async function DashboardPage() {
  const { totalKids, registeredParents, upcomingSessions } = await getDashboardStats();

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-600 text-sm font-medium mb-2">Total Kids</h2>
          <p className="text-4xl font-bold text-blue-600">{totalKids}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-600 text-sm font-medium mb-2">Registered Parents</h2>
          <p className="text-4xl font-bold text-green-600">{registeredParents}</p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
          <Link
            href="/sessions"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No sessions scheduled this week</p>
            <Link href="/sessions" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
              Create a session
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {upcomingSessions.map((session: (typeof upcomingSessions)[0]) => {
              const attended = session.attendance.filter((a: { status: string }) => a.status === 'ATTENDING').length;
              const pending = session.attendance.filter((a: { status: string }) => a.status === 'PENDING').length;
              const notAttending = session.attendance.filter((a: { status: string }) => a.status === 'NOT_ATTENDING').length;

              return (
                <Link
                  key={session.id}
                  href={`/attendance/${session.id}`}
                  className="p-6 hover:bg-blue-50 transition cursor-pointer block"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {sessionTypeLabels[session.type as keyof typeof sessionTypeLabels]}
                      </h3>
                      {session.title && (
                        <p className="text-sm text-gray-600 mt-1">{session.title}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {session.date.toLocaleDateString('ko-KR', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        session.status === 'ACTIVE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded p-3">
                      <p className="text-xs text-gray-600 mb-1">Attending</p>
                      <p className="text-2xl font-bold text-green-600">{attended}</p>
                    </div>
                    <div className="bg-yellow-50 rounded p-3">
                      <p className="text-xs text-gray-600 mb-1">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                    </div>
                    <div className="bg-red-50 rounded p-3">
                      <p className="text-xs text-gray-600 mb-1">Not Attending</p>
                      <p className="text-2xl font-bold text-red-600">{notAttending}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
