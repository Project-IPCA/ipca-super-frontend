import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpinnerLoading from "./components/spinnerLoading/SpinnerLoading";
import Layout from "./layouts/Layout";

const DemoPage = lazy(() => import("./pages/demoPage/DemoPage"));

const router = createBrowserRouter([
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
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
