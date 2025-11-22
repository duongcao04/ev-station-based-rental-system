import MainLayout from '@/components/layouts/MainLayout';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AccountLayout from './components/layouts/AccountLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import './index.css';
import ChiTietXePage from './pages/chi-tiet-xe/ChiTietXePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import KYCVerificationPage from './pages/dashboard/KYCVerificationPage';
import MenbersManagementPage from './pages/dashboard/MenbersManagemetPage';
import QuanLyBookingDetailPage from './pages/dashboard/QuanLyBookingDetailPage';
import QuanLyBookingPage from './pages/dashboard/QuanLyBookingPage';
import QuanLyTramXePage from './pages/dashboard/QuanLyTramXePage';
import QuanLyXeDienPage from './pages/dashboard/QuanLyXeDienPage';
import SettingsPage from './pages/dashboard/SettingPage';
import CreateBookingPage from './pages/dat-xe/CreateBookingPage';
import HuongDanThueXe from './pages/huong-dan-thue-xe/HuongDanThueXe';
import LienHePage from './pages/lien-he/LienHePage';
import { LichSuThueXeChiTietPage } from './pages/tai-khoan/LichSuThueXeChiTietPage';
import { LichSuThueXePage } from './pages/tai-khoan/LichSuThueXePage';
import RenterSettingsPage from './pages/tai-khoan/SettingPage';
import ThongTinTaiKhoanPage from './pages/tai-khoan/ThongTinTaiKhoanPage';
import XacThucKYC from './pages/tai-khoan/XacThucKYC';
import PaymentPage from './pages/thanh-toan/PaymentPage';
import PaymentResultPage from './pages/thanh-toan/PaymentResultPage';
import ThueXeTuLaiPage from './pages/thue-xe-tu-lai/ThueXeTuLaiPage';
import TramXePage from './pages/tram-xe/TramXePage';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
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
        path: '/huong-dan-thue-xe',
        element: (
          <MainLayout>
            <HuongDanThueXe />
          </MainLayout>
        ),
      },
      {
        path: '/lien-he',
        element: (
          <MainLayout>
            <LienHePage />
          </MainLayout>
        ),
      },
      {
        path: '/tram-xe',
        element: (
          <MainLayout>
            <TramXePage />
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
    path: '/xe/:slug',
    element: (
      <MainLayout>
        <ChiTietXePage />
      </MainLayout>
    ),
    errorElement: (
      <Suspense fallback={null}>
        <ErrorPage />
      </Suspense>
    ),
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
          <ProtectedRoute allowedRoles={['renter']}>
            <AccountLayout>
              <ThongTinTaiKhoanPage />
            </AccountLayout>
          </ProtectedRoute>
        ),
      }, // /tai-khoan  -> Profile
      {
        path: 'lich-su-thue',
        element: (
          <ProtectedRoute allowedRoles={['renter']}>
            <AccountLayout>
              <LichSuThueXePage />
            </AccountLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'lich-su-thue/*',
        element: (
          <ProtectedRoute allowedRoles={['renter']}>
            <AccountLayout>
              <LichSuThueXeChiTietPage />
            </AccountLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'xac-thuc-kyc',
        element: (
          <ProtectedRoute allowedRoles={['renter']}>
            <AccountLayout>
              <XacThucKYC />
            </AccountLayout>
          </ProtectedRoute>
        ),
      }, // /tai-khoan/xac-thuc-kyc
      {
        path: 'cai-dat',
        element: (
          <ProtectedRoute allowedRoles={['renter']}>
            <AccountLayout>
              <RenterSettingsPage />
            </AccountLayout>
          </ProtectedRoute>
        ),
      },

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
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
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
      {
        path: '/dashboard/bookings',
        element: (
          <DashboardLayout>
            <QuanLyBookingPage />
          </DashboardLayout>
        ),
      },
      {
        path: '/dashboard/xe-dien',
        element: (
          <DashboardLayout>
            <QuanLyXeDienPage />
          </DashboardLayout>
        ),
      },
      {
        path: '/dashboard/bookings/:bookingId',
        element: (
          <DashboardLayout>
            <QuanLyBookingDetailPage />
          </DashboardLayout>
        ),
      },
      {
        path: '/dashboard/setting',
        element: (
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        ),
      },
      {
        path: '/dashboard/tram-xe',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <QuanLyTramXePage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/bookings',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DashboardLayout>
              <QuanLyBookingPage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/bookings/:bookingId',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DashboardLayout>
              <QuanLyBookingDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/menbers',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <MenbersManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/kyc-verification',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DashboardLayout>
              <KYCVerificationPage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/setting',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
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
