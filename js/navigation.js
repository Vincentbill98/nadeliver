function viewProduct(productCardElement) {
  const productName = productCardElement.closest('.product-card')?.dataset.name;
  if (!productName) return;

  const encodedName = encodeURIComponent(productName.toLowerCase().replace(/\s+/g, '-'));
  window.location.href = `product.html?id=${encodedName}`;
}
