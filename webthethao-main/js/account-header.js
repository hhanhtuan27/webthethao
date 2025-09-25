document.addEventListener("DOMContentLoaded", function() {
  const accountSign = document.querySelector(".account-sign");
  const username = sessionStorage.getItem("userUsername"); // KHÓA CHÍNH
  // Hiển thị
  if (accountSign) {
    if (username) {
      accountSign.innerHTML = `
        <a href="customer-information.html" class="account-header">
          <i class="fa fa-user" aria-hidden="true"></i>
          <div class="a-text">
            ${username}
            <span>Tài khoản và đơn hàng</span>
          </div>
          <div class="Sub-1">
            <ul class="Sub-menu">
              <li><a href="customer-information.html">Quản lý tài khoản</a></li>
              <li><a href="#" id="logoutBtn">Đăng xuất</a></li>
            </ul>
          </div>
        </a>`;
      document.getElementById("logoutBtn")?.addEventListener("click", e=>{
        e.preventDefault();
        sessionStorage.clear();
        alert("Đã đăng xuất.");
        location.reload();
      });
    } else {
      accountSign.innerHTML = `
        <a href="login.html" class="account-header">
          <i class="fa fa-user" aria-hidden="true"></i>
          <div class="a-text">
            Đăng nhập
            <span>Tài khoản và đơn hàng</span>
          </div>
          <div class="Sub-1">
            <ul class="Sub-menu">
              <li><a href="login.html">Đăng nhập</a></li>
              <li><a href="register.html">Đăng ký</a></li>
            </ul>
          </div>
        </a>`;
    }
  }

  // Chặn vào giỏ khi chưa đăng nhập
  document.querySelectorAll(".header-cart").forEach(el=>{
    el.addEventListener("click", e=>{
      if(!sessionStorage.getItem("userUsername")){
        e.preventDefault();
        alert("Vui lòng đăng nhập để xem giỏ hàng.");
        location.href="login.html";
      }
    });
  });

  // Mobile side menu “Xin chào”
  const helloUser = document.querySelector(".la-hello-user-nav");
  const actionLinks = document.querySelector(".la-action-link-nav");
  if (helloUser && actionLinks) {
    if (username){
      helloUser.textContent = "Xin chào, " + username;
      actionLinks.style.display = "none";
    } else {
      helloUser.textContent = "Xin chào";
      actionLinks.style.display = "block";
    }
  }

  // Không cần filepath nếu bạn tự chèn
  document.getElementById("loginBtn").addEventListener("click", function(){
    const u = document.getElementById("loginUsername").value.trim();
    const p = document.getElementById("loginPassword").value;
    if(u === sessionStorage.getItem("userUsername") &&
       p === sessionStorage.getItem("userPassword")){
      alert("Đăng nhập thành công");
      window.location.href="index.html";
    } else {
      alert("Tên người dùng hoặc mật khẩu sai");
    }
  });
});