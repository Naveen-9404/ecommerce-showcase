/* =====================================================
   PRODUCT DATA (STATIC)
===================================================== */

const products = [
  {
    id: 1,
    name: "Samsung Galaxy Smartphone",
    price: 14999,
    category: "electronics",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format"
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 2999,
    category: "electronics",
    img: "https://images.unsplash.com/photo-1585386959984-a4155224a1c1?w=600&auto=format"
  },
  {
    id: 3,
    name: "Men Casual Sneakers",
    price: 3499,
    category: "fashion",
    img: "https://images.unsplash.com/photo-1528701800489-20be3c85f8b8?w=600&auto=format"
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 6799,
    category: "home",
    img: "https://images.unsplash.com/photo-1582582429416-6a9518f26bb2?w=600&auto=format"
  }
];

/* =====================================================
   STATE
===================================================== */

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let selectedProduct = null;

/* =====================================================
   DOM ELEMENTS
===================================================== */

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");

const cartBox = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalEl = document.getElementById("total");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");

const paymentModal = document.getElementById("payment-modal");
const adminPanel = document.getElementById("admin");
const adminProducts = document.getElementById("admin-products");
const adminOrders = document.getElementById("admin-orders");

/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(list = products) {
  productList.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product";

    card.innerHTML = `
      <img 
        src="${product.img}" 
        alt="${product.name}"
        onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'"
      >
      <h3>${product.name}</h3>
      <p>₹${product.price.toLocaleString()}</p>
      <button onclick="openModal(${product.id})">Quick View</button>
    `;

    productList.appendChild(card);
  });
}

renderProducts();

/* =====================================================
   SEARCH & FILTER
===================================================== */

function filterProducts(category) {
  if (category === "all") renderProducts();
  else renderProducts(products.filter(p => p.category === category));
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  renderProducts(
    products.filter(p => p.name.toLowerCase().includes(value))
  );
});

/* =====================================================
   MODAL
===================================================== */

function openModal(id) {
  selectedProduct = products.find(p => p.id === id);
  modal.style.display = "block";
  modalImg.src = selectedProduct.img;
  modalTitle.innerText = selectedProduct.name;
  modalPrice.innerText = `₹${selectedProduct.price.toLocaleString()}`;
}

function closeModal() {
  modal.style.display = "none";
}

/* =====================================================
   CART
===================================================== */

function addToCartFromModal() {
  const item = cart.find(i => i.id === selectedProduct.id);
  if (item) item.qty++;
  else cart.push({ ...selectedProduct, qty: 1 });
  saveCart();
  closeModal();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  cartCount.innerText = cart.reduce((s, i) => s + i.qty, 0);
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    cartItems.innerHTML += `
      <div class="cart-item">
        ${item.name} × ${item.qty}
        <div>
          <button onclick="updateQty(${index},1)">+</button>
          <button onclick="updateQty(${index},-1)">-</button>
          <button onclick="removeItem(${index})">✖</button>
        </div>
      </div>
    `;
  });

  totalEl.innerText = total.toLocaleString();
}

function updateQty(i, c) {
  cart[i].qty += c;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart();
}

function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
}

function toggleCart() {
  cartBox.classList.toggle("open");
}

saveCart();

/* =====================================================
   PAYMENT
===================================================== */

function openPayment() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  paymentModal.style.display = "block";
}

function closePayment() {
  paymentModal.style.display = "none";
}

function completePayment() {
  orders.push({
    id: Date.now(),
    date: new Date().toLocaleString(),
    total: cart.reduce((s, i) => s + i.price * i.qty, 0)
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  cart = [];
  saveCart();
  closePayment();
  alert("Payment Successful (Mock)");
  renderAdminOrders();
}

/* =====================================================
   ADMIN
===================================================== */

function toggleAdmin() {
  adminPanel.style.display =
    adminPanel.style.display === "block" ? "none" : "block";
  renderAdminProducts();
  renderAdminOrders();
}

function renderAdminProducts() {
  adminProducts.innerHTML = "";
  products.forEach(p => {
    adminProducts.innerHTML += `
      <div class="admin-item">
        ${p.name} – ₹${p.price}
      </div>
    `;
  });
}

function renderAdminOrders() {
  adminOrders.innerHTML = "";
  orders.forEach(o => {
    adminOrders.innerHTML += `
      <div class="admin-item">
        Order #${o.id}<br>₹${o.total}
      </div>
    `;
  });
}
