"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6 text-white">
      
      {/* Floating Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500 opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600 opacity-20 blur-3xl rounded-full" />
      </div>

      {/* Title Section */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold text-center leading-tight drop-shadow-sm"
      >
        Welcome to <span className="text-cyan-400">Taskora</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mt-4 text-lg md:text-xl text-slate-300 text-center max-w-2xl"
      >
        A smart and elegant way to organize your tasks, stay productive,
        and simplify your day.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8 }}
        className="mt-10 flex flex-col sm:flex-row gap-5"
      >
        <button
          onClick={() => router.push("/register")}
          className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium shadow-lg shadow-cyan-700/30 transition-all hover:scale-[1.03]"
        >
          Register
        </button>

        <button
          onClick={() => router.push("/login")}
          className="px-8 py-3 rounded-xl border border-slate-400 hover:border-white text-slate-200 hover:text-white transition-all hover:scale-[1.03]"
        >
          Login
        </button>
      </motion.div>

      {/* Footer small text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-sm text-slate-400 tracking-wide"
      >
        Boost your productivity — one task at a time.
      </motion.p>
    </div>
  );
}
