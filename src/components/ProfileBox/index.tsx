"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import useAuthStore from "@/store/useAuthStore";
// ⬇️ change this path if your store file has a different name


const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  } catch {
    return iso;
  }
};

const initialsFromName = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProfileBox: React.FC = () => {
  const { user } = useAuthStore();

  // derive UI-safe fields with fallbacks
  const {
    fullName,
    email,
    role,
    profileImage,
    brandName,
    twoFactorEnabled,
    isBanned,
    createdAt,
    street_address,
    city,
    state,
    zip,
    _id,
  } = useMemo(() => {
    const u: any = user ?? {};
    return {
      fullName:
        u.fullName ||
        [u.firstName, u.lastName].filter(Boolean).join(" ") ||
        u.name ||
        "Unnamed User",
      email: u.email || "—",
      role: u.role || (u.isAdmin ? "admin" : "user"),
      profileImage: u.profileImage || "",
      brandName: u.brandName || "—",
      twoFactorEnabled: !!u.twoFactorEnabled,
      isBanned: !!u.isBanned,
      createdAt: u.createdAt || "",
      street_address: u.street_address || "",
      city: u.city || "",
      state: u.state || "",
      zip: u.zip ?? "",
      _id: u._id || "",
    };
  }, [user]);

  const joined = formatDate(createdAt);
  const addressLine = [street_address, [city, state].filter(Boolean).join(", "), zip]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Cover */}
      <div className="relative z-20 h-35 md:h-65">
        <Image
          src="/images/cover/cover-01.png"
          alt="profile cover"
          className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
          width={970}
          height={260}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        {/* Avatar container */}
        <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
          <div className="relative drop-shadow-2">
            {profileImage ? (
              // If profileImage is an external URL, ensure its domain is allowed in next.config.js
              <img
                src={profileImage}
                width={160}
                height={160}
                className="h-30 w-30 sm:h-44 sm:w-44 rounded-full object-cover border border-slate-200"
                alt={fullName}
              />
            ) : (
              <div className="flex h-30 w-30 sm:h-44 sm:w-44 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-3xl sm:text-4xl font-bold border border-indigo-200">
                {initialsFromName(fullName)}
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="mt-4">
          <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
            {fullName}
          </h3>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              {role || "user"}
            </span>
            <span
              className={[
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                isBanned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700",
              ].join(" ")}
            >
              {isBanned ? "Banned" : "Active"}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              2FA: {twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          {/* Detail grid */}
          <div className="mx-auto mt-5 grid w-full max-w-[860px] grid-cols-1 gap-3 text-left sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-1 truncate font-medium text-slate-800">{email}</p>
            </div>

            {/* <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">User ID</p>
              <p className="mt-1 font-mono text-slate-800">{_id || "—"}</p>
            </div> */}

            <div className="rounded-lg border border-slate-200 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Address</p>
              <p className="mt-1 font-medium text-slate-800">{addressLine || "—"}</p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Brand</p>
              <p className="mt-1 font-medium text-slate-800">{brandName}</p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Joined</p>
              <p className="mt-1 font-medium text-slate-800">{joined}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
