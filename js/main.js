// main.js

let selectedColor = null;
let selectedSize = null;
let selectedShoeSize = null;

function chooseColor(color) {
  selectedColor = color;
  const modal = bootstrap.Modal.getInstance(document.getElementById('colorModal'));
  modal.hide();
}

function chooseSize(size) {
  selectedSize = size;
  const modal = bootstrap.Modal.getInstance(document.getElementById('sizeModal'));
  modal.hide();
}

function chooseShoeSize(size) {
  selectedShoeSize = size;
  const modal = bootstrap.Modal.getInstance(document.getElementById('shoeSizeModal'));
  modal.hide();
}

function addToCart(button) {
  const productCard = button.closest('.product-card');
  if (!productCard) return;

  const name = productCard.dataset.name;
  const price = Number(productCard.dataset.price);

  const isJerseyOrBibshorts = name.toLowerCase().includes('jersey') || name.toLowerCase().includes('bibshort');
  const isShoes = name.toLowerCase().includes('shoes');

  // Require size/color/shoeSize
  if (isJerseyOrBibshorts) {
    if (!selectedColor) {
      new bootstrap.Modal(document.getElementById('colorModal')).show();
      return;
    }
    if (!selectedSize) {
      new bootstrap.Modal(document.getElementById('sizeModal')).show();
      return;
    }
  }

  if (isShoes && !selectedShoeSize) {
    new bootstrap.Modal(document.getElementById('shoeSizeModal')).show();
    return;
  }

  // 🖼️ Extract multiple images
  const imageEls = productCard.querySelectorAll('.carousel-inner img, .card img');
  const images = Array.from(imageEls).map(img => img.getAttribute('src')).filter(Boolean);

  // 📄 Extract description
  const descEl = productCard.querySelector('p');
  const description = descEl ? descEl.textContent.trim() : 'No description';

  const cartItem = {
    name,
    price,
    quantity: 1,
    images: images.length > 0 ? images : ['images/placeholder.png'],
    description,
    color: selectedColor || null,
    size: selectedSize || null,
    shoeSize: selectedShoeSize || null
  };

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingIndex = cart.findIndex(item =>
    item.name === cartItem.name &&
    item.color === cartItem.color &&
    item.size === cartItem.size &&
    item.shoeSize === cartItem.shoeSize
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  // Reset selections
  selectedColor = null;
  selectedSize = null;
  selectedShoeSize = null;
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.length;
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = count;
  }
}

// Optional: remove search alert too
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) return;
    // Implement actual search logic here
  });
}

// WhatsApp chat modal
function openChatModal(productName) {
  const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
  document.getElementById('productName').value = productName;
  chatModal.show();
}

function sendWhatsApp() {
  const userName = document.getElementById('userName').value.trim();
  const userMessage = document.getElementById('userMessage').value.trim();
  const productName = document.getElementById('productName').value;

  if (!userName || !userMessage) return;

  const text = `Hello, I am ${userName}.\nI am interested in the product: ${productName}.\nDetails: ${userMessage}`;
  const phoneNumber = '254748609227';

  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');

  const chatModal = bootstrap.Modal.getInstance(document.getElementById('chatModal'));
  chatModal.hide();
  document.getElementById('chatForm').reset();
}

document.addEventListener('DOMContentLoaded', updateCartCount);
