import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpinnerLoading from "./components/spinnerLoading/SpinnerLoading";
import Layout from "./layouts/Layout";
import AnonymousRoutes from "./components/anonymousRoutes/AnonymousRoutes";
import ProtectedRoutes from "./components/protectedRoutes/ProtectedRoutes";

const DemoPage = lazy(() => import("./pages/demoPage/DemoPage"));
const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));

const router = createBrowserRouter([
  {
    element: <AnonymousRoutes />,
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={<SpinnerLoading />}>
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/",
            element: (
              <Suspense fallback={<SpinnerLoading />}>
                <DemoPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
