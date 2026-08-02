# Travel Planner 🇻🇳

Website lập kế hoạch du lịch và lưu nhật ký du lịch dành cho người Việt.
**Đây không phải website đặt tour** — đây là công cụ giúp bạn lên kế hoạch, ghi lại và lưu giữ kỷ niệm của mỗi chuyến đi.

> 🚧 **Trạng thái hiện tại: Giai đoạn 1/9 — Khởi tạo dự án & kiến trúc** đã hoàn tất.
> Các giai đoạn tiếp theo (Database, Backend API, Frontend giao diện, Kết nối, Chức năng nâng cao, Kiểm thử, Tối ưu, Hoàn thiện) sẽ được bổ sung liên tục.

## Công nghệ sử dụng

**Frontend:** ReactJS, Vite, TailwindCSS, React Router, React Query, Axios, Zustand, React Hook Form, Zod, Framer Motion, shadcn/ui, Chart.js, Lucide React, Google Maps, PWA

**Backend:** NodeJS, ExpressJS, Prisma ORM, MySQL, JWT + Refresh Token, Multer, bcrypt, Helmet, Rate Limit

## Cấu trúc thư mục

```
travel-planner/
├── frontend/          # Ứng dụng React (Vite)
│   └── src/
│       ├── components/    # Component dùng chung (ui, common, layout, skeletons)
│       ├── pages/          # Các trang (route-level)
│       ├── layouts/        # Layout khung (MobileLayout, DesktopLayout...)
│       ├── features/       # Logic theo tính năng (trips, journals, places...)
│       ├── hooks/          # Custom hooks
│       ├── services/       # Gọi API (axios instances theo module)
│       ├── store/          # Zustand store (auth, theme, ui...)
│       ├── types/          # Định nghĩa kiểu dữ liệu / JSDoc types
│       ├── utils/          # Hàm tiện ích
│       └── assets/         # Ảnh, icon tĩnh
│
└── backend/           # API Node.js (Express)
    └── src/
        ├── controllers/    # Xử lý request/response
        ├── services/       # Business logic
        ├── middlewares/     # Auth, validate, error handler...
        ├── routes/          # Định nghĩa endpoint
        ├── validators/      # Schema Zod validate input
        ├── config/          # env, prisma client
        ├── utils/           # Hàm tiện ích chung
        ├── helpers/         # Helper nghiệp vụ
        └── uploads/         # Ảnh người dùng tải lên
    └── prisma/
        ├── schema.prisma    # Định nghĩa database
        └── seed.js          # Dữ liệu mẫu Việt Nam
```

## Cài đặt & chạy thử (Giai đoạn 1)

### Yêu cầu hệ thống
- Node.js >= 18
- MySQL >= 8.0
- npm >= 9

### 1. Clone / giải nén dự án

```bash
cd travel-planner
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
cp .env.example .env
# Mở file .env và điền DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET thật của bạn
```

Tạo database MySQL:

```sql
CREATE DATABASE travel_planner CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Chạy migration Prisma (giai đoạn 1 mới có bảng `users` tối thiểu, schema đầy đủ sẽ có ở Giai đoạn 2):

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
```

Chạy server:

```bash
npm run dev
```

Kiểm tra: mở `http://localhost:4000/api/health` → trả về JSON xác nhận API đang chạy.

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Điền VITE_GOOGLE_MAPS_API_KEY nếu có (chưa dùng ở giai đoạn 1)
npm run dev
```

Mở `http://localhost:5173` → sẽ thấy màn hình xác nhận Giai đoạn 1 hoạt động (đổi được Dark Mode).

### 4. Build production (frontend)

```bash
npm run build
npm run preview
```

## Lộ trình các giai đoạn

- [x] **Giai đoạn 1** — Khởi tạo dự án & kiến trúc
- [ ] **Giai đoạn 2** — Thiết kế cơ sở dữ liệu (toàn bộ bảng + dữ liệu mẫu VN)
- [ ] **Giai đoạn 3** — Backend API đầy đủ
- [ ] **Giai đoạn 4** — Frontend giao diện đầy đủ
- [ ] **Giai đoạn 5** — Kết nối Frontend ↔ Backend
- [ ] **Giai đoạn 6** — Chức năng nâng cao (drag & drop, bản đồ, biểu đồ...)
- [ ] **Giai đoạn 7** — Kiểm thử
- [ ] **Giai đoạn 8** — Tối ưu hiệu năng
- [ ] **Giai đoạn 9** — Hoàn thiện sản phẩm (admin, README đầy đủ, deploy)

## Deploy (sẽ hoàn thiện ở Giai đoạn 9)

Hướng dẫn deploy chi tiết (VPS + Nginx + PM2 hoặc Docker) sẽ được bổ sung khi backend & frontend hoàn chỉnh.
