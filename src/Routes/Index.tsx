import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Layout";
import NonAuthLayout from "Layout/NonAuthLayout";

//routes
import { authProtectedRoutes } from "./allRoutes";
import { publicRoutes } from "./allRoutes";
import { AuthProtected } from "./AuthProtected";

const Index = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route>
          {publicRoutes.map((route: any, idx: number) => (
            <Route
              key={idx}
              path={route.path}
              element={<NonAuthLayout> {route.component} </NonAuthLayout>}
              // exact={true}
            />
          ))}
        </Route>

        <Route>
          {authProtectedRoutes.map((route: any, idx: number) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <AuthProtected>
                  {" "}
                  <Layout>{route.component}</Layout>{" "}
                </AuthProtected>
              }
              // exact={true}
            />
          ))}
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
// Routes/Index.tsx
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Layout from '../Layout';
// import NonAuthLayout from '../Layout/NonAuthLayout';
// import { authProtectedRoutes, publicRoutes } from './allRoutes';
// import AuthProtected from './AuthProtected';
// import AccessRoute from './AccessRoute'; // Ensure correct import

// const Index = () => {
//   return (
//     <Routes>
//       {/* Public routes */}
//       {publicRoutes.map((route: any, idx: number) => (
//         <Route
//           key={idx}
//           path={route.path}
//           element={<NonAuthLayout>{route.component}</NonAuthLayout>}
//         />
//       ))}

//       {/* Protected routes */}
//       <Route element={<AuthProtected> {/* Ensure to pass children here */} </AuthProtected>}>
//         {authProtectedRoutes.map((route: any, idx: number) => (
//           <Route
//             key={idx}
//             path={route.path}
//             element={
//               <Layout>
//                 <AccessRoute
//                   path={route.path}
//                   component={route.component}
//                   allowedPaths={[]} // Pass allowedPaths here correctly
//                 />
//               </Layout>
//             }
//           />
//         ))}
//       </Route>

//       {/* Handle other routes or 404 */}
//       <Route path="*" element={<Navigate to="/auth-404" />} />
//     </Routes>
//   );
// };

// export default Index;