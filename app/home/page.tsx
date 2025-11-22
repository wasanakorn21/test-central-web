"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

interface Estate {
  id: number;
  name: string;
  image: string;
  location: string;
  price: number;
}

export default function HomePage() {
  const [estateList, setEstateList] = useState<Estate[]>([]);
  const [userFavorites, setUserFavorites] = useState<Array<number | string>>(
    []
  );
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) return;
      const user = JSON.parse(raw);
      setUserFavorites(user.favorites);
      delete user.favorites;
      setUser(user);
    } catch (e) {
      console.error("Failed to parse user from session", e);
    }
  }, []);

  const getDataEstate = async () => {
    try {
      const response = await apiClient.get("/estates");
      setEstateList(response.data);
    } catch (error) {
      console.error("Error fetching estate data:", error);
    }
  };

  const toggleFavorite = async (estateId: number, isFavorite: boolean) => {
    const response = await apiClient.post("/favorite", {
      userId: user.id,
      estateId,
      isFavorite,
    });
    console.log(response.data);
    setUserFavorites(response.data);
  };

  useEffect(() => {
    getDataEstate();
  }, []);

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-4xl rounded-xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Home
            </h1>
            <p className="mt-2 max-w-xl text-zinc-700 dark:text-zinc-300">
              Browse available real estate listings. Mark your favorites with
              the heart button.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                sessionStorage.removeItem("user");
                window.location.href = "/auth";
              }}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="mt-10">
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Image</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Location</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Favorite
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900">
                {estateList.map((l) => {
                  const fav = userFavorites.some(
                    (fId) => String(fId) === String(l.id)
                  );
                  return (
                    <tr
                      key={l.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="h-12 w-16 relative">
                          <Image
                            src={l.image}
                            alt={l.name}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {l.name}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        {l.location}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-zinc-800 dark:text-zinc-200">
                        {l.price.toLocaleString()} บาท
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(l.id, !fav)}
                          aria-label={
                            fav
                              ? `Remove ${l.name} from favorites`
                              : `Add ${l.name} to favorites`
                          }
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition dark:border-zinc-600 ${
                            fav
                              ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                              : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {fav ? "❤" : "♡"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {estateList.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      No Data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
