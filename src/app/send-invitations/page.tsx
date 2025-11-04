"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InviteStatsView from "@/components/Invitations/InfoBox";

import InviteForm from "@/components/Invitations/InviteForm";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Send } from "lucide-react"; // ✅ Capitalized import — must match the icon name exactly

// export const metadata: Metadata = {
//   title: "Next.js Clients Page | NextAdmin - Next.js Dashboard Kit",
//   description: "This is Next.js Clients page for NextAdmin Dashboard Kit",
// };

const ClientsPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Send Invitations" />

            <div className="flex flex-col gap-10">
                {/* Invitation Section */}
                <div className="space-y-6">
                    {/* Header */}
                    {/* <div>
                        <p className="text-slate-600 mt-1">Invite users to join the pilot program</p>
                    </div> */}

                    {/* Invite Form */}
                    <InviteForm />

                    {/* Info Box */}
                    <InviteStatsView />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ClientsPage;
