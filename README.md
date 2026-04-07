# Smart Hub JSON Server

**Smart Hub JSON Server** là một hệ thống backend tùy chỉnh mạnh mẽ được xây dựng bằng **Node.js**, **Express** và **PostgreSQL**. Dự án này cung cấp khả năng **Dynamic API** tương tự như JSON Server truyền thống nhưng được tối ưu hóa cho môi trường thực tế với cơ sở dữ liệu quan hệ, hỗ trợ phân quyền và truy vấn nâng cao.

---

## Mục lục
1. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
2. [Cấu trúc Project](#-cấu-trúc-project)
3. [Cài đặt & Khởi chạy](#-cài-đặt--khởi-chạy)
4. [Database & Migration](#-database--migration)
5. [Hệ thống API](#-hệ-thống-api)
6. [Query Params nâng cao](#-query-params-nâng-cao)
7. [Bảo mật & Phân quyền](#-bảo-mật--phân-quyền)
8. [Kiểm thử (Testing)](#-kiểm-thử-testing)

---

## 🛠 Công nghệ sử dụng
- **Backend:** Node.js, TypeScript, Express.js
- **Database:** PostgreSQL
- **Query Builder:** Knex.js (Quản lý Migration & Query)
- **Validation:** Zod (Schema validation)
- **Security:** JWT (Authentication), bcrypt (Password hashing)
- **DevOps:** Docker & Docker Compose
- **Testing:** Vitest & Supertest

---

## 📂 Cấu trúc Project
---
SMART_API_HUB/
├─ src/
│  ├─ config/           # Cấu hình môi trường & hệ thống
│  ├─ controllers/      # Xử lý logic cho Auth và Resource
│  ├─ db/               # Kết nối Knex & Logic Auto-Migration
│  ├─ middlewares/      # Auth, Error handling, Table Validation
│  ├─ routes/           # Định nghĩa các tuyến đường API
│  ├─ tests/            # Bộ mã nguồn kiểm thử (Integration tests)
│  ├─ types/            # Định nghĩa các TypeScript Interfaces/Types
│  ├─ utils/            # Các hàm tiện ích dùng chung
│  ├─ validators/       # Schema validation (Zod)
│  ├─ app.ts            # Cấu hình Express app
│  └─ index.ts          # Entry point của hệ thống
├─ .env                 # Biến môi trường (Local)
├─ .env.example         # File mẫu cấu hình môi trường
├─ .gitattributes       # Cấu hình thuộc tính Git
├─ .gitignore           # Các file/thư mục bỏ qua khi push Git
├─ docker-compose.yaml  # Container hóa PostgreSQL & App
├─ Dockerfile           # File cấu hình build image Docker
├─ nodemon.json         # Cấu hình tự động restart server
├─ package.json         # Quản lý dependencies và scripts
├─ README.md            # Tài liệu hướng dẫn dự án
├─ schema.json          # Định nghĩa cấu trúc bảng Dynamic
└─ tsconfig.json        # Cấu hình trình biên dịch TypeScript

---

## Cài đặt & Khởi chạy
---
1. Cấu hình biến môi trường
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_hub
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_key

2. Triển khai với Docker
Khởi chạy container PostgreSQL:
docker-compose up -d

3. Cài đặt và Chạy Server
- Cài đặt dependencies
npm install

- Chạy ở chế độ phát triển
npm run dev

---

## Database & Migration
---
Hệ thống sử dụng cơ chế Auto-Migration giúp đơn giản hóa việc quản lý DB:
Tự động tạo bảng từ định nghĩa trong schema.json.
Tự động thêm các cột created_at và updated_at.
Thiết lập quan hệ khóa ngoại (FK) mặc định giữa users, categories, và products.

---

## Hệ thống API
---
Authentication
Method	Path	Description
POST	/auth/register	Đăng ký tài khoản (mặc định role: client)
POST	/auth/login	Đăng nhập và nhận JWT Token

Dynamic CRUD
Method	Path	        Auth	  Role      Description
GET	    /:resource	     ❌	     Any    Lấy toàn bộ danh sách
GET	    /:resource/:id	 ❌	     Any    Lấy chi tiết một bản ghi
POST	/:resource	     ✅	     Any	Tạo bản ghi mới
PUT	    /:resource/:id	 ✅	     Any	Cập nhật toàn bộ bản ghi
PATCH	/:resource/:id	 ✅	     Any	Cập nhật một phần bản ghi
DELETE	/:resource/:id	 ✅	     Admin  Xóa bản ghi

---

## Query Params nâng cao
---
Hệ thống hỗ trợ các tham số truy vấn linh hoạt:
Chọn trường: _fields=name,price
Phân trang: _page=1&_limit=10
Sắp xếp: _sort=id&_order=desc
Quan hệ: _embed=products hoặc _expand=categories
Bộ lọc: _like[name]=Lap, _gte[price]=1000, _ne[stock]=0

---

## Bảo mật & Phân quyền
---
Xác thực: Sử dụng Header Authorization: Bearer <token>.
Phân quyền: - Các route thay đổi dữ liệu (POST, PUT, PATCH) yêu cầu người dùng đã đăng nhập.
Hành động DELETE chỉ dành riêng cho tài khoản có quyền admin.

---

## Kiểm thử (Testing)
---
Dự án sử dụng Vitest và Supertest đặt trong thư mục src/tests.
npm run test