/* ------------------ DATA ------------------ */
let products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "Phone", price: 15000, category: "electronics", img: "https://picsum.photos/300?1" },
  { id: 2, name: "Shoes", price: 3000, category: "fashion", img: "https://picsum.photos/300?2" },
  { id: 3, name: "Chair", price: 4500, category: "home", img: "https://picsum.photos/300?3" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let selectedProduct = null;

/* ------------------ DOM ELEMENTS ------------------ */
const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartBox = document.getElementById("cart");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");

const cartItemsEl = document.getElementById("cart-items");
const totalEl = document.getElementById("total");

const paymentModal = document.getElementById("payment-modal");
const orderList = document.getElementById("order-list");

const adminPanel = document.getElementById("admin");
const adminProducts = document.getElementById("admin-products");
const adminOrders = document.getElementById("admin-orders");

/* ------------------ PRODUCTS ------------------ */
function renderProducts(list = products) {
  productList.innerHTML = "";
  list.forEach(p => {
    productList.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="openModal(${p.id})">Quick View</button>
      </div>
    `;
  });
}
renderProducts();

function filterProducts(cat) {
  if (cat === "all") renderProducts();
  else renderProducts(products.filter(p => p.category === cat));
}

document.getElementById("search").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(value)));
});

/* ------------------ MODAL ------------------ */
function openModal(id) {
  selectedProduct = products.find(p => p.id === id);
  modal.style.display = "block";
  modalImg.src = selectedProduct.img;
  modalTitle.innerText = selectedProduct.name;
  modalPrice.innerText = "₹" + selectedProduct.price;
}

function closeModal() {
  modal.style.display = "none";
}

/* ------------------ CART ------------------ */
function addToCartFromModal() {
  let item = cart.find(i => i.id === selectedProduct.id);
  if (item) item.qty++;
  else cart.push({ ...selectedProduct, qty: 1 });
  saveCart();
  closeModal();
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    cartItemsEl.innerHTML += `
      <div class="cart-item">
        ${item.name} x${item.qty}
        <div>
          <button onclick="updateQty(${idx},1)">+</button>
          <button onclick="updateQty(${idx},-1)">-</button>
          <button onclick="removeItem(${idx})">✖</button>
        </div>
      </div>
    `;
  });

  totalEl.innerText = total;
}

function updateQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  cartCount.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
  renderCart();
}

function toggleCart() {
  cartBox.classList.toggle("open");
  renderCart();
}
saveCart();

/* ------------------ PAYMENT & ORDERS ------------------ */
function openPayment() {
  paymentModal.style.display = "block";
}

function closePayment() {
  paymentModal.style.display = "none";
}

function completePayment() {
  if (cart.length === 0) return alert("Cart is empty!");

  orders.push({
    id: Date.now(),
    date: new Date().toLocaleString(),
    items: [...cart],
    total: cart.reduce((s, i) => s + i.price * i.qty, 0)
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  cart = [];
  saveCart();
  closePayment();
  renderOrders();
  alert("Payment Successful (Mock)");
}

function renderOrders() {
  orderList.innerHTML = "";
  orders.forEach(o => {
    orderList.innerHTML += `
      <div class="order-card">
        <b>Order #${o.id}</b><br>
        ${o.date}<br>
        Total ₹${o.total}
      </div>
    `;
  });
}
renderOrders();

/* ------------------ ADMIN ------------------ */
function toggleAdmin() {
  adminPanel.style.display = adminPanel.style.display === "block" ? "none" : "block";
  renderAdminProducts();
  renderAdminOrders();
}

function addProduct() {
  products.push({
    id: Date.now(),
    name: document.getElementById("pname").value,
    price: Number(document.getElementById("pprice").value),
    category: document.getElementById("pcat").value,
    img: document.getElementById("pimg").value
  });

  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
  renderAdminProducts();
}

function renderAdminProducts() {
  adminProducts.innerHTML = "";
  products.forEach((p, i) => {
    adminProducts.innerHTML += `
      <div class="admin-item">
        ${p.name} ₹${p.price}
        <button onclick="deleteProduct(${i})">Delete</button>
      </div>
    `;
  });
}

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
  renderAdminProducts();
}

function renderAdminOrders() {
  adminOrders.innerHTML = "";
  orders.forEach(o => {
    adminOrders.innerHTML += `
      <div class="admin-item">
        Order #${o.id}<br>
        ₹${o.total}
      </div>
    `;
  });
}
