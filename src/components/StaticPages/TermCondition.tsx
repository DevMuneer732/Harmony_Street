"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, User, FileLock, LogOut } from "lucide-react";

const TermsOfService: React.FC = () => {
  const sections = [
    {
      title: "Use of the App",
      icon: <Shield className="h-6 w-6 text-indigo-500" />,
      content:
        "Harmony Street is designed for musicians to track income, expenses, receipts, and gigs. You agree to use the app only for lawful purposes and in compliance with applicable tax and financial regulations.",
    },
    {
      title: "Accounts & Security",
      icon: <User className="h-6 w-6 text-indigo-500" />,
      content:
        "You are responsible for maintaining the security of your account. Keep your password and two-factor authentication details safe. Harmony Street is not responsible for loss due to unauthorized access caused by weak security practices.",
    },
    {
      title: "Data & Privacy",
      icon: <FileLock className="h-6 w-6 text-indigo-500" />,
      content:
        "Your personal and financial data remains yours. By using the app, you allow Harmony Street to securely process and store your information to provide app services. See our Privacy Policy for more details.",
    },
    {
      title: "Termination",
      icon: <LogOut className="h-6 w-6 text-indigo-500" />,
      content:
        "You may delete your account at any time. Harmony Street reserves the right to suspend or terminate accounts that violate these terms.",
    },
  ];

  return (
    <div className="mx-auto w-full  px-2 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200/60"
      >
        {/* Header */}
        <header className="mb-10 border-b border-slate-200 pb-6 text-center">
          {/* <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Terms of Service
          </h1> */}
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            By using Harmony Street, you agree to these Terms of Service. Please
            read them carefully before creating an account.
          </p>
        </header>

        {/* Sections */}
        <section className="space-y-8">
          {sections.map((section, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-start gap-4 rounded-xl bg-slate-50/80 p-5 hover:bg-slate-100 transition-colors duration-200"
            >
              <div className="flex-shrink-0">{section.icon}</div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {section.title}
                </h2>
                <p className="mt-2 text-slate-700 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </motion.article>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm text-slate-500">
            Last updated on{" "}
            <span className="font-medium">November 4, 2025</span>
          </p>
        </footer>
      </motion.div>
    </div>
  );
};

export default TermsOfService;
