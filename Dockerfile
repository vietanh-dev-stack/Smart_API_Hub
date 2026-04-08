# Stage 1: Builder - Dành cho việc cài đặt và biên dịch mã nguồn
FROM node:20-alpine AS builder
 
# 1. Thiết lập thư mục làm việc trong container
WORKDIR /app
 
# 2. Copy các file cấu hình package
COPY package*.json ./
COPY tsconfig.json ./
 
# 3. Cài đặt toàn bộ thư viện
RUN npm i
 
 
COPY . .
 
# NOTE: Thực tế dự án sẽ không run ở đây
# # run server here
# CMD ["npm", "run", "dev"]
 
# Bước 1: Tạo dockerfile tương ứng
# Bước 2: Build image
# docker build
 
# 5. Compile TypeScript sang JavaScript (thư mục dist)
RUN npm run build
 
# CMD ["node", "dist/index.js"]
 
# BUILD
# docker run --env-file .env -p 3000:3000 node-dymamic-api:v3 -d
 
 
# Stage 2: Production - Môi trường chạy thực tế siêu nhẹ
FROM node:20-alpine AS production
 
WORKDIR /app
 
# 1. Định nghĩa môi trường
ENV NODE_ENV=production
 
# 2. Copy package.json sang để cài thư viện
COPY package*.json ./
 
# 3. Chỉ cài đặt các thư viện phục vụ cho Production (bỏ qua devDependencies)
# Chú ý: Từ npm v8, param --only=production có thể dùng --omit=dev
RUN npm i --omit=dev
 
# 4. Chỉ Copy thư mục đã build (dist) từ Stage 1 sang Stage 2
COPY --from=builder /app/dist ./dist
COPY db.json .
 
# Bảo mật: Dùng user "node" có sẵn thay vì "root" (quyền cao nhất) để chạy app
USER node
 
# 5. Expose port (Thông báo port ứng dụng sẽ lắng nghe)
EXPOSE 3000
 
# 6. Khởi chạy ứng dụng bằng Node.js tiêu chuẩn
CMD ["node", "dist/index.js"]