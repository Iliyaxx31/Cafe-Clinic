"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError("Şifre yanlış, tekrar dene.");
        setLoading(false);
        return;
      }

      router.push("/staff");
      router.refresh();
    } catch {
      setError("Bir şeyler ters gitti, tekrar dene.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0014] text-pink-50 flex items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-pink-500/25 bg-[#170a28] p-6"
      >
        <h1 className="text-xl font-black uppercase tracking-wide text-pink-300 mb-1">
          Cafe Clinic
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-lime-300 mb-6">
          Personel Girişi
        </p>

        <label className="block text-sm font-semibold text-pink-100 mb-2">
          Şifre
        </label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-pink-500/30 bg-[#0b0014] px-4 py-3 text-lg text-pink-50 outline-none focus:border-pink-400"
          placeholder="••••••"
        />

        {error && (
          <p className="mt-3 text-sm font-semibold text-pink-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-5 w-full rounded-lg border border-pink-400 bg-pink-500 py-3 text-sm font-bold text-[#0b0014] transition-colors hover:bg-pink-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}