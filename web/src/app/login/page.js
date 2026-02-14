"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl" style={{ padding: '2rem 2rem' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1A237E' }}>
              Welcome Back
            </h1>
            <p className="text-sm md:text-base" style={{ color: '#78909C' }}>
              Please login to your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg" style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828' }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#455A64', marginTop: '1rem' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-base rounded-lg border-2 focus:outline-none transition-all"
                style={{ 
                  borderColor: '#E0E0E0',
                  background: '#FAFAFA'
                }}
                onFocus={(e) => e.target.style.borderColor = '#5E35B1'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#455A64', marginTop: '1rem' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-base rounded-lg border-2 focus:outline-none transition-all"
                style={{ 
                  borderColor: '#E0E0E0',
                  background: '#FAFAFA',
                }}
                onFocus={(e) => e.target.style.borderColor = '#5E35B1'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white rounded-lg py-3.5 text-base font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
              style={{ 
                background: loading ? '#9575CD' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transform: loading ? 'scale(1)' : 'scale(1)',
                marginTop: '1rem'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center" style={{ marginTop: '1rem' }}>
            <span className="text-sm" style={{ color: '#78909C' }}>
              Dont have an account?{" "}
            </span>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-sm font-semibold hover:underline"
              style={{ color: '#5E35B1' }}
            >
              Create one
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
