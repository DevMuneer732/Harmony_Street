import Dashboard from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

export const metadata: Metadata = {
  title: "Harmony Street",
  description: "HARMONY STREET | HARMONY-STREET-DASHBOARD",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Dashboard />

      </DefaultLayout>
    </>
  );
}
