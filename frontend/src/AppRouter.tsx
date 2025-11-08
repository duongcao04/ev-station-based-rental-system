import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { Toaster } from 'sonner';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
import MainLayout from '@/components/layouts/MainLayout';
import ThueXeTuLaiPage from './pages/thue-xe-tu-lai/ThueXeTuLaiPage';
import DashboardLayout from './components/layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import ChiTietXePage from './pages/chi-tiet-xe/ChiTietXePage';
import CreateBookingPage from './pages/dat-xe/CreateBookingPage';
import PaymentPage from './pages/thanh-toan/PaymentPage';
import PaymentResultPage from './pages/thanh-toan/PaymentResultPage';
import QuanLyTramXePage from './pages/dashboard/QuanLyTramXePage';
import AccountLayout from './components/layouts/AccountLayout';
import ThongTinTaiKhoanPage from './pages/tai-khoan/ThongTinTaiKhoanPage';
import XacThucKYC from './pages/tai-khoan/XacThucKYC';
import { LichSuThueXePage } from './pages/tai-khoan/LichSuThueXePage';
import { LichSuThueXeChiTietPage } from './pages/tai-khoan/LichSuThueXeChiTietPage';
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
        path: '/login',
        element: (
          <Suspense fallback={null}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={null}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: '/chi-tiet-xe/:slug',
        element: (
          <MainLayout>
            <ChiTietXePage />
          </MainLayout>
        ),
      },
      {
        path: '/dat-xe/:vehicleId',
        element: (
          <MainLayout>
            <CreateBookingPage />
          </MainLayout>
        ),
      },
      {
        path: '/thanh-toan/:bookingId',
        element: (
          <MainLayout>
            <PaymentPage />
          </MainLayout>
        ),
      },
      {
        path: '/thanh-toan/ket-qua',
        element: (
          <MainLayout>
            <PaymentResultPage />
          </MainLayout>
        ),
      },
      // Catch-all
      { path: '*', element: <ErrorPage /> },
    ],
  },
  {
    path: '/tai-khoan',
    errorElement: (
      <Suspense fallback={null}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <AccountLayout>
            <ThongTinTaiKhoanPage />
          </AccountLayout>
        ),
      }, // /tai-khoan  -> Profile
      {
        path: 'lich-su-thue',
        element: (
          <AccountLayout>
            <LichSuThueXePage />
          </AccountLayout>
        ),
      },
      {
        path: 'lich-su-thue/*',
        element: (
          <AccountLayout>
            <LichSuThueXeChiTietPage />
          </AccountLayout>
        ),
      },
      {
        path: 'xac-thuc-kyc',
        element: (
          <AccountLayout>
            <XacThucKYC />
          </AccountLayout>
        ),
      }, // /tai-khoan/xac-thuc-kyc
      { path: '*', element: <ErrorPage /> },
    ],
  },
  {
    path: '/dashboard',
    errorElement: (
      <Suspense fallback={null}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        ),
      },
      {
        path: '/dashboard/tram-xe',
        element: (
          <DashboardLayout>
            <QuanLyTramXePage />
          </DashboardLayout>
        ),
      },
      // Catch-all
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);

export default function AppRouter() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position='top-right' richColors />
    </>
  );
}
