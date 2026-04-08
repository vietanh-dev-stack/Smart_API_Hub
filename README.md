# Smart Hub JSON Server

**Smart Hub JSON Server** là một hệ thống backend tùy chỉnh mạnh mẽ được xây dựng bằng **Node.js**, **Express** và **PostgreSQL**.

Dự án cung cấp khả năng **Dynamic API** tương tự `json-server`, nhưng được nâng cấp để dùng trong môi trường thực tế với:

* Database quan hệ (PostgreSQL)
* Authentication & Authorization
* Query nâng cao (filter, search, pagination)
* Auto-migration từ `schema.json`

---

## Mục lục

1. Công nghệ sử dụng
2. Cấu trúc Project
3. Cài đặt & Khởi chạy
4. Database & Migration
5. Hệ thống API
6. Query Params nâng cao
7. Bảo mật & Phân quyền
8. Kiểm thử

---

## 🛠 Công nghệ sử dụng

* **Backend:** Node.js, TypeScript, Express.js
* **Database:** PostgreSQL
* **Query Builder:** Knex.js
* **Validation:** Zod
* **Authentication:** JWT
* **Password Hashing:** bcrypt
* **DevOps:** Docker & Docker Compose
* **Testing:** Vitest + Supertest

---

## Cấu trúc Project

```
SMART_API_HUB/
├─ src/
│  ├─ config/
│  ├─ controllers/
│  ├─ db/
│  ├─ middlewares/
│  ├─ routes/
│  ├─ tests/
│  ├─ types/
│  ├─ utils/
│  ├─ validators/
│  ├─ app.ts
│  └─ index.ts
├─ .env
├─ .env.example
├─ docker-compose.yaml
├─ Dockerfile
├─ nodemon.json
├─ package.json
├─ README.md
├─ schema.json
└─ tsconfig.json
```

---

## Cài đặt & Khởi chạy

### 1. Tạo file `.env`

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_hub
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_key
```

---

### 2. Chạy PostgreSQL bằng Docker

```
docker-compose up -d
```

---

### 3. Cài đặt & chạy server

```
npm install
npm run dev
```

Server chạy tại:

```
http://localhost:3000
```

---

## Database & Migration

Hệ thống sử dụng **Auto-Migration**:

* Đọc từ `schema.json`
* Tự động tạo bảng nếu chưa tồn tại
* Tự động thêm:

  * `created_at`
  * `updated_at`
* Tự động thiết lập quan hệ (FK)

---

## Hệ thống API

### Authentication

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| POST   | /auth/register | Đăng ký tài khoản  |
| POST   | /auth/login    | Đăng nhập, trả JWT |

---

### Dynamic CRUD

| Method | Endpoint       | Auth | Role  | Description    |
| ------ | -------------- | ---- | ----- | -------------- |
| GET    | /:resource     | ❌    | Any   | Lấy danh sách  |
| GET    | /:resource/:id | ❌    | Any   | Lấy chi tiết   |
| POST   | /:resource     | ✅    | Any   | Tạo mới        |
| PUT    | /:resource/:id | ✅    | Any   | Update toàn bộ |
| PATCH  | /:resource/:id | ✅    | Any   | Update 1 phần  |
| DELETE | /:resource/:id | ✅    | Admin | Xóa            |

---

## 🔍 Query Params nâng cao

| Tính năng  | Ví dụ                   |
| ---------- | ----------------------- |
| Fields     | `?_fields=name,price`   |
| Pagination | `?_page=1&_limit=10`    |
| Sorting    | `?_sort=id&_order=desc` |
| Filtering  | `_gte[price]=1000`      |
| Search     | `?q=iphone`             |
| Expand     | `?_expand=category`     |
| Embed      | `?_embed=products`      |

---

## Bảo mật & Phân quyền

* Sử dụng JWT:

```
Authorization: Bearer <token>
```

* Quy tắc:

  * POST / PUT / PATCH → cần login
  * DELETE → chỉ admin

---

## Kiểm thử

Chạy test:

```
npm run test
```

* Sử dụng:

  * Vitest
  * Supertest

* Cover:

  * ✅ Happy path
  * ❌ 400 / 401 / 403 / 404

---

## Tổng kết

Dự án này giúp:

* Hiểu cách build **Dynamic REST API**
* Làm chủ **Node.js + TypeScript + PostgreSQL**
* Áp dụng **Auth + Validation + Testing + Docker**
* Sẵn sàng cho project thực tế 🚀

---
