"use client";

import React from "react";
import { X } from "lucide-react";

type UserStatus = "Active" | "Inactive" | "Pending";

export interface UserDetail {
  _id: string;
  fullName?: string;
  email?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string | number;
  brandName?: string;
  profileImage?: string;
  twoFactorEnabled?: boolean;
  role?: string;
  isBanned?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // UI-only fields you may pass in from the table
  status?: UserStatus;    // derived from isBanned / status
  joinedDate?: string;    // derived from createdAt
}

interface ViewUserModalProps {
  user: UserDetail;
  onClose: () => void;
}

const formatDateTime = (iso?: string) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    // YYYY-MM-DD HH:mm (local)
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
};

const initialsFromName = (name?: string) => {
  if (!name) return "U";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const badgeClass = (status?: UserStatus) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Inactive":
      return "bg-red-100 text-red-700";
    case "Pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const ViewUserModal: React.FC<ViewUserModalProps> = ({ user, onClose }) => {
  // derive fields safely
  const fullName = user.fullName || "Unnamed User";
  const email = user.email || "—";
  const role = user.role || "user";
  const twoFA = user.twoFactorEnabled ? "Enabled" : "Disabled";
  const banned = user.isBanned ? "Yes" : "No";
  const joined = user.joinedDate || (user.createdAt ? user.createdAt.slice(0, 10) : "—");
  const created = formatDateTime(user.createdAt);
  const updated = formatDateTime(user.updatedAt);
  const address = [
    user.street_address,
    [user.city, user.state].filter(Boolean).join(", "),
    user.zip ?? ""
  ]
    .filter(Boolean)
    .join(" • ");

  const status: UserStatus =
    user.status
      ? user.status
      : user.isBanned
      ? "Inactive"
      : "Active";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 mt-0">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">User Details</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Top section: Avatar + basic identity */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={fullName}
                className="h-16 w-16 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xl font-bold border border-indigo-200">
                {initialsFromName(fullName)}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="truncate text-xl font-semibold text-slate-900">{fullName}</h4>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(status)}`}>
                  {status}
                </span>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {role}
                </span>
              </div>
              <p className="truncate text-sm text-slate-600">{email}</p>
              <p className="mt-1 text-xs text-slate-500">Joined: {joined}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Two-Factor Auth</p>
              <p className="mt-1 font-medium text-slate-800">{twoFA}</p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Banned</p>
              <p className="mt-1 font-medium text-slate-800">{banned}</p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Address</p>
              <p className="mt-1 font-medium text-slate-800">{address || "—"}</p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Brand</p>
              <p className="mt-1 font-medium text-slate-800">{user.brandName || "—"}</p>
            </div>

            {/* <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">User ID</p>
              <p className="mt-1 font-mono text-slate-800">{user._id}</p>
            </div> */}

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Created</p>
              <p className="mt-1 font-medium text-slate-800">{created}</p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Updated</p>
              <p className="mt-1 font-medium text-slate-800">{updated}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
