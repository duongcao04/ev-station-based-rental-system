# Luồng hoạt động của Cron Job gửi thông báo khuyến mãi

Tài liệu này mô tả chi tiết luồng hoạt động của tính năng tự động gửi thông báo khuyến mãi mỗi ngày.

## 1. Khởi chạy và Lập lịch

1.  **Khởi động Service:** Khi service `notifications` được khởi chạy (ví dụ: qua lệnh `npm run dev`), file entrypoint `src/index.ts` sẽ được thực thi.
2.  **Nạp Cron Job:** `src/index.ts` import file `src/cron/jobs.ts`. Ngay khi được import, file này sẽ sử dụng thư viện `node-cron` để đăng ký và lập lịch cho một tác vụ.
3.  **Hẹn giờ:** Tác vụ được lên lịch để tự động chạy một lần mỗi ngày vào lúc **8:00 sáng** (theo múi giờ `Asia/Ho_Chi_Minh`).

## 2. Thực thi tác vụ định kỳ

Khi đến đúng 8:00 sáng, hàm `cron.schedule` sẽ tự động thực thi logic bên trong nó.

1.  **Bắt đầu Job:** Cron job được kích hoạt và ghi log ra console để đánh dấu thời điểm bắt đầu.
2.  **Gọi Service gửi thông báo hàng loạt:** Tác vụ sẽ gọi hàm `sendNotificationToAllUsers` từ file `src/services/notification.service.ts`.
3.  **Lấy danh sách người dùng:**
    *   Bên trong `sendNotificationToAllUsers`, hệ thống truy vấn vào bảng `UserDevice` trong cơ sở dữ liệu.
    *   Nó sử dụng `findMany` với tùy chọn `distinct: ['userId']` để lấy ra một danh sách các `userId` **duy nhất** (không trùng lặp) đã từng đăng ký ít nhất một thiết bị.
4.  **Soạn nội dung:** Một nội dung thông báo khuyến mãi tĩnh (placeholder) được chuẩn bị, bao gồm `title`, `body`, và `url` để điều hướng người dùng khi họ nhấn vào.
5.  **Gửi thông báo đến từng người:**
    *   Hàm `sendNotificationToAllUsers` lặp qua từng `userId` đã lấy được.
    *   Với mỗi `userId`, nó gọi hàm `sendNotificationService` - một hàm chuyên dụng để gửi thông báo cho một người dùng cụ thể.
6.  **Xử lý gửi và Lưu trữ:** Bên trong `sendNotificationService`:
    *   **Lưu vào CSDL:** Một bản ghi mới được tạo trong bảng `Notification` để lưu lại lịch sử thông báo cho người dùng này.
    *   **Lấy Token thiết bị:** Truy vấn lại bảng `UserDevice` để lấy tất cả các FCM token (token của thiết bị) được liên kết với `userId` hiện tại.
    *   **Gửi qua Firebase:** Sử dụng `firebase-admin`, hệ thống gửi thông báo đến tất cả các thiết bị của người dùng qua Firebase Cloud Messaging (FCM).
    *   **Xử lý Token hết hạn:** Nếu FCM trả về lỗi cho biết một token nào đó không hợp lệ, token đó sẽ bị xóa khỏi CSDL để tránh gửi thất bại trong tương lai.
7.  **Hoàn tất:** Sau khi gửi thông báo cho tất cả người dùng trong danh sách, cron job kết thúc và ghi log hoàn thành.

## Sơ đồ tóm tắt

`Service Start` -> `index.ts` -> `cron/jobs.ts` (Lập lịch)
-> `8:00 AM`
-> `Cron Job Triggered`
-> `sendNotificationToAllUsers()`
-> `DB Query (SELECT DISTINCT userId)`
-> `Loop (for each userId)`
-> `sendNotificationService(userId, promotion)`
-> `DB Insert (Notification)`
-> `DB Query (SELECT fcmToken)`
-> `FCM Send`
-> `End Loop`
-> `Job Finished`
