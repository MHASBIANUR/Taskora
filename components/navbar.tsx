"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { LogOut, LayoutDashboard, User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return router.push("/login");

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("user_id", authData.user.id)
        .single();

      if (profile) setUsername(profile.username);
    }

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="backdrop-blur-md bg-cyan-300/60 border-b border-cyan-200/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Left: Logo + Dashboard */}
        <div className="flex items-center gap-6">
          <Image
            src="/images/Taskora.jpg"
            alt="Logo"
            width={120}
            height={40}
            className="rounded-full shadow-md hover:scale-105 transition-transform"
          />
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
        </div>

        {/* Right: Username + Logout */}
        <div className="flex items-center gap-4">
          {username && (
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md text-gray-800 px-4 py-2 rounded-full shadow hover:shadow-md transition">
              <User size={18} className="text-cyan-600" />
              <span className="font-semibold text-gray-700">{username}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
