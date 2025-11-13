import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types/user";
import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

interface RoleProtectedRouteProps {
  allowedRoles: User["role"][];
  children?: React.ReactNode;
}

const ProtectedRoute = ({
  allowedRoles,
  children,
}: RoleProtectedRouteProps) => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const hasShownToast = useRef(false);

  const init = async () => {
    if (!accessToken) {
      await refresh();
      const currentAccessToken = useAuthStore.getState().accessToken;
      if (currentAccessToken && !user) {
        await fetchMe();
      }
    } else if (!user) {
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

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    let path = "/login";
    switch (user.role) {
      case "admin":
      case "staff":
        path = "/dashboard";
        break;
      case "renter":
        path = "/renters/me";
        break;
    }

    // Chỉ show toast 1 lần
    if (!hasShownToast.current) {
      toast.error("Bạn không có quyền truy cập vào trang này!");
      hasShownToast.current = true;
    }

    return <Navigate to={path} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
