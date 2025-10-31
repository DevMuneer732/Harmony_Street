"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAuthStore from "@/store/useAuthStote";

export default function SignInWithFormik() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const success = await login(values.email, values.password);

        if (success) {
          console.log("Login successful");
          router.push("/");
        } else {
          toast.error("Invalid email or password");
        }
      } catch (error: any) {
        toast.error(error?.message || "Login failed. Please try again.");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-md mx-auto">
      {/* Email Field */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full rounded-lg border ${
            formik.touched.email && formik.errors.email
              ? "border-red-500"
              : "border-stroke dark:border-dark-3"
          } bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary dark:bg-dark-2 dark:text-white`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-5">
        <label
          htmlFor="password"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full rounded-lg border ${
            formik.touched.password && formik.errors.password
              ? "border-red-500"
              : "border-stroke dark:border-dark-3"
          } bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary dark:bg-dark-2 dark:text-white`}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {formik.errors.password}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || formik.isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading || formik.isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
