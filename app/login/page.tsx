"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const [raindrops, setRaindrops] = useState<{ left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const drops = Array.from({ length: 100 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
    }));
    setRaindrops(drops);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("❌ Email dan password wajib diisi!");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage("❌ " + error.message);
    else if (data.user) {
      setMessage("✅ Logged in!");
      setTimeout(() => router.push("/dashboard"), 500);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cyan-600 overflow-hidden">
      {/* Hujan */}
      <div className="absolute inset-0">
        {raindrops.map((drop, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${drop.left}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
            }}
          />
        ))}
      </div>

      <form
        onSubmit={handleLogin}
        className="relative bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 z-10"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/TaskoraLogin.jpg"
            alt="Logo Taskora"
            width={200}
            height={200}
            className="rounded-full object-cover mb-4"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-white">Welcome Back 💙</h1>

        {/* Email input */}
        <div className="relative w-full">
          <HiOutlineMail className="absolute top-2.5 left-3 text-gray-400" size={24} />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-12 border border-gray-600 bg-gray-900 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div className="relative w-full">
          <HiOutlineLockClosed className="absolute top-2.5 left-3 text-gray-400" size={24} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-12 border border-gray-600 bg-gray-900 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <HiOutlineEyeOff size={24} /> : <HiOutlineEye size={24} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Login
        </button>

        {message && <p className="text-center text-sm text-gray-200">{message}</p>}

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
      </form>

      {/* Hujan styles */}
      <style jsx>{`
        .raindrop {
          position: absolute;
          top: -10px;
          width: 2px;
          height: 12px;
          background: rgba(255, 255, 255, 0.4);
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes fall {
          to { transform: translateY(110vh); }
        }
      `}</style>
    </div>
  );
}
