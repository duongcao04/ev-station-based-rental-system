import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types/user";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

interface RoleProtectedRouteProps {
  allowedRoles: User["role"][];
}

const ProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  const init = async () => {
    if (!accessToken) {
      await refresh();
      // Sau khi refresh, lấy lại accessToken từ store để kiểm tra
      const currentAccessToken = useAuthStore.getState().accessToken;
      if (currentAccessToken && !user) {
        await fetchMe();
      }
    } else if (!user) {
      // Nếu đã có accessToken nhưng chưa có user info, fetch luôn
      await fetchMe();
    }

    setStarting(false);
  };

  useEffect(() => {
    init();
  }, [accessToken, user]);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect based on user role
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "staff":
        return <Navigate to="/staff/dashboard" replace />;
      case "renter":
        return <Navigate to="/renters/me" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
