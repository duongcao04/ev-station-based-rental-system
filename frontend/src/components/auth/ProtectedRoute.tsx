import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types/user";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
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
        path = "/";
        break;
    }

    toast.error("Bạn không có quyền truy cập vào trang này!");

    return <Navigate to={path} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
