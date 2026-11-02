"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-navy text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-navy-card border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-md font-semibold text-center !text-white !mb-4">Admin login</h1>
        <p className="text-xs text-muted-dark !mb-6 text-center">Sign in to manage the site.</p>

        <label className="block mb-4">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Username
          </span>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-navy border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:border-blue-default outline-none"
          />
        </label>

        <label className="block !mb-1">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Password
          </span>
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-navy border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:border-blue-default outline-none"
          />
        </label>

        <label className="flex items-center gap-2 !mb-4">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
            Show Password
          </span>
        <input
          id="check"
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword((prev) => !prev)}
        />
        </label>

        {error && <p className="text-red-400 text-xs !mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-default hover:bg-blue-bright text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
