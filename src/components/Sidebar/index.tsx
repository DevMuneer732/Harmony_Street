"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ClickOutside from "@/components/ClickOutside";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import LogoutButtonWithModal from "../Modals/ConfirmationModal";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// ...imports remain the same

const menuGroups = [
  {
    menuItems: [
      {
        icon: (
          <svg
            className=""
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.00009 17.2498C8.58588 17.2498 8.25009 17.5856 8.25009 17.9998C8.25009 18.414 8.58588 18.7498 9.00009 18.7498H15.0001C15.4143 18.7498 15.7501 18.414 15.7501 17.9998C15.7501 17.5856 15.4143 17.2498 15.0001 17.2498H9.00009Z" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 1.25C11.27 1.25 10.61 1.45 9.89 1.79C9.19 2.11 8.38 2.6 7.36 3.2L5.9 4.07C4.79 4.74 3.9 5.27 3.22 5.78C2.52 6.3 2 6.84 1.66 7.55C1.32 8.26 1.23 9.01 1.26 9.88C1.28 10.72 1.43 11.74 1.62 13.02L1.91 15.05C2.15 16.7 2.33 18.01 2.61 19.03C2.9 20.08 3.32 20.92 4.06 21.56C4.8 22.2 5.69 22.48 6.78 22.62C7.83 22.75 9.16 22.75 10.84 22.75H13.16C14.84 22.75 16.17 22.75 17.22 22.62C18.31 22.48 19.2 22.2 19.94 21.56C20.68 20.92 21.09 20.08 21.38 19.03C21.67 18.01 21.85 16.7 22.09 15.05L22.38 13.02C22.57 11.74 22.72 10.72 22.74 9.88C22.77 9.01 22.68 8.26 22.34 7.55C22 6.84 21.48 6.3 20.78 5.78C20.1 5.27 19.21 4.74 18.09 4.07L16.64 3.2C15.62 2.6 14.81 2.11 14.11 1.79C13.39 1.45 12.73 1.25 12 1.25Z"
            />
          </svg>
        ),
        label: "Dashboard",
        route: "/",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-users"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <path d="M16 3.128a4 4 0 0 1 0 7.744" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <circle cx="9" cy="7" r="4" />
          </svg>
        ),
        label: "Users",
        route: "/users",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-send"
          >
            <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
            <path d="m21.854 2.147-10.94 10.939" />
          </svg>
        ),
        label: "Send Invitations",
        route: "/send-invitations",
      },

      // ADDED: Terms of Service
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-scroll-text"
          >
            <path d="M15 12h-5" />
            <path d="M15 8h-5" />
            <path d="M8 20h7a3 3 0 0 0 3-3V7.5A2.5 2.5 0 0 0 15.5 5H7A3 3 0 0 0 4 8v9a3 3 0 0 0 3 3Z" />
          </svg>
        ),
        label: "Terms and Conditions",
        route: "/terms",
      },

      //  ADDED: Privacy Policy
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-shield"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
        ),
        label: "Privacy Policy",
        route: "/privacy",
      },
    ],
  },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="ml-2 flex items-center justify-between gap-2 px-6 pb-2 pt-7">
          <Link href="/">
            <span className="text-2xl font-extrabold uppercase tracking-wide text-black dark:text-white">
              Harmony Street
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="no-scrollbar flex flex-grow flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-6 flex-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem key={menuIndex} item={menuItem} />
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="shrink-0 border-t border-stroke px-4 pb-4 pt-4 dark:border-stroke-dark lg:px-6">
            <ul className="flex flex-col gap-2">
              <li>
                <LogoutButtonWithModal
                  asListItem
                  redirectTo="/auth/signin"
                  className="group relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-log-out rotate-180 transform"
                    >
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    </svg>
                  }
                >
                  Logout
                </LogoutButtonWithModal>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </ClickOutside>
  );
}
