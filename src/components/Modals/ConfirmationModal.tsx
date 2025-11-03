"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import useAuthStore from "@/store/useAuthStore";

type Props = {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  onConfirm?: () => Promise<void> | void; 
  asListItem?: boolean;
  redirectTo?: string;
};

export default function LogoutButtonWithModal({
  children = "Logout",
  className = "",
  icon,
  onConfirm,
  asListItem = false,
  redirectTo = "/auth/signin",
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { logout } = useAuthStore();

  useEffect(() => setMounted(true), []);

  const confirm = useCallback(async () => {
    try {
      const maybePromise = onConfirm ? onConfirm() : logout();
      await maybePromise;
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setOpen(false);
      router.push(redirectTo);
    }
  }, [logout, onConfirm, redirectTo, router]);

  
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const TriggerButton = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setOpen(true);
      }}
      className={className}
    >
      {icon}
      {children}
    </button>
  );

  const Modal =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-dark"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Log out?
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                You&apos;ll be signed out of your account.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirm}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;
  return (
    <>
      {asListItem ? (
        <div role="none" className="list-none">
          {TriggerButton}
        </div>
      ) : (
        TriggerButton
      )}
      {Modal}
    </>
  );
}
