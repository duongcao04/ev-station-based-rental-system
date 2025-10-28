import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import MainLayout from '@/components/layouts/MainLayout';
import ThueXeTuLaiPage from './pages/thue-xe-tu-lai/ThueXeTuLaiPage';
const HomePage = lazy(() => import('@/pages/home/HomePage'));
const ErrorPage = lazy(() => import('@/pages/error/ErrorPage'));

// eslint-disable-next-line react-refresh/only-export-components
export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: (
      <Suspense fallback={null}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <MainLayout>
            <HomePage />
          </MainLayout>
        ),
      },
      {
        path: '/thue-xe-tu-lai',
        element: (
          <MainLayout>
            <ThueXeTuLaiPage />
          </MainLayout>
        ),
      },
      {
        path: '/chi-tiet-xe/:slug',
        element: (
          <MainLayout>
            <ThueXeTuLaiPage />
          </MainLayout>
        ),
      },
      // Catch-all
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
