# Tính năng Thông báo đã triển khai

Tính năng thông báo đã được triển khai trong ứng dụng frontend với các thay đổi và luồng hoạt động chi tiết như sau:

## 1. Các Components và File đã thay đổi

**Các file mới được tạo:**

*   `src/lib/firebase.ts`: Khởi tạo và cấu hình Firebase SDK cho frontend.
*   `src/lib/api/notification.api.ts`: Tập trung các hàm gọi API đến service thông báo (đăng ký thiết bị, lấy danh sách thông báo, đánh dấu đã đọc).
*   `src/lib/types/notification.type.ts`: Định nghĩa các kiểu dữ liệu (interfaces) cho `Notification` để đảm bảo tính nhất quán.
*   `src/lib/queries/useNotifications.ts`: Một custom hook sử dụng React Query để lấy, cache và cập nhật dữ liệu thông báo một cách hiệu quả.
*   `src/components/DeviceRegistrationHandler.tsx`: Một component chạy nền, có nhiệm vụ lấy `FCM token` từ Firebase và đăng ký thiết bị với backend sau khi người dùng đăng nhập.
*   `src/components/RealtimeNotificationHandler.tsx`: Lắng nghe các thông báo đẩy (push notification) khi người dùng đang mở ứng dụng và hiển thị chúng dưới dạng toast, đồng thời cập nhật lại danh sách thông báo.

**Các file được chỉnh sửa:**

*   `src/components/NotificationDropdown.tsx`: Component chính được cập nhật để hiển thị dữ liệu thông báo thật từ API, thay vì dữ liệu giả. Nó được kết nối với `useNotifications` hook, xử lý trạng thái loading và trạng thái chưa có thông báo.
*   `src/AppRouter.tsx`: Bổ sung `DeviceRegistrationHandler` và `RealtimeNotificationHandler` để đảm bảo chúng luôn được render và hoạt động ngầm trong toàn bộ ứng dụng.
*   `package.json` & `package-lock.json`: Thêm thư viện `firebase`.
*   `.env` & `.env.example`: Thêm các biến môi trường cần thiết cho việc kết nối với Firebase.

## 2. Luồng hoạt động của tính năng thông báo

1.  **Đăng ký thiết bị:**
    *   Khi người dùng đăng nhập thành công, `DeviceRegistrationHandler` sẽ được kích hoạt.
    *   Nó sẽ yêu cầu quyền gửi thông báo từ trình duyệt. Nếu người dùng đồng ý, nó sẽ lấy một `FCM Token` (một mã định danh duy nhất cho trình duyệt này) từ Firebase.
    *   Token này sau đó được gửi lên backend thông qua API `registerDevice` để backend biết cách gửi thông báo đến đúng thiết bị này.

2.  **Nhận và hiển thị thông báo:**
    *   **Khi người dùng đang mở ứng dụng (Foreground):** `RealtimeNotificationHandler` sẽ bắt sự kiện `onMessage`. Khi có thông báo mới, một pop-up nhỏ (toast) sẽ hiện ra ở góc màn hình, và danh sách thông báo trong dropdown sẽ tự động được làm mới.
    *   **Khi ứng dụng bị đóng hoặc ở tab khác (Background):** Trình duyệt sẽ tự động hiển thị một thông báo hệ thống (system notification).

3.  **Tương tác với danh sách thông báo:**
    *   Người dùng nhấp vào biểu tượng chuông ở `TopNavigation` để mở `NotificationDropdown`.
    *   Component này sẽ gọi `useNotifications` hook để lấy và hiển thị danh sách thông báo.
    *   Khi người dùng nhấp vào một thông báo, API `markAsRead` sẽ được gọi để đánh dấu là "đã đọc", và ứng dụng sẽ tự động điều hướng người dùng đến đường dẫn (`url`) được đính kèm trong thông báo (ví dụ: trang chi tiết đặt xe).

## 3. Các vai trò (Roles) bị ảnh hưởng

*   Tính năng này được thiết kế cho **tất cả người dùng đã đăng nhập**, bao gồm `renter`, `admin`, và `staff`. Bất kỳ người dùng nào có tài khoản và đăng nhập đều có thể nhận được các thông báo liên quan đến hoạt động của họ.
*   Logic về việc gửi thông báo (ví dụ: gửi cho `renter` khi đơn đặt xe được xác nhận, gửi cho `admin` khi có một KYC mới) được quyết định ở phía backend. Frontend chỉ có nhiệm vụ hiển thị chúng.

## 4. Các luồng (Flows) bị ảnh hưởng

*   **Luồng Đăng nhập (Login Flow):** Luồng đăng ký thiết bị được tích hợp một cách tự động ngay sau khi người dùng đăng nhập thành công.
*   **Luồng tương tác chung (User Interaction):** Biểu tượng chuông thông báo không còn là tĩnh mà đã trở thành một thành phần chức năng, cho phép người dùng xem và quản lý thông báo của mình, tăng cường sự tương tác với hệ thống.
*   **Toàn bộ ứng dụng:** Giờ đây có khả năng nhận các cảnh báo và cập nhật theo thời gian thực, giúp người dùng không bỏ lỡ các thông tin quan trọng.