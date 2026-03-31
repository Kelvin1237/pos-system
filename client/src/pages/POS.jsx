import { useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/products");
    return data || { products: [] };
  } catch (error) {
    console.error("Failed to load products data:", error);
    return { products: [] };
  }
};

const POS = () => {
  const { products = [] } = useLoaderData() || {};

  const [cart, setCart] = useState([]);
  const [cashGiven, setCashGiven] = useState("");
  const [search, setSearch] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const navigate = useNavigate();

  /* =========================
     FILTERED PRODUCTS
  ========================= */
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product?.name?.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  /* =========================
     CART FUNCTIONS
  ========================= */
  const addToCart = (product) => {
    if (!product?.id) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }

      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0),
    );
  };

  /* =========================
     CALCULATIONS
  ========================= */
  const total = cart.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.qty || 0),
    0,
  );

  const change = cashGiven ? Number(cashGiven) - total : 0;

  /* =========================
     CHECKOUT
  ========================= */
  const handleCheckout = async () => {
    if (!cart.length) {
      toast.error("Cart is empty!");
      return;
    }

    if (!cashGiven || Number(cashGiven) < total) {
      toast.error("Insufficient cash!");
      return;
    }

    try {
      setIsCheckingOut(true);

      const saleData = {
        cashGiven: Number(cashGiven),
        items: cart.map((item) => ({
          productId: item?.id,
          quantity: item?.qty,
        })),
      };

      await customFetch.post("/sales", saleData);

      toast.success("Sale completed successfully");

      setCart([]);
      setCashGiven("");

      navigate("/dashboard/receipt");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.msg ??
        error?.response?.data?.error ??
        "Checkout failed";

      toast.error(errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="product-list">
            {!Array.isArray(filteredProducts) ||
            filteredProducts.length === 0 ? (
              <p className="empty">No products found</p>
            ) : (
              filteredProducts.map((product) => (
                <div key={product?.id || Math.random()} className="product-row">
                  <span>{product?.name ?? "Unnamed"}</span>
                  <span>
                    ₵
                    {product?.price != null
                      ? parseFloat(product.price).toFixed(2)
                      : "0.00"}
                  </span>
                  <button
                    className="add-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="pos-right">
          <h3 className="cart-title">Cart</h3>

          <div className="cart-items">
            {!cart.length && <p className="empty">No items yet</p>}

            {cart.map((item) => (
              <div key={item?.id || Math.random()} className="cart-row">
                <span>{item?.name ?? "Unnamed"}</span>

                <div className="qty-controls">
                  <button onClick={() => decreaseQty(item?.id)}> - </button>
                  <span>{item?.qty || 0}</span>
                  <button onClick={() => increaseQty(item?.id)}> + </button>
                </div>

                <span
                  style={{
                    fontSize: "1rem",
                    marginTop: "0.2rem",
                    marginLeft: "1rem",
                  }}
                >
                  ₵
                  {item?.price != null && item?.qty != null
                    ? (item.price * item.qty).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Total</span>
              <span>₵{total.toFixed(2)}</span>
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
              <span>₵{change.toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
