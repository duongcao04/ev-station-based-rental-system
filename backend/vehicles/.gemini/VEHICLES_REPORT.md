1. Giới thiệu tổng quan
1.1. Vai trò và chức năng
Vehicle Service là phân hệ lõi (Core Service) chịu trách nhiệm quản lý toàn bộ danh mục sản phẩm (Product Catalog) trong hệ sinh thái thuê xe điện EV Rental. Service này đóng vai trò là "Single Source of Truth" (Nguồn dữ liệu duy nhất) về thông tin phương tiện, đảm bảo tính nhất quán và toàn vẹn dữ liệu trên toàn hệ thống.

Vai trò chính:

Quản lý danh mục (Catalog Management): Lưu trữ tập trung và cung cấp thông tin chi tiết về các dòng xe, thương hiệu, và phân loại xe.

Quản lý kho (Inventory Tracking): Theo dõi số lượng xe thực tế, trạng thái tồn kho (In Stock/Out of Stock) và tình trạng vận hành (Available, Maintenance, Rented).

Công cụ tìm kiếm (Search Engine): Cung cấp API hỗ trợ tìm kiếm và lọc nâng cao (Filtering) đa tiêu chí (Giá, Thương hiệu, Loại xe, Thông số) phục vụ Client App.

Cấu hình kỹ thuật động (Dynamic Specifications): Cho phép định nghĩa và gán các thông số kỹ thuật linh hoạt cho từng dòng xe mà không cần sửa đổi cấu trúc database.

Chức năng chính:

CRUD Xe (Car Lifecycle): Tạo mới, cập nhật, xóa và truy vấn chi tiết xe (bao gồm quản lý giá niêm yết, giá khuyến mãi, tiền cọc).

Quản lý Master Data: Quản lý các dữ liệu nền tảng gồm Thương hiệu (Brand), Danh mục (Category) và Loại thông số (Specification Types).

Quản lý Media: Tích hợp lưu trữ, sắp xếp ảnh đại diện (Thumbnail) và thư viện ảnh chi tiết (Featured Images).

Validation & Availability: Cung cấp API nội bộ (Internal API) để các service khác (Booking, Station) xác thực sự tồn tại và khả dụng của xe trước khi thực hiện giao dịch.

1.2. Phạm vi hoạt động (Scope)
Trong phạm vi (In-Scope):

Chuẩn hóa dữ liệu: Quản lý các mối quan hệ phức tạp: Brand (1-N) Car, Category (N-N) Car, Specs (1-N) Car.

Logic giá (Pricing Engine): Tính toán "Effective Price" (Giá hiệu lực) hiển thị cho người dùng, tự động ưu tiên giá Sale nếu có.

Tích hợp hệ thống:

Cung cấp dữ liệu metadata xe cho Booking Service (để tạo đơn).

Cung cấp danh sách xe cho Station Service (để hiển thị xe tại trạm).

Ngoài phạm vi (Out-of-Scope):

Không quản lý logic nghiệp vụ thuê xe (Booking flow, Time slots) → Thuộc Booking Service.

Không quản lý vị trí GPS thời gian thực (Tracking) → Thuộc IoT Service.

Không xử lý logic lịch biểu (Availability Calendar - xe A bận ngày nào) → Thuộc Booking Service. Vehicle Service chỉ quản lý trạng thái vật lý chung (ví dụ: xe đang hỏng/bảo trì).

2. Kiến trúc hệ thống
2.1. Vị trí trong kiến trúc Microservices (Context Diagram)
Vehicle Service nằm ở tầng Core Services, giao tiếp trực tiếp với Database riêng và nhận request từ API Gateway cũng như các Service nội bộ khác.

Mô tả luồng tương tác:

Client/Admin: Gửi request qua API Gateway. Gateway sẽ định tuyến các request bắt đầu bằng /api/v1/vehicles, /brands, /categories vào Vehicle Service.

Auth Service: Vehicle Service giao tiếp với Auth Service (hoặc thông qua Middleware tại Gateway) để xác thực quyền Admin khi thực hiện các thao tác Ghi (Create/Update/Delete).

Booking Service: Khi người dùng đặt xe, Booking Service gọi API nội bộ của Vehicle Service để lấy thông tin chi tiết (tên xe, giá cọc) để tạo đơn hàng.

Station Service: Khi xem chi tiết trạm, Station Service gọi Vehicle Service để lấy danh sách các xe đang được gán cho trạm đó.

Vehicle DB: Service sở hữu một Database PostgreSQL riêng biệt, không chia sẻ trực tiếp với các service khác.

2.2 Công nghệ sử dụng
Vehicle Service được xây dựng dựa trên các công nghệ hiện đại, ưu tiên hiệu năng xử lý I/O và tính toàn vẹn dữ liệu:

Ngôn ngữ lập trình: Node.js (sử dụng chuẩn JavaScript ES Modules - ESM) giúp mã nguồn hiện đại, tối ưu hóa việc import/export module và hỗ trợ async/await native tốt hơn.

Web Framework: Express.js 5.x. Đây là phiên bản mới nhất hỗ trợ xử lý lỗi bất đồng bộ (Async Error Handling) tốt hơn, giúp code Controller gọn gàng và ổn định.

Cơ sở dữ liệu (Database): PostgreSQL. Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ, phù hợp để xử lý các cấu trúc dữ liệu liên kết chặt chẽ (Relational Data) như Xe - Hãng - Danh mục - Thông số.

ORM (Object-Relational Mapping): Prisma. Giúp thao tác với cơ sở dữ liệu an toàn (Type-safe), quản lý schema và migration trực quan, giảm thiểu lỗi truy vấn SQL thủ công.

Bảo mật & Middleware: Hệ thống tích hợp các middleware tiêu chuẩn:

helmet: Tăng cường bảo mật thông qua HTTP Headers.

cors: Kiểm soát truy cập tài nguyên chéo (Cross-Origin Resource Sharing).

express-rate-limit: Giới hạn tần suất request để ngăn chặn tấn công Brute-force hoặc DDoS.

morgan: Ghi log request HTTP phục vụ giám sát và debug.

Kiến trúc: Microservices. Vehicle Service được thiết kế tách biệt hoàn toàn (Decoupled), sở hữu Database riêng (Database per Service pattern) để đảm bảo không bị phụ thuộc dữ liệu trực tiếp vào các service khác.

Cơ chế giao tiếp (Communication):

Internal (Nội bộ): Giao tiếp với Booking Service, Payment Service thông qua REST API trên mạng nội bộ Docker.

External (Bên ngoài): Mọi request từ Client (Front-end) đều phải đi qua API Gateway để định tuyến và xác thực, Vehicle Service không public port trực tiếp ra Internet.

Hạ tầng & Triển khai: Ứng dụng được đóng gói (Containerization) bằng Docker, đảm bảo môi trường chạy đồng nhất giữa Development, Staging và Production.

2.3. Mô hình dữ liệu
Hệ thống áp dụng mô hình kiến trúc Database-per-Service (Mỗi dịch vụ một cơ sở dữ liệu). Đây là nguyên tắc cốt lõi giúp đảm bảo tính tự chủ và độ tin cậy của Vehicle Service trong hệ sinh thái Microservices.

Cơ chế hoạt động:

Quyền sở hữu độc quyền: Vehicle Service sở hữu một cơ sở dữ liệu PostgreSQL riêng biệt. Không một service nào khác (như Booking, Payment) được phép truy cập trực tiếp (Direct Connect) vào Database này.

Giao tiếp qua API: Mọi nhu cầu đọc/ghi dữ liệu liên quan đến phương tiện từ các service khác đều phải thực hiện thông qua Internal REST API mà Vehicle Service cung cấp.

Lợi ích áp dụng:

Độc lập dữ liệu (Loose Coupling): Vehicle Service có thể thay đổi cấu trúc bảng, nâng cấp phiên bản Database hoặc thay đổi công nghệ lưu trữ mà không làm "gãy" (breaking changes) các service khác, miễn là API Contract vẫn được giữ nguyên.

Khả năng mở rộng (Scalability): Có thể mở rộng tài nguyên (CPU, RAM, Storage) cho Vehicle Database một cách độc lập dựa trên nhu cầu thực tế (ví dụ: lượng search xe tăng cao) mà không ảnh hưởng đến Database của phần thanh toán hay đặt xe.

Toàn vẹn dữ liệu (Data Integrity): Ngăn chặn việc các service khác vô tình chỉnh sửa sai lệch thông tin xe hoặc gây ra các vấn đề về khóa bảng (Table locking), đảm bảo Vehicle Service có toàn quyền kiểm soát logic nghiệp vụ trên dữ liệu của mình.

Bảo trì & Quản lý: Mỗi team phát triển có thể tập trung quản lý Database của riêng mình, đơn giản hóa quy trình backup, restore và tối ưu hóa truy vấn (Query Optimization).

Vehicle Service quản lý các thực thể dữ liệu sau

Thực thể (Entity)

Mô tả

Quan hệ chính

Car

Đối tượng trung tâm. Chứa thông tin: Tên, SKU, Slug, Giá (Regular/Sale/Deposit), Tồn kho, Trạng thái.

Brand (N-1), Category (N-N), CarImage (1-N), CarSpec (1-N)

Brand

Thương hiệu xe (VD: VinFast, Tesla).

Car (1-N)

Category

Phân loại dòng xe (VD: Sedan, SUV, Luxury).

Car (N-N)

SpecificationType

Định nghĩa tên thông số kỹ thuật (VD: "Mã lực", "Số ghế", "Quãng đường/lần sạc").

CarSpecification (1-N)

CarSpecification

Giá trị thực tế của thông số gán cho một xe cụ thể.

Car (N-1), SpecificationType (N-1)

CarImage

Lưu trữ URL ảnh và thứ tự hiển thị (Sort order) cho xe.

Car (N-1)

3. Thiết kế cơ sở dữ liệu Vehicle Service ( ERD – Entity Relationship Diagram)
3.1. Tổng quan ERD
Vehicle Service tuân thủ mô hình Database-per-Service. Bảng Car là bảng trung tâm. Các mối quan hệ với Brand, Category, Specifications là quan hệ khóa ngoại cứng (Foreign Key) trong database này để đảm bảo toàn vẹn dữ liệu sản phẩm.

Tuy nhiên, station_id (lưu trong bảng Car để biết xe đang ở trạm nào) chỉ là tham chiếu logic tới Station Service, không phải Foreign Key database.

3.2. ERD (Entity Relationship Diagram)
Cơ sở dữ liệu của Vehicle Service bao gồm 6 bảng chính và 1 bảng quan hệ ẩn (cho quan hệ N-N giữa Car và Category).

3.3. Chi tiết bảng
Cơ sở dữ liệu của Vehicle Service bao gồm 6 bảng chính và 1 bảng quan hệ ẩn (cho quan hệ N-N giữa Car và Category).

1. Bảng Car (Thông tin xe)
Đây là bảng trung tâm lưu trữ toàn bộ thông tin cơ bản, trạng thái kho và giá cả của phương tiện.

Khóa chính: id

Quan hệ:

N-1 với Brand.

1-N với CarImage.

1-N với CarSpecification.

N-N với Category.

Tên trường

Kiểu dữ liệu (PostgreSQL)

Ràng buộc

Mô tả

id

TEXT / UUID

PK, Not Null

Định danh duy nhất của xe (UUID).

displayName

TEXT

Not Null

Tên hiển thị của xe (VD: VinFast VF8 Eco).

slug

TEXT

Unique, Not Null

Đường dẫn thân thiện cho SEO (VD: vinfast-vf8-eco).

sku

TEXT

Not Null

Mã quản lý kho (Stock Keeping Unit).

brandId

TEXT / UUID

FK, Nullable

ID tham chiếu đến bảng Brand.

regularPrice

DECIMAL(10, 2)

Not Null

Giá thuê niêm yết (Giá gốc).

salePrice

DECIMAL(10, 2)

Nullable

Giá thuê khuyến mãi (nếu có).

depositPrice

DECIMAL(10, 2)

Nullable

Số tiền đặt cọc yêu cầu.

quantity

INTEGER

Nullable

Số lượng xe vật lý hiện có trong kho.

isInStock

BOOLEAN

Not Null

Cờ đánh dấu xe còn hàng hay hết hàng.

status

ENUM (CarStatus)

Default: available

Trạng thái hiện tại: available, rented, maintenance.

seatingCapacity

INTEGER

Default: 4

Số chỗ ngồi (thuộc tính cứng để lọc nhanh).

thumbnailUrl

TEXT

Not Null

Đường dẫn ảnh đại diện chính của xe.

description

TEXT

Nullable

Bài viết mô tả chi tiết về xe.

2. Bảng Brand (Thương hiệu)
Lưu trữ danh sách các hãng sản xuất xe (Master Data).

Khóa chính: id

Tên trường

Kiểu dữ liệu

Ràng buộc

Mô tả

id

TEXT / UUID

PK, Not Null

Định danh thương hiệu.

displayName

TEXT

Not Null

Tên hiển thị (VD: Toyota, Tesla).

description

TEXT

Not Null

Mô tả ngắn về thương hiệu.

thumbnailUrl

TEXT

Nullable

Logo hoặc ảnh đại diện thương hiệu.

3. Bảng Category (Danh mục)
Lưu trữ phân loại xe (Master Data). Một xe có thể thuộc nhiều danh mục (VD: vừa là "Xe điện", vừa là "SUV").

Khóa chính: id

Tên trường

Kiểu dữ liệu

Ràng buộc

Mô tả

id

TEXT / UUID

PK, Not Null

Định danh danh mục.

displayName

TEXT

Not Null

Tên danh mục (VD: Sedan, SUV, Luxury).

description

TEXT

Not Null

Mô tả về danh mục.

thumbnailUrl

TEXT

Nullable

Ảnh đại diện danh mục.

Lưu ý: Prisma sẽ tự động sinh ra một bảng trung gian (thường tên là _CarToCategory) để quản lý quan hệ nhiều-nhiều (Many-to-Many) giữa Car và Category.

4. Bảng SpecificationType (Loại thông số)
Định nghĩa tên các loại thông số kỹ thuật (Metadata). Giúp chuẩn hóa các thuộc tính kỹ thuật.

Khóa chính: id

Tên trường

Kiểu dữ liệu

Ràng buộc

Mô tả

id

TEXT / UUID

PK, Not Null

Định danh loại thông số.

label

TEXT

Not Null

Tên thông số (VD: Mã lực, Dung lượng pin, 0-100km/h).

icon

TEXT

Nullable

Đường dẫn icon hoặc mã icon hiển thị ở Client.

description

TEXT

Nullable

Giải thích ý nghĩa thông số.

5. Bảng CarSpecification (Giá trị thông số)
Lưu trữ giá trị thực tế của một thông số kỹ thuật gắn với một chiếc xe cụ thể.

Khóa chính: id

Quan hệ: N-1 với Car, N-1 với SpecificationType.

Tên trường

Kiểu dữ liệu

Ràng buộc

Mô tả

id

TEXT / UUID

PK, Not Null

Định danh bản ghi.

carId

TEXT / UUID

FK, Not Null

ID của xe sở hữu thông số này.

specificationTypeId

TEXT / UUID

FK, Not Null

ID của loại thông số (VD: ID của "Mã lực").

value

TEXT

Not Null

Giá trị thực tế (VD: "400 HP", "90 kWh").

Ràng buộc duy nhất (Unique Constraint): Cặp [carId, specificationTypeId] phải là duy nhất. Nghĩa là một chiếc xe không thể có 2 dòng thông số trùng loại (VD: Xe A không thể có 2 dòng "Mã lực").

6. Bảng CarImage (Thư viện ảnh)
Lưu trữ danh sách các hình ảnh chi tiết của xe (ngoài ảnh thumbnail).

Khóa chính: id

Quan hệ: N-1 với Car.

Tên trường

Kiểu dữ liệu

Ràng buộc

Mô tả

id

TEXT / UUID

PK, Not Null

Định danh hình ảnh.

carId

TEXT / UUID

FK, Not Null

ID của xe sở hữu ảnh.

url

TEXT

Not Null

Đường dẫn tới ảnh (CDN/Cloud storage).

sort

INTEGER

Nullable

Số thứ tự hiển thị trong Gallery (VD: 1, 2, 3).

7. Enum Types
CarStatus Dùng để định nghĩa trạng thái hoạt động của xe trong bảng Car.

available: Xe sẵn sàng để thuê.

rented: Xe đang được khách thuê (Logic tồn kho).

maintenance: Xe đang bảo trì/sửa chữa, không thể thuê.

4. Quy trình hoạt động & Thiết kế chi tiết
4.1 Use Case Diagram
Sơ đồ Use Case dưới đây mô tả sự tương tác giữa các tác nhân (Actors) bên ngoài (Người dùng, Admin) và các hệ thống nội bộ (Booking Service, Station Service) với các chức năng của Vehicle Service.

4.1.1 Các tác nhân trong hệ thống
Tác nhân (Actor)

Loại

Vai trò & Trách nhiệm

Renter (Người thuê)

User (Human)

Người dùng cuối sử dụng ứng dụng client. Họ có quyền Xem (Read-only) danh sách xe, tìm kiếm và xem chi tiết thông số xe.

Admin (Quản trị viên)

User (Human)

Nhân viên vận hành hệ thống. Có toàn quyền Ghi (Write) để thêm mới xe, cập nhật giá, quản lý ảnh, thông số kỹ thuật và quản lý danh mục (Hãng, Loại xe).

Booking Service

System (Internal)

Microservice quản lý đơn hàng. Tương tác với Vehicle Service qua API nội bộ để lấy thông tin xe (Tên, Giá cọc) khi tạo đơn và kiểm tra xe có khả dụng hay không.

Station Service

System (Internal)

Microservice quản lý trạm sạc/bãi xe. Gọi Vehicle Service để lấy danh sách chi tiết các xe đang thuộc về một trạm cụ thể để hiển thị lên bản đồ/danh sách trạm.

4.1.2. Các trường hợp sử dụng (Use Cases)
Dưới đây là mô tả chi tiết các Use Case chính của Vehicle Service:

ID

Tên Use Case

Tác nhân chính

Mô tả chi tiết

UC01

Tìm kiếm & Lọc xe

Renter

Người dùng tìm kiếm xe theo các tiêu chí kết hợp: Khoảng giá (min-max), Thương hiệu (Brand), Loại xe (Category). Hệ thống trả về danh sách xe thỏa mãn điều kiện.

UC02

Xem chi tiết xe

Renter, Admin

Xem toàn bộ thông tin chi tiết của một chiếc xe bao gồm: Giá, Thông số kỹ thuật (Pin, Mã lực...), Bộ sưu tập ảnh (Gallery) và Trạng thái tồn kho.

UC03

Quản lý (CRUD) Xe

Admin

Cho phép Admin tạo mới xe, cập nhật thông tin (giá, tên, mô tả), cập nhật trạng thái (Available/Maintenance) hoặc xóa (Soft delete) xe khỏi hệ thống.

UC04

Quản lý Master Data

Admin

Quản lý các dữ liệu nền tảng dùng chung:

Thêm/Sửa/Xóa Thương hiệu (Brand).

Thêm/Sửa/Xóa Danh mục (Category).

Định nghĩa các Loại thông số kỹ thuật (Spec Types).

UC05

Quản lý Ảnh & Thông số

Admin

Upload ảnh Thumbnail và danh sách ảnh chi tiết (Featured Images) cho xe.

Gán giá trị cho các thông số kỹ thuật động (VD: Gán "400HP" cho thông số "Mã lực" của xe A).

UC06

Lấy thông tin xe (Internal)

Booking Service, Station Service

API nội bộ cho phép các service khác lấy thông tin rút gọn hoặc chi tiết của xe thông qua vehicle_id để phục vụ logic nghiệp vụ riêng (VD: Booking cần lấy giá để tính tiền).

UC07

Kiểm tra tồn kho (Internal)

Booking Service

API kiểm tra xem xe có trạng thái hợp lệ để thuê không (Is In Stock? Status == Available?) trước khi Booking Service cho phép người dùng thanh toán.

 

4.2. Tổng quan luồng nghiệp vụ
Nội dung dưới đây mô tả chi tiết các luồng nghiệp vụ chính diễn ra trong Vehicle Service. Khác với Booking Service tập trung vào vòng đời giao dịch, Vehicle Service tập trung vào vòng đời dữ liệu (Data Lifecycle) của phương tiện và khả năng truy xuất thông tin (Data Retrieval).

Vehicle Service chịu trách nhiệm đảm bảo dữ liệu xe luôn chính xác, cập nhật và sẵn sàng để phục vụ cho Client App (người dùng tìm kiếm) và các Service nội bộ (Booking/Station).

Các luồng nghiệp vụ chính được chia thành 4 nhóm:

Luồng Tìm kiếm & Hiển thị (Public): Phục vụ người dùng cuối.

Luồng Quản trị phương tiện (Admin): Quy trình thêm mới và cấu hình xe.

Luồng Cập nhật trạng thái (Operation): Quản lý tình trạng xe (Bảo trì/Sẵn sàng).

Luồng Tương tác nội bộ (Internal): Phục vụ Booking và Station Service.

4.2.1. Luồng Tìm kiếm & Hiển thị xe (User Search Flow)
Đây là luồng có lưu lượng truy cập cao nhất, cho phép người dùng lọc và tìm kiếm xe phù hợp với nhu cầu.

Quy trình tổng quát:

Người dùng chọn các tiêu chí lọc trên Client App (Hãng xe, Loại xe, Khoảng giá, Sắp xếp).

Client App gửi request GET qua API Gateway.

Vehicle Service nhận tham số, chuẩn hóa dữ liệu (parse query params).

Hệ thống xây dựng câu truy vấn động (Dynamic Query) xuống Database thông qua Prisma.

Hệ thống trả về danh sách xe rút gọn (bao gồm ảnh thumbnail, tên, giá hiển thị) để tối ưu tốc độ.

Logic xử lý giá (Price Logic):

Hệ thống tự động so sánh sale_price và regular_price.

Nếu có sale_price hợp lệ, ưu tiên hiển thị và lọc theo giá này.

Điểm tương tác: Client App -> API Gateway -> Vehicle Service -> Database.

4.2.2. Luồng Quản trị & Khởi tạo xe (Admin Creation Flow)
Do cấu trúc dữ liệu xe được chuẩn hóa cao (liên kết nhiều bảng), quy trình tạo xe của Admin không chỉ là một bước đơn giản mà là một chuỗi các thao tác tuần tự.

Quy trình tổng quát:

Chuẩn bị Master Data: Admin kiểm tra xem Thương hiệu (Brand) và Danh mục (Category) đã có chưa. Nếu chưa, phải tạo trước.

Tạo hồ sơ xe (Base Info): Admin nhập thông tin cơ bản (Tên, SKU, Giá, Số lượng) -> Hệ thống tạo bản ghi trong bảng Car.

Upload thư viện ảnh (Gallery): Admin upload danh sách ảnh chi tiết -> Hệ thống lưu vào bảng CarImage và liên kết với Car.

Cấu hình thông số (Specifications): Admin chọn các loại thông số (Mã lực, Pin...) và nhập giá trị -> Hệ thống lưu vào bảng CarSpecification.

Ràng buộc nghiệp vụ:

Một xe bắt buộc phải thuộc về 1 Brand.

SKU và Slug phải là duy nhất trên toàn hệ thống.

4.2.3. Luồng Cập nhật trạng thái & Tồn kho (Inventory & Status Flow)
Quản lý tính khả dụng của xe để đảm bảo không cho thuê xe đang bị hỏng hoặc bảo trì.

Quy trình tổng quát:

Chuyển trạng thái bảo trì: Khi xe gặp sự cố, Admin/Staff cập nhật trạng thái xe sang maintenance.

Đồng bộ: Ngay lập tức, xe này sẽ bị ẩn khỏi kết quả tìm kiếm của người dùng (hoặc hiện thỉ "Tạm hết hàng").

Cập nhật số lượng: Khi nhập thêm xe mới về kho, Admin cập nhật trường quantity.

Ràng buộc:

Nếu status = maintenance hoặc quantity = 0, trường is_in_stock sẽ tự động được set về false.

4.2.4. Luồng Xác thực nội bộ (Internal Validation Flow)
Phục vụ Booking Service trong quá trình tạo đơn hàng để đảm bảo tính toàn vẹn dữ liệu.

Quy trình tổng quát:

Booking Service nhận request đặt xe với vehicle_id.

Booking Service gọi API nội bộ sang Vehicle Service.

Vehicle Service kiểm tra:

ID có tồn tại không?

Trạng thái có phải available không?

is_in_stock có phải true không?

Vehicle Service trả về thông tin chi tiết (bao gồm Giá cọc hiện tại) để Booking Service chốt đơn.

4.3. Sơ đồ hoạt động (Activity Diagram)
4.3.1. Sơ đồ luồng Tìm kiếm & Đặt xe (User Perspective)
Sơ đồ dưới đây mô tả cách dữ liệu từ Vehicle Service phục vụ luồng đặt xe của người dùng.

4.3.2. Sơ đồ luồng Quản trị phương tiện (Admin Management Flow)
Quy trình dành cho Admin để thiết lập dữ liệu xe mới. Do cấu trúc dữ liệu xe bao gồm nhiều thành phần (Thông tin chung, Ảnh, Thông số), quy trình này thường diễn ra theo từng bước.

Tác nhân: Admin Dashboard.

Quy trình chi tiết:

Kiểm tra Master Data: Admin đảm bảo Thương hiệu (Brand) và Danh mục (Category) đã tồn tại. Nếu chưa, phải tạo mới tại các màn hình quản lý tương ứng.

Tạo hồ sơ xe (Base Info):

Admin nhập: Tên xe, SKU, Giá gốc, Giá cọc, Số lượng tổng.

Hệ thống: Tạo bản ghi Car, sinh id (UUID) và slug (URL friendly).

Upload Media:

Admin upload ảnh Thumbnail (bắt buộc).

Admin upload bộ sưu tập ảnh chi tiết (Featured Images).

Hệ thống: Lưu ảnh, tạo bản ghi CarImage liên kết với Car.

Cấu hình thông số (Specifications):

Hệ thống hiển thị danh sách các loại thông số có sẵn (Spec Types).

Admin nhập giá trị cho từng loại (VD: Loại "Pin" -> Giá trị "90kWh").

Hệ thống: Lưu vào bảng CarSpecification.

4.3.3. Sơ đồ luồng Cập nhật trạng thái (Operation Flow)
Quy trình vận hành hàng ngày để quản lý "sức khỏe" của đội xe. Luồng này quyết định xe có được phép hiển thị cho khách thuê hay không.

Tác nhân: Admin, Staff (Nhân viên vận hành).

Các trạng thái chính:

Available: Xe hoạt động bình thường.

Maintenance: Xe đang bảo trì/sửa chữa.

Rented: Xe đang được khách thuê (được cập nhật tự động hoặc thủ công).

Quy trình Bảo trì:

Nhân viên phát hiện xe hỏng hoặc đến hạn bảo dưỡng.

Gọi API PATCH /vehicles/:id cập nhật status = 'maintenance'.

Hệ quả: Xe lập tức bị ẩn khỏi Luồng Tìm kiếm (Public Flow). Nếu có đơn đặt xe trong tương lai liên quan đến xe này (ở Booking Service), nhân viên cần xử lý thủ công (đổi xe/hủy đơn).

Quy trình Kích hoạt lại:

Xe sửa xong -> Cập nhật status = 'available'.

Xe xuất hiện lại trên ứng dụng Client.

4.3.4. Sơ đồ luồng Tương tác nội bộ (Internal Interaction Flow)
Đây là các API không công khai (Private APIs), chỉ dành cho các Service khác trong hệ sinh thái gọi tới.

Tác nhân: Booking Service, Station Service.

Kịch bản A: Xác thực khi tạo đơn (Booking Creation Validation)

Người dùng nhấn "Đặt ngay" cho xe ID 123.

Booking Service gọi GET /internal/vehicles/123.

Vehicle Service kiểm tra logic:

Xe có tồn tại không?

is_in_stock có phải true không?

status có phải available không?

Nếu hợp lệ: Trả về thông tin giá (deposit_price, regular_price) để Booking Service tính toán hóa đơn.

Nếu không hợp lệ: Trả về lỗi 409 Conflict hoặc 404 Not Found.

Kịch bản B: Giữ chỗ & Trừ kho (Inventory Reservation)

Sau khi người dùng thanh toán thành công.

Booking Service gọi PATCH /internal/vehicles/123/reserve.

Vehicle Service thực hiện Transaction DB:

Giảm quantity đi 1.

Nếu quantity về 0 -> Cập nhật is_in_stock = false.

Hệ quả: Người dùng khác không thể đặt chiếc xe cuối cùng này nữa.

5. API & Endpoints Overview
5.1 Danh sách các API
Hệ thống cung cấp các RESTful API được định version (ví dụ: /api/v1) và trả về dữ liệu định dạng JSON tiêu chuẩn.

5.1.1. Public APIs (Dành cho Client App / End-User)
Đi qua API Gateway.

Không yêu cầu xác thực người dùng (Anonymous) cho các API GET

Nhóm API này phục vụ việc hiển thị, tìm kiếm và xem chi tiết xe. Các API này thường được cache để tối ưu hiệu năng.

Method

Endpoint

Mô tả

Query Params / Body

GET

/api/v1/vehicles

Lấy danh sách xe, hỗ trợ phân trang và lọc nâng cao.

page, limit, brands[], categories[], minPrice, maxPrice, sort

GET

/api/v1/vehicles/:id

Xem chi tiết một xe theo ID. Bao gồm thông tin Hãng, Loại, Ảnh, Thông số.

-

GET

/api/v1/vehicles/slug/:slug

Xem chi tiết xe theo Slug (URL thân thiện cho SEO).

-

GET

/api/v1/brands

Lấy danh sách Thương hiệu (để hiển thị Filter Bar).

-

GET

/api/v1/categories

Lấy danh sách Danh mục (để hiển thị Filter Bar).

-

5.1.2. Admin APIs (Dành cho CMS / Dashboard)
Yêu cầu JWT Token (Bearer Auth) trong Header.

Vehicle Service (hoặc Gateway) sẽ validate token này với Auth Service để đảm bảo user có role là ADMIN hoặc STAFF.

Nhóm API này yêu cầu xác thực quyền Admin (Authorization Header) để quản lý dữ liệu.

a. Quản lý Xe (Vehicle Core)

Method

Endpoint

Mô tả

Request Body (Payload)

POST

/api/v1/vehicles

Tạo mới một xe (Base Info).

{ displayName, sku, regularPrice, depositPrice, brandId, categoryIds[], quantity, ... }

PUT

/api/v1/vehicles/:id

Cập nhật thông tin xe.

(Các trường cần sửa)

PATCH

/api/v1/vehicles/:id/status

Cập nhật nhanh trạng thái (Maintenance/Available).

{ status: "maintenance" }

DELETE

/api/v1/vehicles/:id

Xóa mềm (Soft delete) hoặc ẩn xe.

-

b. Quản lý Thành phần phụ (Components)

Method

Endpoint

Mô tả

Request Body

POST

/api/v1/vehicles/:id/images

Upload ảnh cho xe.

FormData { file, sort }

DELETE

/api/v1/vehicles/:id/images/:imgId

Xóa một ảnh của xe.

-

POST

/api/v1/vehicles/:id/specs

Thêm/Sửa thông số kỹ thuật cho xe.

{ specificationTypeId, value }

c. Quản lý Master Data (Dữ liệu nền tảng)

Method

Endpoint

Mô tả

POST

/api/v1/brands

Tạo thương hiệu mới.

POST

/api/v1/categories

Tạo danh mục mới.

POST

/api/v1/specification-types

Định nghĩa loại thông số mới (VD: "Dung lượng Pin").

5.2. Ví dụ Payload chi tiết
5.2.1. Response: Chi tiết xe (GET /vehicles/:slug)
Đây là cấu trúc JSON trả về cho Client App để hiển thị trang chi tiết.

5.2.2. Request: Tạo xe mới (POST /vehicles)
Dành cho Admin.

6. Cấu hình & Triển khai (Configuration & Deployment)
6.1. Biến môi trường (Environment Variables)
Hệ thống yêu cầu file .env với các tham số cấu hình sau:

Biến

Mặc định

Mô tả

PORT

8099

Cổng chạy service.

NODE_ENV

development

Môi trường (development, production).

VEHICLE_DATABASE_URL

-

Chuỗi kết nối PostgreSQL (riêng cho Vehicle DB).

6.2. Quy trình Docker hóa (Dockerization)
File Dockerfile được tối ưu hóa cho môi trường Production (Multi-stage build):

Stage 1 (Builder): Cài đặt dependencies, generate Prisma Client, biên dịch TypeScript sang JavaScript.

Stage 2 (Runner): Sử dụng image node:alpine nhẹ, chỉ copy thư mục dist và node_modules cần thiết.

Lệnh khởi chạy:



Bash


# 1. Khởi tạo Database Migration
npx prisma migrate deploy
# 2. Chạy Seed data (Master data: Brands, Categories)
npm run seed
# 3. Start Service
npm start