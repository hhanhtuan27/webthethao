// Shared cart management script
// Initializes cart count (sessionStorage) and provides addToCart function
(function() {
  const LOGGED_IN_KEY = 'isLoggedIn';
  const COUNT_KEY = 'cartCount';

  function getCount() {
    const raw = sessionStorage.getItem(COUNT_KEY);
    const n = parseInt(raw, 10);
    return isNaN(n) ? 0 : n;
  }

  function setCount(n) {
    sessionStorage.setItem(COUNT_KEY, String(n));
    renderBadges();
  }

  function renderBadges() {
    var badges = document.getElementsByClassName('cartCount');
    var loggedIn = sessionStorage.getItem(LOGGED_IN_KEY) === 'true';
    var count = getCount();
    for (var i = 0; i < badges.length; i++) {
      if (!loggedIn) {
        badges[i].style.display = 'none';
      } else {
        badges[i].textContent = count;
        badges[i].style.display = 'inline-block';
      }
    }
  }

  // Public add function
  window.addToCartCount = function(delta) {
    if (sessionStorage.getItem(LOGGED_IN_KEY) !== 'true') {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      window.location.href = 'login.html';
      return;
    }
    const next = getCount() + (delta || 1);
    setCount(next);
  };

  // Ensure count exists when logged in
  if (sessionStorage.getItem(LOGGED_IN_KEY) === 'true' && sessionStorage.getItem(COUNT_KEY) == null) {
    setCount(0);
  }

  // Initial render after DOM ready (simple timeout fallback)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBadges);
  } else {
    renderBadges();
  }

})();

// Cart management script

(function () {
  const CART_KEY = 'cartItems';

  function loadCart() {
    try {
      return JSON.parse(sessionStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function formatCurrency(vnNumber) {
    return vnNumber.toLocaleString('vi-VN') + '₫';
  }

  function parsePrice(str) {
    if (!str) return 0;
    return parseInt(
      str.replace(/[^\d]/g, ''), // bỏ ký tự không phải số
      10
    ) || 0;
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }

  function updateBadge() {
    const cart = loadCart();
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    sessionStorage.setItem('cartCount', totalQty);

    document.querySelectorAll('.cartCount').forEach(badge => {
      if (totalQty > 0) {
        badge.textContent = totalQty;
        badge.style.display = 'inline-block';
      } else {
        badge.textContent = '0';
        badge.style.display = 'inline-block'; // hoặc 'none' nếu muốn ẩn khi 0
      }
    });
  }

  function extractProductData(productGridEl) {
    if (!productGridEl) return null;
    const titleEl = productGridEl.querySelector('.product-content .title a');
    const priceEl = productGridEl.querySelector('.product-content .tt-price .new-price');
    const imgEl = productGridEl.querySelector('.product-image img.pic-1') ||
                  productGridEl.querySelector('.product-image img');

    const title = titleEl ? titleEl.textContent.trim() : 'Sản phẩm';
    const priceNumber = parsePrice(priceEl ? priceEl.textContent : '0');
    const image = imgEl ? imgEl.getAttribute('src') : '';

    const idBase = slugify(title);
    let id = idBase;
    // Ensure unique id if multiple identical titles added separately (not strictly needed if we just aggregate)
    // Here we aggregate by id anyway.
    return {
      id,
      title,
      price: priceNumber,
      priceFormatted: formatCurrency(priceNumber),
      image
    };
  }

  function addToCartFromElement(productGridEl, qty = 1) {
    if (!sessionStorage.getItem('isLoggedIn')) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      window.location.href = 'login.html';
      return;
    }

    const data = extractProductData(productGridEl);
    if (!data) return;

    const cart = loadCart();
    const existing = cart.find(i => i.id === data.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ ...data, qty });
    }
    saveCart(cart);
    updateBadge();
  }

  // Public (used by inline onclick="addToCartCount(1);cartquick()")
  window.addToCartCount = function (qty) {
    // Dựa vào event.target (inline handler) để tìm product
    const target = (typeof event !== 'undefined' && event.target) ? event.target : null;
    const productGridEl = target ? target.closest('.product-grid') : null;
    addToCartFromElement(productGridEl, Number(qty) || 1);
  };

  // Improve: gắn class cho các nút "ADD TO CARD" để bắt sự kiện (nếu muốn bỏ inline sau này)
  function tagAddToCartButtons() {
    document.querySelectorAll('.add-to-card a').forEach(a => {
      if (/ADD TO CARD/i.test(a.textContent)) {
        a.classList.add('btn-add-to-cart');
      }
    });
  }

  function bindDelegatedClick() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn-add-to-cart');
      if (!btn) return;
      // Nếu vẫn còn inline addToCartCount thì không cần làm lại (tránh double)
      if (btn.getAttribute('data-inline-handled') === 'true') return;
      const productEl = btn.closest('.product-grid');
      addToCartFromElement(productEl, 1);
      // Không mở popup ở đây vì đã có cartquick() từ inline. Nếu bỏ inline thì có thể gọi cartquick().
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    tagAddToCartButtons();
    bindDelegatedClick();
    updateBadge();
  });

})();