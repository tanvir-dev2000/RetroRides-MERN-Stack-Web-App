import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './CartPage.module.css';

const TAX_RATE = 0.08; // 8% tax

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    const res = await fetch('/api/cart', { credentials: 'include' });
    const data = await res.json();
    setCart(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (carId) => {
    await fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ carId })
    });
    fetchCart();
  };

  // Updated: redirect to homepage after successful checkout
  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cars: cart.items.map(item => ({
            car: item.car._id,
            priceAtPurchase: item.car.price
          }))
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Purchase successful! Transaction ID: ${data.transactionId}`);
        // Redirect to homepage
        navigate('/');
      } else {
        alert(data.error || 'Purchase failed');
      }
    } catch (err) {
      alert('Error processing checkout.');
    }
    setProcessing(false);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.car.price || 0), 0) || 0;
  const tax = subtotal * TAX_RATE;
  const estimatedTotal = subtotal + tax;

  return (
    <div className={styles.cartPage}>
      <h1 className={styles.pageTitle}>Your Shopping Cart</h1>
      <p className={styles.pageSubtitle}>
        Review your selections below. Each vehicle is a unique piece of history awaiting its next chapter.
      </p>
      <div className={styles.cartContent}>
        {/* Cart Items */}
        <div className={styles.cartItemsSection}>
          <h2 className={styles.sectionTitle}>Items in Your Cart</h2>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Vehicle</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items && cart.items.length > 0 ? cart.items.map(item => (
                <tr key={item.car._id}>
                  <td>
                    <img
                      src={item.car.images?.[0]?.url || '/images/placeholder-car.png'}
                      alt={item.car.make}
                      className={styles.cartImage}
                    />
                  </td>
                  <td>
                    <div className={styles.carName}>{item.car.make} {item.car.model}</div>
                    <div className={styles.carYear}>{item.car.year}</div>
                  </td>
                  <td>${Number(item.car.price).toLocaleString()}</td>
                  <td>${Number(item.car.price).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleRemove(item.car._id)}
                      className={styles.removeBtn}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className={styles.emptyCart}>Your cart is empty.</td>
                </tr>
              )}
            </tbody>
          </table>
          <Link to="/cars" className={styles.continueShoppingBtn}>
            &larr; Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className={styles.orderSummarySection}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Estimated Tax (8%):</span>
            <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping/Delivery:</span>
            <span>Calculated Next <i className="fas fa-info-circle" title="Shipping calculated at checkout"></i></span>
          </div>
          <div className={styles.summaryTotalRow}>
            <span>Estimated Total:</span>
            <span className={styles.summaryTotal}>${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.promoRow}>
            <label htmlFor="promo" className={styles.promoLabel}>Have a Promo Code?</label>
            <div className={styles.promoInputRow}>
              <input type="text" id="promo" className={styles.promoInput} placeholder="Enter code" disabled />
              <button className={styles.promoBtn} disabled>Apply</button>
            </div>
          </div>
          <button
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            disabled={processing || !cart.items || cart.items.length === 0}
          >
            <i className="fas fa-lock"></i> {processing ? 'Processing...' : 'Proceed to Secure Checkout'}
          </button>
          <div className={styles.acceptedCards}>
            <span>We Accept:</span>
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-amex"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fas fa-university"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
