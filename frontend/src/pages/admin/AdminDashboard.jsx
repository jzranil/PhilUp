export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#fffbf4] px-10 py-24 font-mono text-[#1c618c]">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="border border-[#1c618c] p-4">
          <p className="font-bold">Pending Prices</p>
          <p className="mt-2 text-3xl">0</p>
        </div>
        <div className="border border-[#1c618c] p-4">
          <p className="font-bold">Pending Locations</p>
          <p className="mt-2 text-3xl">0</p>
        </div>
        <div className="border border-[#1c618c] p-4">
          <p className="font-bold">Total Users</p>
          <p className="mt-2 text-3xl">0</p>
        </div>
      </section>
    </main>
  );
}
