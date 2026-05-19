import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/session";

export default function ProfilePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <main className="min-h-screen bg-[#fffbf4] px-10 py-24 font-mono text-[#1c618c]">
      <h1 className="text-4xl font-bold">Profile</h1>
      <p className="mt-4 text-lg">User profile page.</p>
    </main>
  );
}