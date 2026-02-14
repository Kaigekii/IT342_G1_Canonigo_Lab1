"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          age: age ? Number(age) : null,
          gender,
          address,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Registration failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl" style={{ padding: '2rem 2rem' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1A237E' }}>
              Create Account
            </h1>
            <p className="text-sm md:text-base" style={{ color: '#78909C' }}>
              Sign up to get started
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg" style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828' }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#455A64', marginTop: '1rem' }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 focus:outline-none transition-all"
                  style={{ borderColor: '#E0E0E0', background: '#FAFAFA' }}
                  onFocus={(e) => e.target.style.borderColor = '#5E35B1'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                  placeholder="John"
                  required
                />
              </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#455A64', marginTop: '1rem' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 focus:outline-none transition-all"
                  style={{ borderColor: '#E0E0E0', background: '#FAFAFA' }}
                  onFocus={(e) => e.target.style.borderColor = '#5E35B1'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#455A64', marginTop: '1rem' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-base rounded-lg border-2 focus:outline-none transition-all"
                style={{ borderColor: '#E0E0E0', background: '#FAFAFA' }}
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
                style={{ borderColor: '#E0E0E0', background: '#FAFAFA' }}
                onFocus={(e) => e.target.style.borderColor = '#5E35B1'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#78909C', marginTop: '1rem' }}>
                  Age (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 focus:outline-none transition-all"
                  style={{ borderColor: '#E0E0E0', background: '#FAFAFA' }}
                  onFocus={(e) => e.target.style.borderColor = '#5E35B1'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#78909C', marginTop: '1rem' }}>
                  Gender (Optional)
                </label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 text-base rounded-lg border-2 focus:outline-none transition-all"
                  style={{ borderColor: '#E0E0E0', background: '#FAFAFA' }}
                  onFocus={(e) => e.target.style.borderColor = '#5E35B1'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                  placeholder="Male/Female/Other"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#78909C', marginTop: '1rem' }}>
                Address (Optional)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 text-base rounded-lg border-2 focus:outline-none transition-all"
                style={{ borderColor: '#E0E0E0', background: '#FAFAFA' }}
                onFocus={(e) => e.target.style.borderColor = '#5E35B1'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                placeholder="123 Main Street"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white rounded-lg py-3.5 text-base font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
              style={{ 
                background: loading ? '#9575CD' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                marginTop: '2rem'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center" style={{ marginTop: '2rem' }}>
            <span className="text-sm" style={{ color: '#78909C' }}>
              Already have an account?{" "}
            </span>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm font-semibold hover:underline"
              style={{ color: '#5E35B1' }}
            >
              Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
