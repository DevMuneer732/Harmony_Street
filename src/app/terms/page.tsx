import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

import TermsOfService from "@/components/StaticPages/TermCondition";
import React from "react";

export default function TermsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Terms and Conditions" />
      <TermsOfService />
    </DefaultLayout>
  );
}
