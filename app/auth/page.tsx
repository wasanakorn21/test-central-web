"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../api/apiClient";
import Toast from "../components/Toast";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = username.trim();
    if (!value) return;
    setLoading(true);
    try {
      const response = await apiClient.post(`/auth`, { username: value });
      if (response.data) {
        console.log(response.data);
        sessionStorage.setItem("user", JSON.stringify(response.data));
        setToast({ message: "Auth successful", type: "success" });
        setTimeout(() => {
          router.push("/home");
        }, 500);
      } else {
        setToast({ message: "Auth failed", type: "error" });
      }
    } catch (err) {
      console.error("Auth request failed", err);
      setToast({ message: "Auth failed", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-0 transition focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-zinc-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
          >
            Submit
          </button>
        </form>
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          position="top"
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
