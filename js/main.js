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

  // Require selections
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

  // Extract product images
  const imageEls = productCard.querySelectorAll('.carousel-inner img, .card img');
  const images = Array.from(imageEls).map(img => img.getAttribute('src')).filter(Boolean);

  // Extract product description
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

  // Load or initialize cart
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if item with same attributes exists
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
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = count;
  }
}

function saveAndGoToDetail(card) {
  const product = {
    id: card.dataset.name.replace(/\s+/g, ''),
    name: card.dataset.name,
    price: Number(card.dataset.price),
    description: card.querySelector('.product-info p:nth-of-type(2)')?.innerText || '',
    type: (
      card.dataset.name.toLowerCase().includes('jersey') ? 'jersey' :
      card.dataset.name.toLowerCase().includes('bibshort') ? 'bibshorts' :
      card.dataset.name.toLowerCase().includes('shoe') ? 'shoes' : ''
    ),
    images: Array.from(card.querySelectorAll('.carousel-inner img')).map(img => img.src)

  };

  // Save product if not already in product list
  let productsData = JSON.parse(localStorage.getItem('productsData') || '[]');
  if (!productsData.find(p => p.id === product.id)) {
    productsData.push(product);
    localStorage.setItem('productsData', JSON.stringify(productsData));
  }

  // Save selected product
  localStorage.setItem('selectedProduct', JSON.stringify(product));

  // Redirect to product detail
  window.location.href = `product.html?id=${encodeURIComponent(product.id)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  document.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = 'pointer';

    card.addEventListener('click', e => {
      if (e.target.closest('.btn') || e.target.closest('button')) return;
      saveAndGoToDetail(card);
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const headings = document.querySelectorAll("h2");

  headings.forEach(h2 => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("heading-container");

    h2.parentNode.insertBefore(wrapper, h2);
    wrapper.appendChild(h2);
  });
});

