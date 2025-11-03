"use client";

import React, { useState, useMemo, useEffect, ChangeEvent } from "react";
import { Search, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import DeleteModal from "../Modals/DeleteModal";
import ViewUserModal from "../Modals/ViewUserModal";
import useUsersStore from "@/store/getUsersStore";
import ChangeStatusModal from "../Modals/ChangeStatusModal";

// ---------- UI Types ----------
type UserStatus = "Active" | "Banned" | "Pending";
type StatusFilter = UserStatus | "All";

interface UIUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  joinedDate: string;
  role: string; // 🟢 Added

   // extra fields for the modal
  _id: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string | number;
  brandName?: string;
  profileImage?: string;
  twoFactorEnabled?: boolean;
  isBanned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface UserToDelete {
  id: string;
  name: string;
}

const ITEMS_PER_PAGE = 5;

const TableSix: React.FC = () => {
  const { users: apiUsers, isLoading, error, fetchUsers } = useUsersStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchUsers();
    }
  }, [fetchUsers]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserToDelete | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [userToView, setUserToView] = useState<UIUser | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, UserStatus>>({});
const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
const [userToChange, setUserToChange] = useState<UIUser | null>(null);

const openChangeStatus = (user: UIUser) => {
  setUserToChange(user);
  setIsStatusModalOpen(true);
};
  // --- Map API Users -> UI users ---
const mappedUsers: UIUser[] = useMemo(() => {
  const safeArray = Array.isArray(apiUsers) ? apiUsers : [];

  return safeArray.map((raw: any) => {
    const _id: string = raw?._id?.toString?.() ?? raw?.id?.toString?.() ?? crypto.randomUUID();

  const fullName =
  (raw?.fullName ??
    ([raw?.firstName, raw?.lastName].filter(Boolean).join(" ") ||
      raw?.name)) ??
  raw?.email ??
  "User";

    const email: string = raw?.email ?? "";

    const role: string =
      raw?.role ||
      (Array.isArray(raw?.roles) && raw.roles[0]) ||
      raw?.userRole ||
      (raw?.isAdmin ? "admin" : "user");

    const status: "Active" | "Banned" | "Pending" =
      raw?.status === "Pending" ? "Pending" : raw?.isBanned ? "Banned" : "Active";

    const createdAt = (raw?.createdAt ?? new Date().toISOString()).toString();
    const joinedDate = createdAt.slice(0, 10);

    return {
      id: _id,             // for keying rows
      _id,                 // for modal display
      name: fullName,
      email,
      role,
      status,
      joinedDate,

      // extra fields for modal
      street_address: raw?.street_address,
      city: raw?.city,
      state: raw?.state,
      zip: raw?.zip,
      brandName: raw?.brandName,
      profileImage: raw?.profileImage,
      twoFactorEnabled: raw?.twoFactorEnabled,
      isBanned: raw?.isBanned,
      createdAt: raw?.createdAt,
      updatedAt: raw?.updatedAt,
    };
  });
}, [apiUsers]);

  const uiUsers: UIUser[] = useMemo(() => {
    return mappedUsers.map((u) =>
      statusOverrides[u.id] ? { ...u, status: statusOverrides[u.id] } : u
    );
  }, [mappedUsers, statusOverrides]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return uiUsers
      .filter((u) => (statusFilter === "All" ? true : u.status === statusFilter))
      .filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.role.toLowerCase().includes(term)
      );
  }, [uiUsers, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, mappedUsers.length]);

//   const toggleStatus = (userId: string) => {
//     const current =
//       statusOverrides[userId] ??
//       uiUsers.find((u) => u.id === userId)?.status ??
//       "Active";
//     if (current === "Pending") return;
//     setStatusOverrides((prev) => ({
//       ...prev,
//       [userId]: current === "Active" ? "Banned" : "Active",
//     }));
//   };

  const handleDeleteClick = (user: UIUser) => {
    setUserToDelete({ id: user.id, name: user.name });
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
    if (!userToDelete) return;
    setStatusOverrides((prev) => ({ ...prev, [userToDelete.id]: "Banned" }));
    setUserToDelete(null);
  };

  const handleViewClick = (user: UIUser) => {
    setUserToView(user);
    setIsViewModalOpen(true);
  };

  const getStatusStyles = (status: UserStatus) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Banned":
        return "bg-red-100 text-red-700";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-6 min-h-screen">
      {/* Modals */}
      {isDeleteModalOpen && userToDelete && (
        <DeleteModal
          itemName={userToDelete.name}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
      {isViewModalOpen && userToView && (
        <ViewUserModal user={userToView as any} onClose={() => setIsViewModalOpen(false)} />
      )}
{isStatusModalOpen && userToChange && (
  <ChangeStatusModal
    userId={userToChange._id}
    name={userToChange.name}
    email={userToChange.email}
    role={userToChange.role}
    profileImage={userToChange.profileImage}
    currentStatus={userToChange.status}
    onClose={() => setIsStatusModalOpen(false)}
    onChanged={fetchUsers}   // refetch after success
  />
)}

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Banned">Banned</option>
            {/* <option value="Pending">Pending</option> */}
          </select>

          <button
            onClick={fetchUsers}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            title="Reload"
          >
            Reload
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[850px]"> {/* 🟢 increased width slightly */}
            <div className="grid grid-cols-5 gap-4 bg-slate-50 border-b border-slate-200 p-4 font-semibold text-slate-600">
              <div className="col-span-1">User</div>
              <div className="text-center">Role</div> {/* 🟢 Added */}
              <div className="text-center">Joined Date</div>
              <div className="text-center">Status</div>
              <div className="text-center">Action</div>
            </div>

            {isLoading && <div className="p-6 text-center text-slate-500">Loading users…</div>}
            {!isLoading && error && <div className="p-6 text-center text-red-500">{error}</div>}

            {!isLoading && !error && (
              <div className="flex flex-col">
                {currentData.map((user) => (
                  <div
                    className="grid grid-cols-5 gap-4 items-center border-b border-slate-100 last:border-b-0 p-4 hover:bg-slate-50 transition-colors"
                    key={user.id}
                  >
                    <div className="col-span-1">
                      <p className="font-medium text-slate-800">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>

                    {/* 🟢 Role Column */}
                    <div className="flex items-center justify-center">
                      <span className="text-slate-700 font-medium">{user.role}</span>
                    </div>

                    <div className="flex items-center justify-center">
                      <p className="font-medium text-slate-600">{user.joinedDate}</p>
                    </div>

                    <div className="flex items-center justify-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyles(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                     <button
  onClick={() => openChangeStatus(user)}
  className={`p-2 rounded-full hover:bg-slate-200 transition-colors ${
    user.status === "Pending" ? "cursor-not-allowed opacity-50" : ""
  }`}
  title={user.status === "Pending" ? "Cannot Change Status" : "Change Status"}
  disabled={user.status === "Pending"}
>
  {user.status === "Active" ? (
    <CheckCircle size={20} className="text-green-600" />
  ) : (
    <XCircle size={20} className="text-red-600" />
  )}
</button>

                      <button
                        onClick={() => handleViewClick(user)}
                        className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                        title="View Details"
                      >
                        <Eye size={20} className="text-indigo-500" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 rounded-full hover:bg-red-100 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={20} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}

                {currentData.length === 0 && (
                  <div className="text-center py-10 text-slate-500 col-span-5">
                    No users found matching the current filters.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && !error && (
          <div className="mt-4 p-4 border-t border-slate-200 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="mx-1 rounded-lg bg-white border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="mx-1 rounded-lg bg-white border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSix;
