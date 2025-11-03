// "use client";
// import "jsvectormap/dist/jsvectormap.css";

// import "flatpickr/dist/flatpickr.min.css";
// import "@/css/satoshi.css";
// import "@/css/style.css";
// import React, { useEffect, useState } from "react";
// import Loader from "@/components/common/Loader";
// import AuthProvider from "@/components/AuthProvider";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   // const pathname = usePathname();

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);

//   }, []);

//   return (
//     <html lang="en">
//       <body suppressHydrationWarning={true}>
//         {loading ? (
//           <Loader />
//         ) : (
//           <AuthProvider>
//             {children}
//           </AuthProvider>
//         )}
//       </body>
//     </html>
//   );
// }

"use client";

import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast"; // ✅ FIXED

import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

const SIGNIN_ROUTE = "/auth/signin";
const DASHBOARD_ROUTE = "/";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onSignIn = pathname === SIGNIN_ROUTE;
    const authed = Boolean(token);

    if (!authed && !onSignIn) router.replace(SIGNIN_ROUTE);
    if (authed && onSignIn) router.replace(DASHBOARD_ROUTE);
  }, [token, pathname, router]);

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: "#333", color: "#fff" },
          }}
        />
        <PrivateRoute>{children}</PrivateRoute>
      </body>
    </html>
  );
}
