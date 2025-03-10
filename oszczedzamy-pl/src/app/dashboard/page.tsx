export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Saldo</h2>
          <p className="text-3xl font-bold text-green-600">2,500 PLN</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Wydatki w tym miesiącu</h2>
          <p className="text-3xl font-bold text-red-600">-1,200 PLN</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Oszczędności</h2>
          <p className="text-3xl font-bold text-blue-600">5,000 PLN</p>
        </div>
      </div>
    </div>
  );
}