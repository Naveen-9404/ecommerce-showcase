let products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "Samsung Galaxy Smartphone", price: 14999, category: "electronics", img: "https://picsum.photos/300?1" },
  { id: 2, name: "Wireless Headphones", price: 2999, category: "electronics", img: "https://picsum.photos/300?2" },
  { id: 3, name: "Men Casual Sneakers", price: 3499, category: "fashion", img: "https://picsum.photos/300?3" },
  { id: 4, name: "Ergonomic Office Chair", price: 6799, category: "home", img: "https://picsum.photos/300?4" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let selectedProduct = null;

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");

function renderProducts(list = products) {
  productList.innerHTML = "";
  list.forEach(p => {
    productList.innerHTML += `
      <div class="product-card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price}</p>
        <button class="quick-btn" onclick="openModal(${p.id})">Quick View</button>
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
  renderProducts(products.filter(p => p.name.toLowerCase().includes(e.target.value.toLowerCase())));
});

/* MODAL */
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

/* CART */
function addToCartFromModal() {
  let item = cart.find(i => i.id === selectedProduct.id);
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
  cart.forEach((i, idx) => {
    total += i.price * i.qty;
    cartItems.innerHTML += `
      <div class="cart-item">
        ${i.name} x${i.qty}
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
  cart.classList.toggle("open");
  renderCart();
}
saveCart();

/* PAYMENT & ORDERS */
function openPayment() {
  paymentModal.style.display = "block";
}
function closePayment() {
  paymentModal.style.display = "none";
}

function completePayment() {
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
  alert("Payment Successful");
}

function renderOrders() {
  orderList.innerHTML = "";
  orders.forEach(o => {
    orderList.innerHTML += `
      <div class="order-card">
        Order #${o.id}<br>
        ₹${o.total}
      </div>
    `;
  });
}
renderOrders();

/* ADMIN */
function toggleAdmin() {
  admin.style.display = admin.style.display === "block" ? "none" : "block";
  renderAdminProducts();
  renderAdminOrders();
}

function addProduct() {
  products.push({
    id: Date.now(),
    name: pname.value,
    price: Number(pprice.value),
    category: pcat.value,
    img: pimg.value
  });
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function renderAdminProducts() {
  adminProducts.innerHTML = "";
  products.forEach((p, i) => {
    adminProducts.innerHTML += `
      <div class="admin-item">
        ${p.name}
        <button onclick="deleteProduct(${i})">Delete</button>
      </div>
    `;
  });
}

function deleteProduct(i) {
  products.splice(i, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function renderAdminOrders() {
  adminOrders.innerHTML = "";
  orders.forEach(o => {
    adminOrders.innerHTML += `<div class="admin-item">Order #${o.id} - ₹${o.total}</div>`;
  });
}
