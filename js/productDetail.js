document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const allProducts = JSON.parse(localStorage.getItem('productsData') || '[]');
  const product = allProducts.find(p => p.id === productId);

  if (!product) {
    document.getElementById('productDetail').innerHTML = '<h2>Product not found</h2>';
    return;
  }

  renderProduct(product);
});

function renderProduct(product) {
  const container = document.getElementById('productDetail');

  const memoryKey = `selection_${product.id}`;
  const savedSelections = JSON.parse(localStorage.getItem(memoryKey) || '{}');

  const thumbnails = product.images.map((src, i) => `
    <img src="${src}" class="img-thumbnail thumb-img me-2" style="width:80px; cursor:pointer;" data-index="${i}" alt="Thumbnail ${i + 1}">
  `).join('');

  const carouselImages = product.images.map((src, i) => `
    <div class="carousel-item ${i === 0 ? 'active' : ''}">
      <img src="${src}" class="d-block w-100" alt="${product.name}">
    </div>
  `).join('');

  let optionsHTML = '';
  if (['jersey', 'bibshorts'].includes(product.type)) {
    optionsHTML += `
      <label class="form-label mt-3">Select Color:</label>
      <select id="selectColor" class="form-select mb-3">
        <option value="">Choose color</option>
        <option value="White">White</option>
        <option value="Black">Black</option>
        <option value="Pink">Pink</option>
      </select>
      <label class="form-label">Select Size:</label>
      <select id="selectSize" class="form-select mb-3">
        <option value="">Choose size</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>`;
  } else if (product.type === 'shoes') {
    optionsHTML += `
      <label class="form-label mt-3">Select Shoe Size:</label>
      <select id="selectShoeSize" class="form-select mb-3">
        <option value="">Choose shoe size</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>`;
  }

  container.innerHTML = `
    <div class="col-md-6">
      <div id="productCarousel" class="carousel slide mb-2" data-bs-ride="carousel">
        <div class="carousel-inner">${carouselImages}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
        </button>
      </div>
      <div class="d-flex justify-content-start mb-3" id="thumbnailGallery">
        ${thumbnails}
      </div>
    </div>
    <div class="col-md-6">
      <h2>${product.name}</h2>
      <p><strong>Price:</strong> KSH ${product.price}</p>
      <p>${product.description}</p>
      ${optionsHTML}
      <button class="btn btn-primary mt-3" id="addToCartBtn">Add to Cart</button>
    </div>
  `;

  // Activate carousel
  const carousel = new bootstrap.Carousel(document.getElementById('productCarousel'));

  // Thumbnail click to change carousel
  document.querySelectorAll('.thumb-img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.getAttribute('data-index'));
      carousel.to(index);
    });
  });

  // Restore saved selection (if any)
  if (savedSelections.color && document.getElementById('selectColor')) {
    document.getElementById('selectColor').value = savedSelections.color;
  }
  if (savedSelections.size && document.getElementById('selectSize')) {
    document.getElementById('selectSize').value = savedSelections.size;
  }
  if (savedSelections.shoeSize && document.getElementById('selectShoeSize')) {
    document.getElementById('selectShoeSize').value = savedSelections.shoeSize;
  }

  // Handle Add to Cart
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    const color = document.getElementById('selectColor')?.value || null;
    const size = document.getElementById('selectSize')?.value || null;
    const shoeSize = document.getElementById('selectShoeSize')?.value || null;

    // Save selected options
    localStorage.setItem(memoryKey, JSON.stringify({ color, size, shoeSize }));

    if (['jersey', 'bibshorts'].includes(product.type)) {
      if (!color || !size) {
        alert('Please select both color and size.');
        return;
      }
    }

    if (product.type === 'shoes' && !shoeSize) {
      alert('Please select a shoe size.');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(item =>
      item.id === product.id &&
      item.color === color &&
      item.size === size &&
      item.shoeSize === shoeSize
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        images: product.images,
        description: product.description,
        type: product.type,
        color,
        size,
        shoeSize
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart!');
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = count;
}
