"use client";
import React, { useMemo, useState } from "react";
import { X, ShieldCheck, ShieldX } from "lucide-react";
import useStatusStore from "@/store/statusStore";

type UserStatus = "Active" | "Banned" | "Pending";

export interface ChangeStatusModalProps {
  userId: string;
  name: string;
  email?: string;
  role?: string;
  profileImage?: string;
  currentStatus: UserStatus;
  onClose: () => void;
  onChanged?: () => void;
}

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  userId,
  name,
  email,
  role,
  profileImage,
  currentStatus,
  onClose,
  onChanged,
}) => {
  const { isLoading, setUserBanned, lastMessage } = useStatusStore();
  const [submitting, setSubmitting] = useState(false);

  const willBecome = useMemo<UserStatus>(() => {
    if (currentStatus === "Pending") return "Pending";
    return currentStatus === "Active" ? "Banned" : "Active";
  }, [currentStatus]);

  const canChange = currentStatus !== "Pending";

  const handleConfirm = async () => {
    if (!canChange) return;
    // 👉 server expects isBanned: true when making user Banned
    const nextIsBanned = willBecome === "Banned";
    try {
      setSubmitting(true);
      const ok = await setUserBanned(userId, nextIsBanned);
      if (ok) {
        onChanged?.();
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ... (rest of the JSX identical to previous modal; omitted for brevity)
  // Keep the same UI; only the call changed.

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Change User Status</h3>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            {profileImage ? (
              <img src={profileImage} alt={name} className="h-14 w-14 rounded-full object-cover border border-slate-200" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-lg font-bold border border-indigo-200">
                {name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">{name}</p>
              {email && <p className="truncate text-sm text-slate-600">{email}</p>}
              {role && <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{role}</span>}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-700">
              Current status:
              <span className={[
                "ml-2 rounded-full px-2.5 py-1 text-xs font-semibold",
                currentStatus === "Active" ? "bg-green-100 text-green-700"
                  : currentStatus === "Banned" ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700",
              ].join(" ")}>
                {currentStatus}
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {canChange ? (
                <>This will change the status to <span className={[
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  willBecome === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                ].join(" ")}>{willBecome}</span>.</>
              ) : <>Users with <b>Pending</b> status cannot be changed here.</>}
            </p>
            {lastMessage && <p className="mt-3 text-xs text-slate-500">Last server message: {lastMessage}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={!canChange || isLoading || submitting}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition",
              willBecome === "Banned" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700",
              (!canChange || isLoading || submitting) && "opacity-60 cursor-not-allowed",
            ].join(" ")}
          >
            {willBecome === "Banned" ? <ShieldX size={18} /> : <ShieldCheck size={18} />}
            {submitting ? "Updating..." : `Set ${willBecome}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusModal;
