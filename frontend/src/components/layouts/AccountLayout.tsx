import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, IdCard, Settings, UserRound } from "lucide-react";
import { useMemo, type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";

type TabDef = {
  value: string; // key trong Tabs
  label: string; // text hiển thị
  icon: JSX.Element; // icon
  path: string; // route tuyệt đối
  badge?: number; // số badge (nếu có)
};

const TAB_ROUTES: TabDef[] = [
  {
    value: "profile",
    label: "Profile",
    icon: <UserRound />,
    path: "/tai-khoan",
  },
  {
    value: "validate-kyc",
    label: "Xác thực KYC",
    icon: <IdCard />,
    path: "/tai-khoan/xac-thuc-kyc",
  },
  {
    value: "history-rent",
    label: "Lịch sử thuê",
    icon: <History />,
    path: "/tai-khoan/lich-su-thue",
    badge: 5,
  },
  {
    value: "cai-dat",
    label: "Cài đặt",
    icon: <Settings />,
    path: "/tai-khoan/cai-dat",
  },
];

export function AccountTabs({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Xác định tab hiện tại dựa trên pathname
  const currentValue = useMemo(() => {
    if (location.pathname.startsWith("/tai-khoan/xac-thuc-kyc"))
      return "validate-kyc";
    if (location.pathname.startsWith("/tai-khoan/lich-su-thue"))
      return "history-rent";
    // mặc định: /tai-khoan
    return "profile";
  }, [location.pathname]);

  const handleChange = (val: string) => {
    const tab = TAB_ROUTES.find((t) => t.value === val);
    if (tab) navigate(tab.path);
  };

  return (
    <Tabs
      value={currentValue}
      onValueChange={handleChange}
      orientation="vertical"
      className="w-full flex flex-col justify-stretch bg-background lg:flex-row gap-4 text-sm text-muted-foreground p-4 rounded-lg"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
      }}
    >
      <div className="lg:w-[175px] lg:shrink-0">
        <TabsList
          variant="button"
          className="flex flex-col items-stretch *:justify-start"
        >
          {TAB_ROUTES.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2"
            >
              {tab.icon} {tab.label}
              {typeof tab.badge === "number" && (
                <Badge variant="destructive" shape="circle" size="xs">
                  {tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className="size-full border-l pl-4">{children}</div>
    </Tabs>
  );
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-[1440px] mx-auto pt-4 pb-20">
        <AccountTabs>{children}</AccountTabs>
      </main>
      <Footer />
    </div>
  );
}
