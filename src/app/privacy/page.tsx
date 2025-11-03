import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import PrivacyPolicy from "@/components/StaticPages/PrivacyPolicy";
import React from "react";


export default function PrivacyPage() {
  return (
       <DefaultLayout>
                  <Breadcrumb pageName="Send Invitations" />
                        <PrivacyPolicy />

            </DefaultLayout>
  
  );
}
