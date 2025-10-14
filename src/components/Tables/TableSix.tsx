"use client";

import React, { useState, useMemo, useEffect, ChangeEvent, MouseEvent } from "react";
import { Search, Download, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import DeleteModal from "../Modals/DeleteModal";
import ViewUserModal from "../Modals/ViewUserModal";
// --- 1. Define Types and Interfaces ---

interface User {
    id: number;
    name: string;
    email: string;
    status: UserStatus;
    joinedDate: string;
}


// Define a union type for possible user statuses
type UserStatus = 'Active' | 'Inactive' | 'Pending';

// Define a union type for the filter state (including 'All')
type StatusFilter = UserStatus | 'All';
interface UserToDelete {
    id: number;
    name: string
}
// --- MOCK DATA ---
const initialUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', joinedDate: '2024-10-01' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', status: 'Pending', joinedDate: '2024-10-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Active', joinedDate: '2024-10-08' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', status: 'Inactive', joinedDate: '2024-09-15' },
    { id: 5, name: 'Chris Lee', email: 'chris@example.com', status: 'Active', joinedDate: '2024-10-05' },
    { id: 6, name: 'Jessica Brown', email: 'jessica@example.com', status: 'Pending', joinedDate: '2024-10-12' },
    { id: 7, name: 'David Wilson', email: 'david@example.com', status: 'Active', joinedDate: '2024-09-20' },
    { id: 8, name: 'Laura Taylor', email: 'laura@example.com', status: 'Inactive', joinedDate: '2024-08-30' },
];

const ITEMS_PER_PAGE = 5;

// --- 2. Component Definition ---

const TableSix: React.FC = () => {
    // State initialization with explicit types
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserToDelete | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [userToView, setUserToView] = useState<User | null>(null);

    // Memoized filtering and searching logic
    const filteredUsers = useMemo(() => {
        return users
            .filter(user => {
                // Filter by status
                if (statusFilter === "All") return true;
                return user.status === statusFilter;
            })
            .filter(user =>
                // Filter by search term (name or email)
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [users, searchTerm, statusFilter]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Effect to reset page number whenever filters or search terms change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Handler to toggle user status between Active and Inactive
    const toggleStatus = (userId: number) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === userId) {
                // Cannot toggle status if pending
                if (user.status === 'Pending') return user;

                // Toggle between Active and Inactive
                const newStatus: UserStatus = user.status === "Active" ? "Inactive" : "Active";
                return { ...user, status: newStatus };
            }
            return user;
        }));
    };

    // NEW: Handler to open the modal
    const handleDeleteClick = (user: User) => {
        setUserToDelete({ id: user.id, name: user.name });
        setIsDeleteModalOpen(true);

    };

    // NEW: Handler for confirming deletion
    const confirmDelete = () => {
        if (userToDelete) {
            console.log("Deleted user ID:", userToDelete.id);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
        }

        // Close the modal and reset the userToDelete state
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleViewClick = (user: User) => {
        setUserToView(user);
        setIsViewModalOpen(true);
    }
    // Handler for search input change
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Handler for filter dropdown change
    const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
        // Cast the event value to the defined StatusFilter type
        setStatusFilter(e.target.value as StatusFilter);
    };


    // Helper function to render status badges
    const getStatusStyles = (status: UserStatus) => {
        switch (status) {
            case 'Active':
                return "bg-green-100 text-green-700";
            case 'Inactive':
                return "bg-red-100 text-red-700";
            case 'Pending':
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div className="space-y-6 min-h-screen">
            {/* Render Delete Modal here */}
            {isDeleteModalOpen && userToDelete && (
                <DeleteModal
                    itemName={userToDelete.name}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                />
            )}

            {/* Render View User Modal  */}
            {isViewModalOpen && userToView && (
                <ViewUserModal
                    user={userToView}
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col md:flex-row gap-4">

                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Responsive Scrollable Table Container */}
            <div className="rounded-xl bg-white shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[700px]"> {/* Ensures minimum width for desktop view */}

                        {/* Table Header */}
                        <div className="grid grid-cols-4 gap-4 bg-slate-50 border-b border-slate-200 p-4 font-semibold text-slate-600">
                            <div className="col-span-1">User</div>
                            <div className="text-center">Joined Date</div>
                            <div className="text-center">Status</div>
                            <div className="text-center">Action</div>
                        </div>

                        {/* Table Body */}
                        <div className="flex flex-col">
                            {currentData.map((user, index) => (
                                <div
                                    className="grid grid-cols-4 gap-4 items-center border-b border-slate-100 last:border-b-0 p-4 hover:bg-slate-50 transition-colors"
                                    key={user.id}
                                >
                                    {/* User Details */}
                                    <div className="col-span-1 flex items-center gap-3.5">
                                        <div>
                                            <p className="font-medium text-slate-800">{user.name}</p>
                                            <p className="text-sm text-slate-500">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Joined Date */}
                                    <div className="flex items-center justify-center">
                                        <p className="font-medium text-slate-600">
                                            {user.joinedDate}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center justify-center">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyles(user.status)}`}
                                        >
                                            {user.status}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-center space-x-2">
                                        <button
                                            onClick={() => toggleStatus(user.id)}
                                            className={`p-2 rounded-full hover:bg-slate-200 transition-colors ${user.status === 'Pending' ? 'cursor-not-allowed opacity-50' : ''}`}
                                            title={user.status === 'Active' ? 'Deactivate' : user.status === 'Inactive' ? 'Activate' : 'Cannot Change Status'}
                                            disabled={user.status === 'Pending'}
                                        >
                                            {user.status === 'Active' ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
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
                                <div className="text-center py-10 text-slate-500 col-span-4">
                                    No users found matching the current filters.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4 p-4 border-t border-slate-200 flex justify-center items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="mx-1 rounded-lg bg-white border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 disabled:opacity-50 hover:bg-slate-100 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
