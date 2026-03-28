import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockProducts = [
  { id: 1, name: "Rice", price: 20 },
  { id: 2, name: "Milk", price: 15 },
  { id: 3, name: "Bread", price: 10 },
  { id: 4, name: "Sugar", price: 8 },
];

const POS = () => {
  const [cart, setCart] = useState([]);
  const [cashGiven, setCashGiven] = useState("");

  const navigate = useNavigate();

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0), // Remove item if qty goes to 0
    );
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const change = cashGiven ? cashGiven - total : 0;

  const handleCheckout = () => {
    if (!cart.length) return alert("Cart is empty!");
    if (!cashGiven || cashGiven < total) return alert("Insufficient cash!");

    const saleData = {
      id: Date.now(), // unique sale ID
      date: new Date().toLocaleString(),
      cashier: "John Doe",
      items: cart,
      subtotal: total,
      totalAmount: total,
      cashGiven: Number(cashGiven),
      change: Number(cashGiven) - total,
    };

    // Save sale data in localStorage (or context / backend)
    localStorage.setItem("latestSale", JSON.stringify(saleData));

    // Clear cart and cash input
    setCart([]);
    setCashGiven("");

    // Redirect to receipt page
    navigate("/dashboard/receipt");
  };

  return (
    <div className="pos-page">
      <div className="pos-container">
        {/* LEFT PANEL */}
        <div className="pos-left">
          <input
            type="text"
            placeholder="Search products..."
            className="pos-search"
          />

          <div className="product-list">
            {mockProducts.map((product) => (
              <div key={product.id} className="product-row">
                <span>{product.name}</span>
                <span>${product.price}</span>
                <button className="add-btn" onClick={() => addToCart(product)}>
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="pos-right">
          <h3 className="cart-title">Cart</h3>

          <div className="cart-items">
            {cart.length === 0 && <p className="empty">No items yet</p>}

            {cart.map((item) => (
              <div key={item.id} className="cart-row">
                <span>{item.name}</span>

                {/* Quantity Controls */}
                <div className="qty-controls">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>

                <span
                  style={{
                    fontSize: "1rem",
                    marginTop: "0.2rem",
                    marginLeft: "1rem",
                  }}
                >
                  ${item.price * item.qty}
                </span>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <input
              type="number"
              placeholder="Cash given"
              value={cashGiven}
              onChange={(e) => setCashGiven(e.target.value)}
              className="cash-input"
            />

            <div className="summary-row">
              <span>Change</span>
              <span>${change}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
