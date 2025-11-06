"use client";

import { useEffect, useMemo, useState } from "react";
import useUsersStore from "@/store/getUsersStore";
import { User } from "@/types/auth";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

type ApiUser = User & {
  _id?: string;
  fullName?: string;
  email?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string | number;
  brandName?: string;
  profileImage?: string;
  twoFactorEnabled?: boolean;
  dailyUpdates?: boolean;
  weeklyUpdates?: boolean;
  role?: string;
  isBanned?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const activityDateOf = (u: any): Date | null => {
  const candidates = [u?.updatedAt, u?.createdAt, u?.lastLogin, u?.created_at, u?.updated_at].filter(Boolean);
  for (const c of candidates) {
    const d = new Date(c);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

const nameOf = (u: any) =>
  u?.fullName ||
  u?.name ||
  u?.full_name ||
  `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() ||
  u?.email ||
  "Unknown User";

const addressOf = (u: ApiUser) => {
  const parts = [u.street_address, u.city, u.state, (u.zip ?? "")?.toString()].filter(Boolean);
  return parts.join(", ");
};

export default function RecentActivityPage() {
  const { users, isLoading, error, fetchUsers } = useUsersStore();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!users || users.length === 0) {
      void fetchUsers();
    }
  }, [users, fetchUsers]);

  const sorted = useMemo(() => {
    const copy = [...(users as ApiUser[] ?? [])];
    return copy.sort((a, b) => {
      const da = activityDateOf(a)?.getTime() ?? 0;
      const db = activityDateOf(b)?.getTime() ?? 0;
      return db - da;
    });
  }, [users]);

  const filtered = useMemo(() => {
    if (!q) return sorted;
    const term = q.toLowerCase();
    return sorted.filter((u) =>
      [
        nameOf(u),
        u?.email,
        u?.username,
        u?.brandName,
        u?.city,
        u?.state,
        (u?.zip ?? "")?.toString(),
      ]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(term))
    );
  }, [q, sorted]);

  return (
    <DefaultLayout>
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">All Recent Activity</h1>
          <p className="text-sm text-zinc-500">Every user from the API, with all available fields.</p>
        </div>
        <div className="max-w-xs w-full">
          <input
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
            placeholder="Search by name, email, brand, city…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="flex items-center gap-3" key={i}>
                <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-1/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="rounded-lg border bg-white p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
          No activity found.
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="rounded-2xl border bg-white p-0 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Desktop table */}
          <div className="hidden w-full overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">2FA</th>
                  <th className="px-4 py-3">Daily</th>
                  <th className="px-4 py-3">Weekly</th>
                  <th className="px-4 py-3">Banned</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u: ApiUser) => (
                  <tr
                    key={u?._id ?? (u as any)?.id ?? `${u.email}-${u.createdAt}`}
                    className="border-t last:border-b dark:border-zinc-800"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {u?.profileImage ? (
                          <img
                            src={u.profileImage}
                            alt={nameOf(u)}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium">
                            {String(nameOf(u)).charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="font-medium">{nameOf(u)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {u.email ?? "—"}
                    </td>
                    <td className="px-4 py-3">{u.brandName ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                        {u.role ?? "user"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.twoFactorEnabled ? "Enabled" : "Disabled"}</td>
                    <td className="px-4 py-3">{u.dailyUpdates ? "On" : "Off"}</td>
                    <td className="px-4 py-3">{u.weeklyUpdates ? "On" : "Off"}</td>
                    <td className="px-4 py-3">
                      {u.isBanned ? (
                        <span className="inline-flex rounded bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {addressOf(u)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y dark:divide-zinc-800">
            {filtered.map((u: ApiUser) => (
              <div
                key={u?._id ?? (u as any)?.id ?? `${u.email}-${u.createdAt}`}
                className="p-4"
              >
                <div className="flex items-center gap-3">
                  {u?.profileImage ? (
                    <img
                      src={u.profileImage}
                      alt={nameOf(u)}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-medium">
                      {String(nameOf(u)).charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium">{nameOf(u)}</div>
                    <div className="text-xs text-zinc-500">{u.email ?? "—"}</div>
                  </div>
                </div>

                {u.brandName && (
                  <div className="mt-2 text-sm">
                    <span className="text-zinc-500">Brand: </span>
                    <span className="font-medium">{u.brandName}</span>
                  </div>
                )}

                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-zinc-500">Role: </span>
                    <span className="font-medium">{u.role ?? "user"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Banned: </span>
                    <span className="font-medium">{u.isBanned ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">2FA: </span>
                    <span className="font-medium">{u.twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Daily: </span>
                    <span className="font-medium">{u.dailyUpdates ? "On" : "Off"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Weekly: </span>
                    <span className="font-medium">{u.weeklyUpdates ? "On" : "Off"}</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
                  {addressOf(u) || "No address"}
                </div>

                <div className="mt-2 text-[11px] text-zinc-500">
                  Created: {u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}
                  {" • "}
                  Updated: {u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </DefaultLayout>
  );
}
