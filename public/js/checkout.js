document.addEventListener('DOMContentLoaded', () => {
  const translations = {
    en: {
      checkoutTitle: 'Secure Checkout',
      orderSummary: 'Order Summary',
      totalToPay: 'Total to Pay:',
      paymentMethod: 'Payment Method',
      nameOnCard: 'Name on Card',
      cardNumber: 'Card Number',
      expiry: 'Expiry (MM/YY)',
      cvc: 'CVC',
      payNow: 'Pay Now',
      backToStore: 'Back to Store',
      cartEmpty: 'Your cart is empty',
      processing: 'Processing...',
      paymentSuccess: 'Payment Successful!',
      paymentSuccessMsg: 'Thank you for your purchase. Your order has been placed.',
      returnToStore: 'Return to Store'
    },
    es: {
      checkoutTitle: 'Pago Seguro',
      orderSummary: 'Resumen del Pedido',
      totalToPay: 'Total a Pagar:',
      paymentMethod: 'Método de Pago',
      nameOnCard: 'Nombre en la Tarjeta',
      cardNumber: 'Número de Tarjeta',
      expiry: 'Vencimiento (MM/AA)',
      cvc: 'CVC',
      payNow: 'Pagar Ahora',
      backToStore: 'Volver a la Tienda',
      cartEmpty: 'Tu carrito está vacío',
      processing: 'Procesando...',
      paymentSuccess: '¡Pago Exitoso!',
      paymentSuccessMsg: 'Gracias por su compra. Su pedido ha sido realizado.',
      returnToStore: 'Volver a la Tienda'
    }
  };

  let currentLang = localStorage.getItem('inp_lang') || 'en';

  const cart = JSON.parse(localStorage.getItem('inp_cart')) || [];

  const checkoutItems = document.getElementById('checkout-items');
  const checkoutTotal = document.getElementById('checkout-total');
  const paymentForm = document.getElementById('payment-form');
  const mainContent = document.getElementById('main-content');

  const btnEn = document.getElementById('lang-en');
  const btnEs = document.getElementById('lang-es');

  setLanguage(currentLang);

  btnEn.addEventListener('click', () => setLanguage('en'));
  btnEs.addEventListener('click', () => setLanguage('es'));


  // If cart is empty, redirect back
  if (cart.length === 0) {
    alert(translations[currentLang].cartEmpty);
    window.location.href = 'index.html';
    return;
  }

  // Render items
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.cartQty;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <span>${item.cartQty}x ${item.name}</span>
      <span>$${(item.price * item.cartQty).toFixed(2)}</span>
    `;
    checkoutItems.appendChild(el);
  });

  // checkoutTotal.textContent = '$' + total.toFixed(2); // Handled in setLanguage if needed

  // Mock Payment Submission
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = paymentForm.querySelector('button');
    btn.disabled = true;
    const t = translations[currentLang];
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> ${t.processing}`;
    
    // Simulate network delay
    setTimeout(() => {
      // Deduct stock in mock DB
      cart.forEach(item => {
        DB.updateStock(item.id, -item.cartQty);
      });

      // Clear cart
      localStorage.removeItem('inp_cart');
      
      // Show success
      mainContent.innerHTML = `
        <div class="checkout-panel glass-panel payment-success" style="max-width: 600px; margin: 40px auto;">
          <i class="fa-solid fa-circle-check"></i>
          <h2>${t.paymentSuccess}</h2>
          <p>${t.paymentSuccessMsg}</p>
          <a href="index.html" class="btn btn-primary" style="margin-top: 2rem; display: inline-block;">${t.returnToStore}</a>
        </div>
      `;
    }, 1500);
  });

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('inp_lang', lang);

    if (lang === 'en') {
      btnEn.classList.add('active');
      btnEs.classList.remove('active');
    } else {
      btnEs.classList.add('active');
      btnEn.classList.remove('active');
    }

    const t = translations[lang];

    // Header
    const h1 = document.querySelector('header h1');
    if (h1) h1.innerHTML = `<i class="fa-solid fa-credit-card gradient-text"></i> ${t.checkoutTitle}`;
    const backBtn = document.querySelector('header a');
    if (backBtn) backBtn.innerHTML = `<i class="fa-solid fa-store"></i> ${t.backToStore}`;

    // Panels
    const orderSummaryH2 = document.querySelector('.order-summary h2');
    if (orderSummaryH2) orderSummaryH2.textContent = t.orderSummary;
    const totalToPaySpan = document.querySelector('.order-total span:first-child');
    if (totalToPaySpan) totalToPaySpan.textContent = t.totalToPay;
    
    const paymentMethodH2 = document.querySelector('.checkout-panel:not(.order-summary) h2');
    if (paymentMethodH2) paymentMethodH2.textContent = t.paymentMethod;
    
    // Form labels
    const labels = paymentForm.querySelectorAll('label');
    if (labels[0]) labels[0].textContent = t.nameOnCard;
    if (labels[1]) labels[1].textContent = t.cardNumber;
    if (labels[2]) labels[2].textContent = t.expiry;
    if (labels[3]) labels[3].textContent = t.cvc;
    
    // Button
    const submitBtn = paymentForm.querySelector('button');
    if (submitBtn) submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> ${t.payNow}`;

    // Re-render items to update pricing format if needed (though it matches usually)
    renderItems();
  }

  function renderItems() {
    checkoutItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.cartQty;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <span>${item.cartQty}x ${item.name}</span>
        <span>$${(item.price * item.cartQty).toFixed(2)}</span>
      `;
      checkoutItems.appendChild(el);
    });
    checkoutTotal.textContent = '$' + total.toFixed(2);
  }
});
