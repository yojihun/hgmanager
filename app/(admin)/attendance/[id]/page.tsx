export default function AttendancePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Attendance Board</h1>
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600 mb-4">Attendance board for session {params.id}</p>
        <p className="text-sm text-gray-500">
          Coming soon: view and manage attendance for this session.
        </p>
      </div>
    </div>
  );
}
