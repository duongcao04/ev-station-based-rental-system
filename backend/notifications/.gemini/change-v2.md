# Changelog - Version 2.0: Tính năng Thông báo Khuyến mãi Tự động

Ngày cập nhật: 26/11/2025

## Tổng quan

Phiên bản này giới thiệu một tính năng mới quan trọng cho **Notification Service**: khả năng tự động gửi thông báo hàng loạt về các chương trình khuyến mãi đến người dùng.

## Các thay đổi chính

### 1. Triển khai Cron Job tự động

- **Thêm cơ chế lập lịch (Scheduler):**
    - Tích hợp thư viện `node-cron` để thực thi các tác vụ định kỳ.
    - Tạo một cron job mới được cấu hình để chạy vào **8:00 sáng mỗi ngày** (giờ Việt Nam).

- **Logic của Cron Job:**
    - Job sẽ tự động truy vấn và lấy danh sách tất cả người dùng đã đăng ký nhận thông báo (dựa trên bảng `UserDevice`).
    - Gửi một thông báo quảng cáo chung đến toàn bộ danh sách người dùng này.

### 2. Cập nhật Service Layer

- **Tạo hàm `sendNotificationToAllUsers`:**
    - Một hàm mới trong `notification.service.ts` được phát triển để xử lý logic gửi thông báo đến nhiều người dùng.
    - Hàm này trừu tượng hóa việc lấy danh sách người dùng và gọi hàm gửi đơn lẻ `sendNotificationService` cho từng người.

### 3. Cấu trúc thư mục

- **Thư mục `src/cron`:**
    - Một thư mục mới đã được tạo để chứa mã nguồn cho các cron job, giúp tách biệt logic và dễ quản lý hơn.
    - File `src/cron/jobs.ts` chứa định nghĩa chi tiết của cron job gửi thông báo khuyến mãi.

### 4. Cập nhật file `index.ts`
- **Khởi tạo Cron Job:**
  - File `src/index.ts` đã được cập nhật để import và khởi chạy cron job ngay khi service bắt đầu, đảm bảo tác vụ được lập lịch chính xác.

### 5. Cập nhật tài liệu

- **`REPORT_NOTIFICATION_SERVICE.md`:** Đã được cập nhật để bao gồm luồng hoạt động của tính năng mới.
- **`Cron-notification-flow.md`:** File tài liệu mới mô tả chi tiết luồng hoạt động của cron job.

## Yêu cầu sau triển khai

- **Cài đặt dependencies:** Do sự cố về quyền thực thi script, các gói `node-cron` và `@types/node-cron` chưa được cài đặt. Cần chạy lệnh `bun install` hoặc `bun add node-cron @types/node-cron` trong thư mục `backend/notifications` để hoàn tất việc cài đặt.
