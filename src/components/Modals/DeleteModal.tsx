"use client";
import React from "react";

interface DeleteModalProps {
    itemName: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ itemName, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 relative">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Confirm Deletion</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete <span className="font-medium text-red-600">{itemName}</span>?
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
