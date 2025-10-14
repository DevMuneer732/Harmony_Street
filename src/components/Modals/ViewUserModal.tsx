// ViewUserModal.tsx

"use client";
import React from "react";

// The User interface needs to be imported or defined here for type safety
interface User {
    id: number;
    name: string;
    email: string;
    status: 'Active' | 'Inactive' | 'Pending';
    joinedDate: string;
}

interface ViewUserModalProps {
    user: User;
    onClose: () => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ user, onClose }) => {
    
    // Helper function to render status badges (copied from TableSix for consistency)
    const getStatusStyles = (status: User['status']) => {
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative">
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>

                <h2 className="text-xl font-bold text-indigo-600 mb-4 border-b pb-2">User Details</h2>
                
                <div className="space-y-3">
                    {/* User Name */}
                    <div className="flex justify-between items-center border-b pb-1">
                        <span className="text-sm font-medium text-gray-500">Name:</span>
                        <span className="text-base font-semibold text-gray-800">{user.name}</span>
                    </div>

                    {/* User ID */}
                    {/* <div className="flex justify-between items-center border-b pb-1">
                        <span className="text-sm font-medium text-gray-500">User ID:</span>
                        <span className="text-base text-gray-800">#{user.id}</span>
                    </div> */}

                    {/* Email */}
                    <div className="flex justify-between items-center border-b pb-1">
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <span className="text-base text-gray-800">{user.email}</span>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center border-b pb-1">
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyles(user.status)}`}
                        >
                            {user.status}
                        </span>
                    </div>

                    {/* Joined Date */}
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-sm font-medium text-gray-500">Joined Date:</span>
                        <span className="text-base text-gray-800">{user.joinedDate}</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewUserModal;