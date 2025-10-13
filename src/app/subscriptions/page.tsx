// "use client";
// import React, { useState } from "react";
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import DefaultLayout from "@/components/Layouts/DefaultLaout";
// import TableThree from "@/components/Tables/TableThree";
// import SubscriptionModal from "@/components/Modals/SubscriptionModal";
// import { Package } from "@/types/package";
// // import { Metadata } from "next";

// // export const metadata: Metadata = {
// //   title: "Next.js Clients Page | NextAdmin - Next.js Dashboard Kit",
// //   description: "This is Next.js Clients page for NextAdmin Dashboard Kit",
// // };

// const SubscriptionsPage = () => {
//   // State for controlling modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selected, setSelected] = useState<Package | null>(null);

//   // Handle Add New button click
//   const handleAddNew = () => {
//     // Empty package for creating a new one
//     setSelected({
//       name: "",
//       price: 0,
//       invoiceDate: "",
//       status: "Active",
//     });
//     setIsModalOpen(true);
//   };

//   // Handle save from modal (can extend later)
//   const handleSave = (pkg: Package) => {
//     console.log("New/Updated Package Saved:", pkg);
//     setIsModalOpen(false);
//   };

//   return (
//     <DefaultLayout>
//       {/* Page Heading */}
//       <Breadcrumb pageName="Subscriptions" />

//       {/* Header with button */}
//       <div className="mb-5.5 flex items-center justify-between">
//         <button
//           onClick={handleAddNew}
//           className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
//         >
//           Add New Subscription
//         </button>
//       </div>

//       {/* Table Section */}
//       <div className="flex flex-col gap-10">
//         <TableThree />
//       </div>

//       {/* Modal for Add New / Edit */}
//       {isModalOpen && selected && (
//         <SubscriptionModal
//           pkg={selected}
//           onClose={() => setIsModalOpen(false)}
//           onSave={handleSave}
//         />
//       )}
//     </DefaultLayout>
//   );
// };

// export default SubscriptionsPage;
