"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { User } from "@/types/auth";
import useUsersStore from "@/store/getUsersStore";

type ApiUser = User & {
  _id?: string;
  fullName?: string;
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

type WithUnknownDate = ApiUser & { __activityDate?: string | Date | null };

const activityDateOf = (u: any): Date | null => {
  const candidates = [u?.updatedAt, u?.createdAt, u?.lastLogin, u?.created_at, u?.updated_at].filter(Boolean);
  for (const c of candidates) {
    const d = new Date(c);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

const formatTimeAgo = (date: Date | null) => {
  if (!date) return "Unknown time";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const steps: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "minute"],
    [60, "hour"],
    [24, "day"],
    [7, "week"],
    [4.345, "month"],
    [12, "year"],
  ];
  let count = seconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const [divisor, nextUnit] of steps) {
    if (count < divisor) break;
    count = Math.floor(count / divisor);
    unit = nextUnit;
  }
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  return rtf.format(-count, unit);
};

const nameOf = (u: any) =>
  u?.fullName ||
  u?.name ||
  u?.full_name ||
  `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() ||
  u?.email ||
  "Unknown User";

export default function RecentActivity() {
  const { users, isLoading, error, fetchUsers } = useUsersStore();

  useEffect(() => {
    if (!users || users.length === 0) {
      void fetchUsers();
    }
  }, [users, fetchUsers]);

  const sorted = useMemo(() => {
    const withDates: WithUnknownDate[] = (users as ApiUser[] ?? []).map((u) => ({
      ...u,
      __activityDate: activityDateOf(u),
    }));
    return withDates.sort((a, b) => {
      const da = a.__activityDate ? new Date(a.__activityDate).getTime() : 0;
      const db = b.__activityDate ? new Date(b.__activityDate).getTime() : 0;
      return db - da;
    });
  }, [users]);

  const top5 = sorted.slice(0, 5);

  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-800 dark:bg-zinc-800 dark:text-zinc-200">
            R
          </span>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
            Recent activity
          </h2>
        </div>
        {/* <Link
          href="/recent-activity"
          className="text-sm font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
        >
          View all →
        </Link> */}
      </div>

      {/* Content */}
      <div>
        {isLoading && (
          <ul className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <li className="flex items-center gap-3" key={i}>
                <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && error && (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        {!isLoading && !error && top5.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-zinc-400">No recent activity yet.</div>
        )}

        {!isLoading && !error && top5.length > 0 && (
          <ul className="space-y-4">
            {top5.map((u) => {
              const when = activityDateOf(u);
              const initial = String(nameOf(u)).charAt(0).toUpperCase() || "U";
              return (
                <li
                  key={(u as any)?._id ?? (u as any)?.id ?? nameOf(u)}
                  className="flex items-start gap-3"
                >
                  {u?.profileImage ? (
                    <img
                      src={u.profileImage}
                      alt={nameOf(u)}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-zinc-800"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-800 dark:bg-zinc-800 dark:text-zinc-200">
                      {initial}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="text-[13px] font-semibold leading-tight text-slate-900 dark:text-zinc-100">
                      {nameOf(u)}
                      <span className="ml-2 inline-flex items-center rounded-full border border-slate-300 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-zinc-700 dark:text-zinc-300">
                        {u.role ?? "user"}
                      </span>
                      {u.isBanned ? (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                          Banned
                        </span>
                      ) : null}
                    </div>

                    <div className="text-[12px] text-slate-600 dark:text-zinc-400">
                      {u?.email || u?.username || "—"}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                        2FA: {u.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Daily: {u.dailyUpdates ? "On" : "Off"}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Weekly: {u.weeklyUpdates ? "On" : "Off"}
                      </span>
                      <span className="text-slate-500 dark:text-zinc-400">
                        • {formatTimeAgo(when)}
                      </span>
                    </div>

                    <div className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                      Created: {u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"} • Updated:{" "}
                      {u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "—"}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
