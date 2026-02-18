document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     PRODUCT DATA
  ========================= */

  const products = [
    {
      id: 1,
      name: "Samsung Galaxy Smartphone",
      price: 14999,
      category: "electronics",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/IPhone_14_Pro_vector.svg/640px-IPhone_14_Pro_vector.svg.png"
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: 2999,
      category: "electronics",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Headphones_1.jpg/640px-Headphones_1.jpg"
    },
    {
      id: 3,
      name: "Men Casual Sneakers",
      price: 3499,
      category: "fashion",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sneakers.jpg/640px-Sneakers.jpg"
    },
    {
      id: 4,
      name: "Ergonomic Office Chair",
      price: 6799,
      category: "home",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Office_chair.jpg/640px-Office_chair.jpg"
    }
  ];

  /* =========================
     STATE (DECLARED ONCE)
  ========================= */

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let selectedProduct = null;

  /* =========================
     DOM ELEMENTS
  ========================= */

  const productList = document.getElementById("product-list");
  const cartBox = document.getElementById("cart");
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const totalEl = document.getElementById("total");

  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalPrice = document.getElementById("modal-price");

  const paymentModal = document.getElementById("payment-modal");

  /* =========================
     RENDER PRODUCTS
  ========================= */

  function renderProducts(list = products) {
    productList.innerHTML = "";

    list.forEach(product => {
      const card = document.createElement("div");
      card.className = "product";

      card.innerHTML = `
        <img 
          src="${product.img}" 
          alt="${product.name}"
          onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=No+Image';"
        >
        <h3>${product.name}</h3>
        <p>₹${product.price.toLocaleString()}</p>
        <button onclick="openModal(${product.id})">Quick View</button>
      `;

      productList.appendChild(card);
    });
  }

  /* =========================
     SEARCH & FILTER
  ========================= */

  window.filterProducts = function (category) {
    if (category === "all") renderProducts();
    else renderProducts(products.filter(p => p.category === category));
  };

  document.getElementById("search")?.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(value)));
  });

  /* =========================
     MODAL
  ========================= */

  window.openModal = function (id) {
    selectedProduct = products.find(p => p.id === id);
    modal.style.display = "block";
    modalImg.src = selectedProduct.img;
    modalTitle.innerText = selectedProduct.name;
    modalPrice.innerText = `₹${selectedProduct.price.toLocaleString()}`;
  };

  window.closeModal = function () {
    modal.style.display = "none";
  };

  /* =========================
     CART
  ========================= */

  window.addToCartFromModal = function () {
    const item = cart.find(i => i.id === selectedProduct.id);
    if (item) item.qty++;
    else cart.push({ ...selectedProduct, qty: 1 });
    saveCart();
    closeModal();
  };

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    cartCount.innerText = cart.reduce((s, i) => s + i.qty, 0);
    renderCart();
  }

  function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, i) => {
      total += item.price * item.qty;
      cartItems.innerHTML += `
        <div class="cart-item">
          ${item.name} × ${item.qty}
          <div>
            <button onclick="updateQty(${i},1)">+</button>
            <button onclick="updateQty(${i},-1)">-</button>
            <button onclick="removeItem(${i})">✖</button>
          </div>
        </div>
      `;
    });

    totalEl.innerText = total.toLocaleString();
  }

  window.updateQty = function (i, c) {
    cart[i].qty += c;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    saveCart();
  };

  window.removeItem = function (i) {
    cart.splice(i, 1);
    saveCart();
  };

  window.toggleCart = function () {
    cartBox.classList.toggle("open");
  };

  /* =========================
     PAYMENT
  ========================= */

  window.openPayment = function () {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    paymentModal.style.display = "block";
  };

  window.closePayment = function () {
    paymentModal.style.display = "none";
  };

  window.completePayment = function () {
    orders.push({
      id: Date.now(),
      date: new Date().toLocaleString(),
      total: cart.reduce((s, i) => s + i.price * i.qty, 0)
    });

    localStorage.setItem("orders", JSON.stringify(orders));
    cart = [];
    saveCart();
    closePayment();
    alert("Order placed successfully!");
  };

  /* =========================
     MY ORDERS
  ========================= */

  window.openOrders = function () {
    const list = document.getElementById("orders-list");
    list.innerHTML = "";

    if (orders.length === 0) {
      list.innerHTML = "<p>No orders yet.</p>";
    } else {
      orders.forEach(o => {
        list.innerHTML += `
          <div class="order-item">
            <strong>Order #${o.id}</strong><br>
            ${o.date}<br>
            Total: ₹${o.total}
          </div>
        `;
      });
    }
    document.getElementById("orders-modal").style.display = "block";
  };

  window.closeOrders = function () {
    document.getElementById("orders-modal").style.display = "none";
  };

  /* =========================
     INIT
  ========================= */

  saveCart();
  renderProducts();

});
