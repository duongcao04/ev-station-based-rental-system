# Kế hoạch triển khai tính năng Thông báo Ưu đãi Tự động (Cron Notification)

Dưới đây là kế hoạch chi tiết để triển khai tính năng tự động gửi thông báo khuyến mãi dựa trên sự đồng ý của người dùng.

## 1. Phía Backend (Service `notifications`)

Đây là nơi thực hiện logic chính của tính năng.

### a. Cài đặt và Cấu trúc

*   **Cài đặt thư viện:** Thêm `node-cron` vào service `notifications` để quản lý việc lập lịch các tác vụ. (Hoàn thành)
*   **Tạo file mới:** Tạo một file `src/cron/jobs.ts` để chứa logic của các cron job. (Hoàn thành)

### b. Logic của Cron Job

*   **Lập lịch:** Một tác vụ sẽ được lên lịch để chạy tự động mỗi ngày vào 8 giờ sáng. (Hoàn thành)
*   **Quy trình thực hiện:**
    1.  **Lấy danh sách người dùng:** Tác vụ sẽ truy vấn vào bảng `UserDevice` để lấy danh sách các `userId` duy nhất đã đăng ký nhận thông báo. (Hoàn thành)
    2.  **Lấy thông tin khuyến mãi (Giả định):** Tác vụ sẽ gửi một request đến service `vehicles` (ví dụ: `GET http://vehicles-service/api/v1/vehicles?promotion=true`) để lấy thông tin về các xe đang có ưu đãi. (Hoàn thành - sử dụng dữ liệu giả định)
    3.  **Soạn nội dung:** Dựa trên thông tin lấy được, tác vụ sẽ tạo ra một nội dung thông báo chung, ví dụ: "Ưu đãi trong ngày! Giảm giá 20% cho các dòng xe Vinfast. Khám phá ngay!" (Hoàn thành)
    4.  **Gửi thông báo:** Lặp qua danh sách người dùng và gọi hàm `sendNotificationService` (hàm đã có sẵn trong service) để gửi thông báo đến từng người. Đường dẫn (`url`) sẽ trỏ đến trang `/thue-xe-tu-lai?filter=promotion`. (Hoàn thành)

### c. Khởi chạy

*   **Cập nhật `src/index.ts`:** File entrypoint của service `notifications` sẽ được cập nhật để import và khởi chạy các cron job đã định nghĩa. (Hoàn thành)

## 2. Phía Frontend

*   **MVP:** Trong phiên bản đầu tiên, không cần thay đổi gì ở frontend. Hệ thống thông báo hiện tại đã có thể nhận và hiển thị các thông báo này.
*   **Nâng cao (Tương lai):** Sẽ xem xét việc thêm một mục trong trang cài đặt tài khoản để người dùng có thể tùy chọn bật/tắt nhận thông báo khuyến mãi.

---
*Trạng thái hiện tại: Đã hoàn thành triển khai các thay đổi ở backend.*
