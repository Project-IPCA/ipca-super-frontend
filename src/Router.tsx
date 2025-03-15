import { lazy, Suspense } from "react";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import { AnonymousRoutes, ProtectedRoutes, SpinnerLoading } from "./components";
import RoleProtectedRoute from "./components/roleProtectedRoutes/RoleProtectedRoute";
import {
  DASHBOARD_ADMIN,
  EXERCISE_ADMIN,
  STUDENT_ADMIN,
} from "./constants/constants";

const ProfilePage = lazy(() => import("./pages/profilePage/ProfilePage"));
const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/notFoundPage/NotFoundPage"));
const MyGroupsPage = lazy(() => import("./pages/myGroupsPage/MyGroupsPage"));
const AvailableGroupPage = lazy(
  () => import("./pages/availableGroupPage/AvailableGroupPage")
);
const GroupDetailPage = lazy(
  () => import("./pages/groupDetailPage/GroupDetailPage")
);
const StudentDetailPage = lazy(
  () => import("./pages/studentDetailPage/StudentDetailPage")
);
const ExerciseDetailPage = lazy(
  () => import("./pages/exerciseDetailPage/ExerciseDetailPage")
);
const ExercisePoolPage = lazy(
  () => import("./pages/exercisePoolPage/ExercisePoolPage")
);
const ExerciseInfoPage = lazy(
  () => import("./pages/exerciseInfoPage/ExerciseInfoPage")
);
const AdminPage = lazy(() => import("./pages/adminPage/AdminPage"));

const ErrorPage = lazy(() => import("./pages/errorPage/ErrorPage"));

const ForbiddenPage = lazy(() => import("./pages/forbiddenPage/ForbiddenPage"));

const DashboardPage = lazy(() => import("./pages/dashboardPage/DashboardPage"));

const router = createBrowserRouter(
  [
    {
      element: <AnonymousRoutes />,
      errorElement: <Navigate to="/error" replace />,
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
      errorElement: <Navigate to="/error" replace />,
      children: [
        {
          element: <Layout />,
          children: [
            {
              path: "/profile",
              element: (
                <Suspense fallback={<SpinnerLoading />}>
                  <ProfilePage />
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
              path: "/groups",
              element: (
                <Suspense fallback={<SpinnerLoading />}>
                  <AvailableGroupPage />
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
            {
              element: (
                <RoleProtectedRoute acceptedPermission={STUDENT_ADMIN} />
              ),
              children: [
                {
                  path: "/student/:studentId",
                  element: (
                    <Suspense fallback={<SpinnerLoading />}>
                      <StudentDetailPage />
                    </Suspense>
                  ),
                },
                {
                  path: "/exercise/student/:studentId/chapter/:chapterIdx/problem/:problemIdx",
                  element: (
                    <Suspense fallback={<SpinnerLoading />}>
                      <ExerciseDetailPage />
                    </Suspense>
                  ),
                },
              ],
            },
            {
              element: (
                <RoleProtectedRoute acceptedPermission={EXERCISE_ADMIN} />
              ),
              children: [
                {
                  path: "/exercise_pool/group/:groupId/chapter/:chapterIdx",
                  element: (
                    <Suspense fallback={<SpinnerLoading />}>
                      <ExercisePoolPage />
                    </Suspense>
                  ),
                },
                {
                  path: "/exercise_pool/group/:groupId/chapter/:chapterIdx/level/:level/exercise/:exerciseId",
                  element: (
                    <Suspense fallback={<SpinnerLoading />}>
                      <ExerciseInfoPage />
                    </Suspense>
                  ),
                },
              ],
            },
            {
              element: (
                <RoleProtectedRoute acceptedPermission={DASHBOARD_ADMIN} />
              ),
              children: [
                {
                  path: "/dashboard",
                  element: (
                    <Suspense fallback={<SpinnerLoading />}>
                      <DashboardPage />
                    </Suspense>
                  ),
                },
              ],
            },
            {
              path: "/admins",
              element: (
                <Suspense fallback={<SpinnerLoading />}>
                  <AdminPage />
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
      path: "/403page",
      element: (
        <Suspense fallback={<SpinnerLoading />}>
          <ForbiddenPage />
        </Suspense>
      ),
    },
    {
      path: "/error",
      element: (
        <Suspense fallback={<SpinnerLoading />}>
          <ErrorPage />
        </Suspense>
      ),
    },
    {
      path: "/",
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: "*",
      element: <Navigate to="/404page" replace />,
    },
  ],
  { basename: import.meta.env.PROD ? "/super" : "/" }
);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
