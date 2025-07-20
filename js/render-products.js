// render-products.js
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  productList.forEach(product => {
    const col = document.createElement('div');
    col.className = "col";

    col.innerHTML = `
      <div class="card product-card" data-product-id="${product.id}">
        <div class="zoom-hover">
          <img src="${product.images[0]}" alt="${product.name}" class="product-image card-img-top" />
        </div>
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">KSH ${product.price}</p>
          <p class="card-text text-muted">${product.description}</p>
        </div>
      </div>
    `;

    grid.appendChild(col);
  });

  document.querySelectorAll('.product-image').forEach(img => {
    img.addEventListener('click', () => {
      const productCard = img.closest('.product-card');
      const id = productCard.dataset.productId;
      const product = productList.find(p => p.id === id);
      if (product) {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'product.html';
      }
    });
  });
});

document.querySelectorAll('.product-card .card img').forEach(img => {
  img.addEventListener('click', () => viewProduct(img));
});
