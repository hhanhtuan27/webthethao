document.addEventListener('DOMContentLoaded', function () {
  // Tìm heading có nội dung "Đơn hàng gần nhất"
  const heading = Array.from(document.querySelectorAll('h1,h2,h3,h4'))
    .find(h => /đơn hàng gần nhất/i.test(h.textContent.trim()));
  if (!heading) return;

  // Xác định bảng sau heading
  let tbl = heading.nextElementSibling;
  if (tbl && tbl.tagName !== 'TABLE') {
    // Nếu không phải table trực tiếp, thử tìm table bên trong
    const inner = tbl.querySelector('table');
    if (inner) tbl = inner;
  }

  // Nếu cả heading và table nằm chung 1 wrapper riêng, xóa wrapper
  const wrapper = heading.parentElement;
  if (wrapper && tbl && wrapper.contains(tbl)) {
    // Heuristic: wrapper chỉ chứa <= 3 phần tử liên quan
    if (wrapper.querySelectorAll('table').length === 1 &&
        wrapper.querySelectorAll('h1,h2,h3,h4').length === 1) {
      wrapper.remove();
      return;
    }
  }

  // Xóa riêng lẻ
  if (tbl && tbl.tagName === 'TABLE') tbl.remove();
  heading.remove();
});