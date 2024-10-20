import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpinnerLoading from "./components/spinnerLoading/SpinnerLoading";

const DemoPage = lazy(() => import("./pages/demoPage/DemoPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <DemoPage />
      </Suspense>
    ),
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
