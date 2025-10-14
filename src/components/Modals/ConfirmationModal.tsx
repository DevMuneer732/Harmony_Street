import React from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark min-w-80">
                <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Confirm Action</h3>
                <p className="mb-6 text-sm text-gray-700 dark:text-gray-300">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
