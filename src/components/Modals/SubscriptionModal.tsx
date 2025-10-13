"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Package } from "@/types/package";

interface SubscriptionModalProps {
    pkg?: Package | null; // Allow null to mean "Add" mode
    onClose: () => void;
    onSave: (data: Package) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ pkg, onClose, onSave }) => {
    // Detect if edit mode based on presence of an ID
    const isEditMode = !!(pkg && pkg.id);

    const formik = useFormik({
        initialValues: {
            name: pkg?.name || "",
            price: pkg?.price || 0,
            invoiceDate: pkg?.invoiceDate || "",
            status: pkg?.status || "Active",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Package name is required"),
            price: Yup.number()
                .typeError("Price must be a number")
                .positive("Price must be greater than 0")
                .required("Price is required"),
            invoiceDate: Yup.string().required("Invoice date is required"),
            status: Yup.string().oneOf(["Active", "Deactivate"]).required("Status is required"),
        }),
        onSubmit: (values) => {
            const updatedPackage: Package = {
                id: pkg?.id || Date.now().toString(),
                ...values,
            };
            onSave(updatedPackage);
        },
    });

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999] px-4">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-lg font-semibold mb-5">
                    {isEditMode ? "Edit Subscription Package" : "Add Subscription Package"}
                </h2>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full border rounded-md px-3 py-2 outline-none ${formik.touched.name && formik.errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full border rounded-md px-3 py-2 outline-none ${formik.touched.price && formik.errors.price
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                        />
                        {formik.touched.price && formik.errors.price && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
                        )}
                    </div>

                    {/* Invoice Date */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Invoice Date</label>
                        <input
                            type="date"
                            name="invoiceDate"
                            value={formik.values.invoiceDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full border rounded-md px-3 py-2 outline-none ${formik.touched.invoiceDate && formik.errors.invoiceDate
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                        />
                        {formik.touched.invoiceDate && formik.errors.invoiceDate && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.invoiceDate}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full border rounded-md px-3 py-2 outline-none ${formik.touched.status && formik.errors.status
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                        >
                            <option value="Active">Active</option>
                            <option value="Deactivate">Deactivate</option>
                        </select>
                        {formik.touched.status && formik.errors.status && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.status}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            {isEditMode ? "Save Changes" : "Add Package"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubscriptionModal;
