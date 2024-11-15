import { lazy, Suspense } from "react";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import { AnonymousRoutes, ProtectedRoutes, SpinnerLoading } from "./components";

const DemoPage = lazy(() => import("./pages/demoPage/DemoPage"));
const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/notFoundPage/NotFoundPage"));
const MyGroupsPage = lazy(() => import("./pages/myGroupsPage/MyGroupsPage"));
const GroupDetailPage = lazy(
  () => import("./pages/groupDetailPage/GroupDetailPage"),
);

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
          {
            path: "/my-groups",
            element: (
              <Suspense fallback={<SpinnerLoading />}>
                <MyGroupsPage />
              </Suspense>
            ),
          },
          {
            path: "/group/:groupId",
            element: (
              <Suspense fallback={<SpinnerLoading />}>
                <GroupDetailPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/404page",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/404page" replace />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
