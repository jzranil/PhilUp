import { useParams } from "react-router-dom";

export default function LocationDetailsPage() {
  const { locationId } = useParams();

  return (
    <main className="min-h-screen bg-[#fffbf4] px-10 py-24 font-mono text-[#1c618c]">
      <h1 className="text-4xl font-bold">Location Details</h1>
      <p className="mt-4 text-lg">Location ID: {locationId}</p>
    </main>
  );
}
