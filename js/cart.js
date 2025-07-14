document.addEventListener("DOMContentLoaded", () => {
  displayCartItems();

  // Replace old checkoutBtn listener with the new buttons listeners
  const payOnDeliveryBtn = document.getElementById("payOnDeliveryBtn");
  if (payOnDeliveryBtn) {
    payOnDeliveryBtn.addEventListener("click", () => startCheckout("pod"));
  }

  const payViaMpesaBtn = document.getElementById("payViaMpesaBtn");
  if (payViaMpesaBtn) {
    payViaMpesaBtn.addEventListener("click", () => startCheckout("mpesa"));
  }

  const completeOrderBtn = document.getElementById("completeOrderBtn");
  if (completeOrderBtn) completeOrderBtn.addEventListener("click", completeCheckout);

  // Also listen to payment method selector changes for dynamic toggling
  const paymentMethodSelect = document.getElementById("paymentMethod");
  if (paymentMethodSelect) {
    paymentMethodSelect.addEventListener("change", togglePaymentFields);
  }

  updateCartCount();
});

// ==============================
// Display Cart Items
// ==============================
// ==============================
let cartSwiper;

function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const wrapper = document.getElementById("cartSwiperWrapper");
  wrapper.innerHTML = "";
  let total = 0;

  if (!cart.length) {
    wrapper.innerHTML = `<div class="swiper-slide text-center py-5">
      <h4>Your cart is empty 🛒</h4>
      <a href="index.html" class="btn btn-primary mt-3">Continue Shopping</a>
    </div>`;
    document.getElementById("totalPrice").textContent = "0";
    if (cartSwiper) cartSwiper.update();
    return;
  }

  cart.forEach((item, i) => {
    total += item.price * (item.quantity || 1);
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const imagesHTML = (item.images || [item.image || "images/placeholder.png"])
      .map((src, idx) => `
        <div class="carousel-item ${idx === 0 ? "active" : ""}">
          <img src="${src}" class="d-block w-100" style="max-height:250px; object-fit:cover;" alt="${item.name}">
        </div>`).join("");

    slide.innerHTML = `
      <div class="product-card">
        <div class="card h-100">
          <div id="carouselCart${i}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">${imagesHTML}</div>
            ${(item.images || []).length > 1 ? `
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselCart${i}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselCart${i}" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
              </button>` : ""}
          </div>
          <div class="product-info mt-2 p-3">
            <h5>${item.name}</h5>
            <p class="text-muted">${item.description || "No description"}</p>
            <p><strong>KSH ${item.price.toLocaleString()}</strong></p>
            <label class="form-label small mb-0">Qty:</label>
            <input type="number" class="form-control form-control-sm mb-2" min="1" value="${item.quantity}" onchange="updateItem(${i}, 'quantity', this.value)">
            ${item.size ? `<label class="form-label small mb-0">Size:</label>
              <input type="text" class="form-control form-control-sm mb-2" value="${item.size}" onchange="updateItem(${i}, 'size', this.value)">` : ""}
            ${item.color ? `<label class="form-label small mb-0">Color:</label>
              <input type="text" class="form-control form-control-sm mb-2" value="${item.color}" onchange="updateItem(${i}, 'color', this.value)">` : ""}
            <p>Subtotal: <strong>KSH ${(item.price * item.quantity).toLocaleString()}</strong></p>
            <button class="btn btn-sm btn-danger w-100" onclick="removeItem(${i})">Remove</button>
          </div>
        </div>
      </div>`;

    wrapper.appendChild(slide);
  });

  document.getElementById("totalPrice").textContent = total.toLocaleString();

  if (!cartSwiper) {
    cartSwiper = new Swiper('.cart-swiper', {
      slidesPerView: 3,
      spaceBetween: 20,
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 3 },
        992: { slidesPerView: 5 }
      }
    });
  } else {
    cartSwiper.update();
  }
}
// ==============================
// Remove Item
// ==============================
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
  }
}

// ==============================
// Update Individual Cart Item
// ==============================
function updateItem(index, field, value) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index]) {
    if (field === 'quantity') {
      const newQuantity = parseInt(value);
      if (!isNaN(newQuantity) && newQuantity > 0) {
        cart[index].quantity = newQuantity;
      }
    } else {
      cart[index][field] = value;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
  }
}

// ==============================
// Start Checkout
// ==============================
let chosenPaymentMethod = null;

function startCheckout(method) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  chosenPaymentMethod = method;

  // Show modal for customer info
  const customerModalEl = document.getElementById("customerInfoModal");
  const customerModal = new bootstrap.Modal(customerModalEl);

  // Show/hide mpesa number input & instructions dynamically inside modal
  const mpesaInputGroup = customerModalEl.querySelector("#mpesaNumberGroup");
  const mpesaInstructions = customerModalEl.querySelector("#mpesaInstructions");

  if (method === "mpesa") {
    if (mpesaInputGroup) mpesaInputGroup.style.display = "block";
    if (mpesaInstructions) mpesaInstructions.style.display = "block";
  } else {
    if (mpesaInputGroup) mpesaInputGroup.style.display = "none";
    if (mpesaInstructions) mpesaInstructions.style.display = "none";
  }

  // Clear previous inputs
  document.getElementById("customerName").value = "";
  document.getElementById("customerLocation").value = "";
  if (mpesaInputGroup) document.getElementById("mpesaNumber").value = "";

  customerModal.show();

  document.getElementById("submitCustomerInfo").onclick = () => {
    const name = document.getElementById("customerName").value.trim();
    const location = document.getElementById("customerLocation").value.trim();

    if (!name || !location) {
      alert("Please enter your name and delivery location.");
      return;
    }

    if (method === "mpesa") {
      const mpesaNumber = document.getElementById("mpesaNumber").value.trim();
      if (!mpesaNumber || !isValidMpesaNumber(mpesaNumber)) {
        alert("Please enter a valid M-Pesa number (e.g. 0712345678, 0112345678, +254712345678).");
        return;
      }
      window.customerMpesaNumber = mpesaNumber;
    }

    window.customerName = name;
    window.customerLocation = location;

    customerModal.hide();

    // Now start checkout with confirmed data
    completeCheckout();
  };
}

// ==============================
// Toggle Payment Fields
// ==============================
function togglePaymentFields() {
  const method = document.getElementById("paymentMethod").value;
  const mpesaSection = document.getElementById("mpesaSection");
  if (mpesaSection) mpesaSection.style.display = method === "mpesa" ? "block" : "none";
}

// ==============================
// Validate M-Pesa Number
// ==============================
function isValidMpesaNumber(number) {
  const cleaned = number.replace(/\s|-/g, '');
  return /^(\+254|254|07|01)\d{8}$/.test(cleaned);
}

// ==============================
// Complete Checkout
// ==============================
function completeCheckout() {
  const method = chosenPaymentMethod || document.getElementById("paymentMethod").value;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let total = cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0).toFixed(2);
  let customerInfo = "";

  if (method === "mpesa") {
    // Use stored customerMpesaNumber from modal input
    const mpesaNumber = window.customerMpesaNumber || "";

    fetch("/mpesa/stkpush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: mpesaNumber, amount: total })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ResponseCode === "0") {
          alert("✅ M-Pesa payment prompt sent. Please complete the payment.");
          customerInfo = `M-Pesa Number: ${mpesaNumber}`;
          proceedToWhatsApp(cart, total, method, customerInfo);
        } else {
          alert(`❌ Payment failed: ${data.errorMessage || "Unknown error"}`);
        }
      })
      .catch(err => {
        console.error("Error:", err);
        alert("❌ Failed to initiate M-Pesa payment.");
      });

  } else {
    customerInfo = method === "pod" ? "Pay on Delivery" : "";
    proceedToWhatsApp(cart, total, method, customerInfo);
  }
}

// ==============================
// Send WhatsApp Order Message
// ==============================
function proceedToWhatsApp(cart, total, method, customerInfo) {
  let message = `🧾 *New Order Received!*\n\n`;

  cart.forEach((item, index) => {
    message += `#${index + 1}: ${item.name}\n`;
    if (item.color) message += `• Color: ${item.color}\n`;
    if (item.size) message += `• Size: ${item.size}\n`;
    if (item.shoeSize) message += `• Shoe Size: ${item.shoeSize}\n`;
    message += `• Quantity: ${item.quantity || 1}\n`;
    message += `• Price: KSH ${Number(item.price).toLocaleString()}\n\n`;
  });

  message += `💰 *Total Order Value:* KSH ${total}\n`;
  message += `📦 *Payment Method:* ${method.toUpperCase()}\n`;
  message += `👤 *Customer:* ${window.customerName || 'N/A'}\n`;
  message += `📍 *Location:* ${window.customerLocation || 'N/A'}\n`;
  message += `📇 ${customerInfo}\n\n✅ Please confirm the order.`;

  const phone = "254746147272";
  const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, '_blank');

  // Clear cart and reset UI
  localStorage.removeItem("cart");
  displayCartItems();
  updateCartCount();
  const checkoutSection = document.getElementById("checkoutSection");
  if (checkoutSection) checkoutSection.style.display = "none";
  const totalPrice = document.getElementById("totalPrice");
  if (totalPrice) totalPrice.textContent = "0";

  // Clear saved customer info
  window.customerName = "";
  window.customerLocation = "";
  window.customerMpesaNumber = "";
}

// ==============================
// Update Cart Badge (Item Count)
// ==============================
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = cart.length;
}
