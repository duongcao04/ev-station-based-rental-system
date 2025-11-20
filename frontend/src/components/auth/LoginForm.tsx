import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import logo from "../../assets/logo.png";

const signInSchema = z.object({
  username: z.string().min(1, "Tài khoản là email hoặc số điện thoại"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 kí tự"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const signIn = useAuthStore((state) => state.signIn);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    const { username, password } = data;
    const ok = await signIn(username, password);
    if (!ok) return;

    // Đợi một chút để đảm bảo state đã được cập nhật
    // Và đợi fetchMe hoàn thành (đã được gọi trong signIn)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Lấy user từ store sau khi đã fetchMe
    const user = useAuthStore.getState().user;

    if (!user || !user.role) {
      console.error("User data not available after login");
      return;
    }

    // Invalidate React Query cache để refresh profile
    if (queryClient) {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }

    let targetPath = "/";
    switch (user.role) {
      case "admin":
        targetPath = "/dashboard";
        break;
      case "staff":
        targetPath = "/dashboard";
        break;
      case "renter":
        targetPath = "/";
        break;
      default:
        targetPath = "/";
    }
    
    navigate(targetPath, { replace: true });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              {/*header - logo*/}
              <a href="/" className="mx-auto block w-fit text-center">
                {/*----------------------------------------------------------*/}

                <div
                  className="mx-auto block w-fit text-center"
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 8px 25px rgba(5, 150, 105, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    position: "relative",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 35px rgba(5, 150, 105, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(5, 150, 105, 0.2)";
                  }}
                >
                  <img
                    src={logo}
                    alt="EV Station Logo"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "800",
                      color: "#1f2937",
                      margin: 0,
                      lineHeight: "1.1",
                      background:
                        "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    EV Station
                  </h1>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      fontWeight: "500",
                      margin: "0",
                      marginTop: "2px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Thuê xe điện chuyên nghiệp
                  </p>
                </div>
                {/*----------------------------------------------------------*/}
              </a>

              {/*email*/}
              <div className="grid grid-cols gap-3">
                <div className="space-y-2">
                  <Label htmlFor="username" className="block text-sm">
                    Tài khoản
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Email hoặc số điện thoại"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-destructive text-sm">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              {/*password*/}
              <div className="grid grid-cols gap-3">
                <div className="space-y-2">
                  <Label htmlFor="password" className="block text-sm">
                    Mật khẩu
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="******"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-destructive text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/*login button*/}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isSubmitting}
              >
                Đăng nhập
              </Button>

              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Đăng ký
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.pexels.com/photos/32716427/pexels-photo-32716427.jpeg?cs=srgb&dl=pexels-hyundaimotorgroup-32716427.jpg&fm=jpg&_gl=1*1hmii7e*_ga*MTkyMTM0MjMzNC4xNzYyMzc1Nzk3*_ga_8JE65Q40S6*czE3NjIzNzU3OTckbzEkZzEkdDE3NjIzNzU5MjckajYwJGwwJGgw"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        Bằng cách tiếp tục, Bạn đồng ý với <a href="#">Chính sách</a> và{" "}
        <a href="#">Điều khoản</a> của chúng tôi.
      </div>
    </div>
  );
}
