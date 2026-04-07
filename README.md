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