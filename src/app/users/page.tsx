import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TableFive from "@/components/Tables/TableFive";
import TableSix from "@/components/Tables/TableSix";

// export const metadata: Metadata = {
//   title: "Next.js Organizations Page | NextAdmin - Next.js Dashboard Kit",
//   description: "This is Next.js Organizations page for NextAdmin Dashboard Kit",
// };

const SubscriptionsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" />
      <div className="flex flex-col gap-10">
        {/* <TableFive /> */}
        <TableSix/>
      </div>
    </DefaultLayout>
  );
};

export default SubscriptionsPage;
