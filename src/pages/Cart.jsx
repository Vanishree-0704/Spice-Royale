
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeQuantity,
  removeFromCart,
  clearCart
} from "../features/food/foodSlice";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.food.cart);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal >= 499 ? 0 : 40;
  const total = subtotal + delivery;

  if (!cart.length) {
    return (
      <section className="royal-cart-page">
        <div className="royal-empty-cart">
          <ShoppingBag size={55} />
          <h1>Your Cart is Empty</h1>
          <p>Your royal dining experience is just a few clicks away.</p>
          <Link to="/menu" className="royal-checkout-btn">
            Explore Our Menu <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="royal-cart-page">
      <div className="royal-cart-container">

        <div className="royal-cart-heading">
          <span className="royal-section-label">YOUR SELECTION</span>
          <h1>Your Shopping Cart</h1>
          <p>Review your favourite dishes before checkout.</p>
        </div>

        <div className="royal-cart-layout">

          <div className="royal-cart-items">
            {cart.map((item) => (
              <article className="royal-cart-item" key={item.id}>

                <img
                  src={item.image}
                  alt={item.name}
                  className="royal-cart-image"
                />

                <div className="royal-cart-info">
                  <span className="royal-cart-tag">SPICE ROYALE</span>
                  <h3>{item.name}</h3>
                  <p>₹{item.price} per serving</p>

                  <div className="royal-quantity">
                    <button
                      onClick={() =>
                        dispatch(changeQuantity({
                          id: item.id,
                          quantity: item.quantity - 1
                        }))
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(changeQuantity({
                          id: item.id,
                          quantity: item.quantity + 1
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="royal-cart-item-actions">
                  <strong>₹{item.price * item.quantity}</strong>

                  <button
                    className="royal-remove-btn"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>

              </article>
            ))}

            <button
              className="royal-clear-cart"
              onClick={() => dispatch(clearCart())}
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>

          <aside className="royal-order-summary">
            <span className="royal-section-label">ORDER DETAILS</span>
            <h2>Order Summary</h2>

            <div className="royal-summary-row">
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>

            <div className="royal-summary-row">
              <span>Delivery Fee</span>
              <strong>
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </strong>
            </div>

            <p className="royal-delivery-note">
              {delivery === 0
                ? "You have unlocked free delivery!"
                : `Add ₹${499 - subtotal} more for free delivery.`}
            </p>

            <div className="royal-summary-total">
              <span>Total Amount</span>
              <strong>₹{total}</strong>
            </div>

            <Link
              to="/orders"
              className="royal-checkout-btn"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>

            <Link to="/menu" className="royal-continue-shopping">
              Continue Shopping
            </Link>
          </aside>

        </div>
      </div>
    </section>
  );
}

export default Cart;
