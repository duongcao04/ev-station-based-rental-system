# EV Station-based Rental System / Phần mềm thuê xe điện tại điểm thuê

## Requirements
### 1. Architecture: Microservices

### 2. Actors:
- EV Renter
- Station Staff
- Admin

### 3. Features
1. Chức năng cho Người thuê (EV Renter)
- Đăng ký & xác thực
* Tạo tài khoản, upload giấy phép lái xe, CMND/ CCCD.
* Xác thực nhanh qua nhân viên tại điểm thuê.
- Đặt xe
* Tìm điểm thuê trên bản đồ.
* Xem danh sách xe có sẵn (loại, dung lượng pin, giá).
* Đặt xe trước hoặc đến trực tiếp tại điểm.
- Nhận xe
* Check-in tại quầy/ứng dụng.
* Ký hợp đồng điện tử (hoặc giấy tờ tại chỗ).
* Xác nhận bàn giao cùng nhân viên (check tình trạng xe, chụp ảnh).
- Trả xe
* Trả xe đúng điểm thuê.
* Nhân viên kiểm tra và xác nhận tình trạng xe.
* Thanh toán các chi phí phát sinh (nếu có).
- Lịch sử & phân tích cá nhân
* Xem các chuyến thuê trước đây, chi phí, quãng đường.
* Thống kê thời điểm thường thuê (giờ cao điểm/thấp điểm).

2. Chức năng cho Nhân viên tại điểm thuê (Station Staff)
- Quản lý giao – nhận xe
* Xem danh sách xe có sẵn, xe đã đặt trước, xe đang cho thuê.
* Thực hiện thủ tục bàn giao: kiểm tra xe, chụp ảnh, cập nhật tình trạng.
* Ký xác nhận điện tử cùng khách hàng khi giao/nhận xe.
- Xác thực khách hàng
* Kiểm tra giấy phép lái xe & giấy tờ tuỳ thân.
* Đối chiếu với hồ sơ trên hệ thống.
- Thanh toán tại điểm
* Ghi nhận thanh toán phí thuê xe điện.
* Ghi nhận đặt cọc hoặc hoàn cọc.
- Quản lý xe tại điểm
* Cập nhật trạng thái pin, tình trạng kỹ thuật.
* Báo cáo sự cố hoặc hỏng hóc lên admin.

3. Chức năng cho Quản trị (Admin)
- Quản lý đội xe & điểm thuê
* Giám sát số lượng xe ở từng điểm.
* Theo dõi lịch sử giao/nhận và tình trạng xe.
* Điều phối nhân viên & xe khi có nhu cầu tăng cao.
- Quản lý khách hàng
* Hồ sơ khách hàng, lịch sử thuê, xử lý khiếu nại.
* Danh sách khách hàng “có rủi ro” (thường vi phạm, gây hư hỏng).
- Quản lý nhân viên
* Danh sách nhân viên tại các điểm.
* Theo dõi hiệu suất (số lượt giao/nhận, mức độ hài lòng khách hàng).
- Báo cáo & phân tích
* Doanh thu theo điểm thuê.
* Tỷ lệ sử dụng xe, giờ cao điểm.
* AI gợi ý dự báo nhu cầu thuê để nâng cấp đội xe.

## Document details
Updating ...