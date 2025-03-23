const items = [
    { id: 1, name: 'Cheese Burger', price: 5.99, quantity: 0 },
    { id: 2, name: 'Margherita Pizza', price: 8.99, quantity: 0 },
    { id: 3, name: 'French Fries', price: 3.49, quantity: 0 },
    { id: 4, name: 'Cold Coffee', price: 4.99, quantity: 0 }
  ];
  
  document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.querySelector('.cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    const itemsCount = document.getElementById('items-count');
    const totalAmount = document.getElementById('total-amount');
  
    // Add initial loading state animation
    document.querySelectorAll('.cart-item').forEach(item => {
      item.classList.add('loading');
      setTimeout(() => item.classList.remove('loading'), 1000);
    });
  
    function updateCart() {
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
  
      // Animate total amount change
      const currentTotal = parseFloat(totalAmount.textContent.replace('$', ''));
      animateNumber(currentTotal, total, value => {
        totalAmount.textContent = `$${value.toFixed(2)}`;
      });
  
      checkoutBtn.disabled = total === 0;
  
      // Animate items count badge
      if (count > 0) {
        itemsCount.textContent = `${count} items`;
        itemsCount.style.display = 'block';
        itemsCount.style.animation = 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      } else {
        itemsCount.style.animation = 'none';
        itemsCount.style.display = 'none';
      }
  
      // Update checkout button state with animation
      if (total > 0) {
        checkoutBtn.style.animation = 'none';
        checkoutBtn.offsetHeight; // Trigger reflow
        checkoutBtn.style.animation = 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      }
    }
  
    function animateNumber(start, end, callback) {
      const duration = 500;
      const startTime = performance.now();
      
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easing = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const easedProgress = easing(progress);
        
        const current = start + (end - start) * easedProgress;
        callback(current);
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      
      requestAnimationFrame(update);
    }
  
    function updateItemUI(item) {
      const itemElement = document.querySelector(`[data-id="${item.id}"]`);
      const quantityElement = itemElement.querySelector('.quantity');
      const minusButton = itemElement.querySelector('.minus');
      
      // Animate quantity change
      const currentQuantity = parseInt(quantityElement.textContent);
      animateNumber(currentQuantity, item.quantity, value => {
        quantityElement.textContent = Math.round(value);
      });
  
      minusButton.disabled = item.quantity === 0;
  
      // Add temporary highlight effect
      itemElement.style.transition = 'none';
      itemElement.style.backgroundColor = 'rgba(249, 115, 22, 0.05)';
      itemElement.offsetHeight; // Trigger reflow
      itemElement.style.transition = 'background-color 0.5s ease';
      setTimeout(() => {
        itemElement.style.backgroundColor = 'white';
      }, 50);
    }
  
    cartItems.addEventListener('click', (e) => {
      const button = e.target.closest('.quantity-btn');
      if (!button) return;
  
      const itemElement = button.closest('.cart-item');
      const itemId = parseInt(itemElement.dataset.id);
      const item = items.find(i => i.id === itemId);
  
      if (button.classList.contains('plus')) {
        item.quantity++;
      } else if (button.classList.contains('minus') && item.quantity > 0) {
        item.quantity--;
      }
  
      // Add ripple effect
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(249, 115, 22, 0.3);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: ripple 0.5s linear forwards;
      `;
  
      const rect = button.getBoundingClientRect();
      ripple.style.left = e.clientX - rect.left + 'px';
      ripple.style.top = e.clientY - rect.top + 'px';
  
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
  
      // Add bounce animation to item
      itemElement.style.animation = 'none';
      itemElement.offsetHeight; // Trigger reflow
      itemElement.style.animation = 'bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  
      updateItemUI(item);
      updateCart();
    });
  
    // Add hover effect to cart items
    document.querySelectorAll('.cart-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-4px) scale(1.01)';
      });
  
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
      });
    });
  
    // Initial update with animation
    updateCart();
  });