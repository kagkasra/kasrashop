const cart = JSON.parse(localStorage.getItem('cart')) || [];

// به‌روزرسانی جمع کل قیمت
function updateTotalPrice() {
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPriceElement = document.getElementById('total-price');
  if (totalPriceElement) {
    totalPriceElement.textContent = totalPrice.toLocaleString();
  }
}

// نمایش محصولات سبد خرید
if (document.querySelector('.cart-items')) {
  const cartItemsContainer = document.querySelector('.cart-items');
  cartItemsContainer.innerHTML = ''; // پاک کردن محتوای قبلی
  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');
    itemElement.innerHTML = `
      <h3>${item.name}</h3>
      <p>قیمت: ${item.price.toLocaleString()} تومان</p>
      <p>تعداد: ${item.quantity}</p>
      <button class="remove-from-cart" data-id="${item.id}">حذف محصول</button>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  // دکمه‌های حذف محصول
  document.querySelectorAll('.remove-from-cart').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const updatedCart = cart.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      alert('محصول حذف شد!');
      location.reload(); // بازخوانی صفحه
    });
  });
}

// جمع کل قیمت را به‌روزرسانی کن
updateTotalPrice();

// افزودن محصول به سبد خرید
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const price = parseInt(button.getAttribute('data-price'), 10);

    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('محصول به سبد خرید اضافه شد!');
    updateTotalPrice();
  });
});

// پرداخت و نهایی‌سازی
if (document.getElementById('checkout')) {
  document.getElementById('checkout').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('سبد خرید شما خالی است!');
      return;
    }

    alert('پرداخت با موفقیت انجام شد! از خرید شما متشکریم.');
    localStorage.removeItem('cart'); // حذف سبد خرید
    location.reload(); // بازخوانی صفحه
  });
}
