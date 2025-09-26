# 🏆 Web Bán Đồ Thể Thao

> Nền tảng bán & giới thiệu trang phục, dụng cụ thể thao.

<p align="center">
  <img src="docs/screenshot-home.png" alt="Trang chủ (placeholder)" width="600" />
</p>

---

### 🔧 Tech Stack
| HTML5 | CSS3 (Responsive) | JavaScript | jQuery | Bootstrap 4 |
|-------|-------------------|------------|--------|-------------|

### ✨ Tính Năng Chính
- 📦 Danh mục sản phẩm (Trang phục, Dụng cụ, Phụ kiện…)
- 🔍 Lọc theo thương hiệu / loại / giá / query (giày, trangphucthethao, dungcuthethao…)
- 🏷️ Gắn nhãn giảm giá / mới
- 🛒 Thêm nhanh vào giỏ (quick add)
- ❤️ Yêu thích (wishlist giả lập)
- 👤 Phiên đăng nhập đơn giản (sessionStorage)
- 📱 Giao diện đáp ứng (mobile friendly)
- 🗂️ Phân trang tham số ?page=
- ⚡ Tối ưu lọc bằng data-* attributes

### 🚀 Khởi Chạy Nhanh
```bash
# Clone
git clone <repo-url>
cd webthethao-main

# Mở VS Code
code .

# Dùng Live Server (hoặc)
start "" product.html


webthethao-main/
 ├─ product.html
 ├─ product-detail.html
 ├─ css/
 ├─ js/
 ├─ img/
 └─ docs/ (thêm ảnh screenshot tại đây)


 🧪 Ghi Chú Kỹ Thuật
Lọc dựa trên: data-brand, data-type, data-key, data-price, data-equip
Mapping query → nhóm data-equip (giày=1, trangphucthethao=2, dungcuthethao=3)
Có thể mở rộng thêm bằng cách bổ sung vào equipMap trong script.
👥 Thành Viên Nhóm 04
MSSV	Họ Tên	Vai Trò
3123411323	Hồ Hữu Anh Tuấn	Dev
3123411283	Lê Minh Thịnh	Dev
3123411285	Ngũ Vĩnh Thịnh	Dev
3123411342	Nguyễn Thành Vinh	Dev
3123411290	Nguyễn Minh Thuận	Dev
📌 Định Hướng Mở Rộng
Tích hợp API giỏ hàng thật
Thêm đăng ký / đăng nhập JWT
Tìm kiếm toàn cục không dấu
Lazy load hình ảnh
🛡️ Bản Quyền
Dự án học tập – chỉ dùng cho mục đích giáo dục.