"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Lock, UserCheck } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: <FileText className="h-6 w-6 text-indigo-500" />,
      content:
        "When you create an account, we may collect details such as your name, email, SSN/EIN, and date of birth. As you use the app, we also store income and expense records, uploaded receipts, and scheduled gigs.",
    },
    {
      title: "How We Use Your Data",
      icon: <ShieldCheck className="h-6 w-6 text-indigo-500" />,
      content:
        "We use your information to provide the app’s core features, including income and expense tracking, calendar reminders, and financial reports. Your data also helps us improve security and user experience.",
    },
    {
      title: "Data Security",
      icon: <Lock className="h-6 w-6 text-indigo-500" />,
      content:
        "All sensitive information is encrypted and stored securely. Access to your account is protected with two-factor authentication. Receipts and reports are stored safely using secure cloud storage.",
    },
    {
      title: "Your Rights",
      icon: <UserCheck className="h-6 w-6 text-indigo-500" />,
      content:
        "You can view, edit, export, or permanently delete your data at any time from the app settings. Once deleted, your information cannot be recovered.",
    },
  ];

  return (
    <div className="mx-auto w-full  py-6 px-2">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200/60"
      >
        <header className="mb-10 border-b border-slate-200 pb-6 text-center">
          {/* <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1> */}
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto ">
            Harmony Street respects your privacy and is committed to protecting
            your personal information. This policy explains what data we
            collect, how we use it, and the choices you have.
          </p>
        </header>

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

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm text-slate-500">
            Last updated on <span className="font-medium">November 4, 2025</span>
          </p>
        </footer>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
