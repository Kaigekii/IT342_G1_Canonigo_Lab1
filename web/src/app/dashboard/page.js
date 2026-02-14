"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-white border-t-transparent mb-4"></div>
          <p className="text-lg text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-3xl">
        {error && (
          <div className="mb-6 p-3 rounded-lg" style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828' }}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {user ? (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600" style={{ padding: '2rem 2rem' }}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Dashboard
                  </h1>
                  <p className="text-sm md:text-base" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Welcome back, {user.firstName}!
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white font-semibold hover:bg-white hover:text-purple-600 transition-all border-2 border-white rounded-lg"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '0.875rem 2rem',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>

            <div style={{ padding: '2.5rem 2rem' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#1A237E' }}>
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium" style={{ color: '#78909C' }}>FIRST NAME</p>
                  <p className="text-lg font-semibold" style={{ color: '#263238' }}>{user.firstName}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium" style={{ color: '#78909C' }}>LAST NAME</p>
                  <p className="text-lg font-semibold" style={{ color: '#263238' }}>{user.lastName}</p>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs font-medium" style={{ color: '#78909C' }}>EMAIL</p>
                  <p className="text-lg font-semibold" style={{ color: '#263238' }}>{user.email}</p>
                </div>

                {user.age && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium" style={{ color: '#78909C' }}>AGE</p>
                    <p className="text-lg font-semibold" style={{ color: '#263238' }}>{user.age}</p>
                  </div>
                )}

                {user.gender && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium" style={{ color: '#78909C' }}>GENDER</p>
                    <p className="text-lg font-semibold" style={{ color: '#263238' }}>{user.gender}</p>
                  </div>
                )}

                {user.address && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs font-medium" style={{ color: '#78909C' }}>ADDRESS</p>
                    <p className="text-lg font-semibold" style={{ color: '#263238' }}>{user.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl text-center" style={{ padding: '3rem 2rem' }}>
            <p className="text-base" style={{ color: '#78909C' }}>No user data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
