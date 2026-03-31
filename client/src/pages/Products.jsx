import {
  Form,
  redirect,
  useLoaderData,
  useNavigation,
  useRevalidator,
} from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useState } from "react";
import { Check, X } from "lucide-react";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/products");
    return data || { products: [] };
  } catch (error) {
    console.error("Failed to load products data:", error);
    return { products: [] };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/products", data);
    toast.success("Product added successfully");
    return null;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.msg ??
      error?.response?.data?.error?.[0] ??
      "Failed to add product";
    toast.error(errorMessage);
    return error;
  }
};

const Products = () => {
  const { products = [] } = useLoaderData() || {};
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const revalidator = useRevalidator();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  /* =========================
     OPEN EDIT MODAL
  ========================= */
  const handleEdit = async (id) => {
    if (!id) return;

    try {
      const { data } = await customFetch.get(`/products/${id}`);
      const product = data?.product || {};

      setSelectedProductId(id);
      setFormData({
        name: product.name || "",
        price: product.price || "",
        quantity: product.quantity || "",
        category: product.category || "",
      });

      setIsEditModalOpen(true);
    } catch (error) {
      toast.error("Failed to load product details");
    }
  };

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     UPDATE PRODUCT
  ========================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;

    setIsEditing(true);
    try {
      await customFetch.patch(`/products/${selectedProductId}`, formData);
      toast.success("Product updated successfully");
      setIsEditModalOpen(false);
      revalidator.revalidate();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.msg ??
        error?.response?.data?.error?.[0] ??
        "Failed to update product";
      toast.error(errorMessage);
    } finally {
      setIsEditing(false);
    }
  };

  /* =========================
     OPEN DELETE MODAL
  ========================= */
  const handleOpenDeleteModal = (id) => {
    if (!id) return;
    setSelectedProductId(id);
    setIsDeleteModalOpen(true);
  };

  /* =========================
     DELETE PRODUCT
  ========================= */
  const handleDelete = async () => {
    if (!selectedProductId) return;

    setIsDeleting(true);
    try {
      await customFetch.delete(`/products/${selectedProductId}`);
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      revalidator.revalidate();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.msg ??
        error?.response?.data?.error?.[0] ??
        "Failed to delete product";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="products-page">
      <h2 className="page-title">Products</h2>

      {/* FORM */}
      <Form method="post" className="product-form">
        <h3 className="form-heading">Add Product</h3>

        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="form-input dark"
            required
          />

          <input
            type="float"
            name="price"
            placeholder="Price"
            className="form-input dark"
            required
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            className="form-input dark"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            className="form-input dark"
            required
          />

          <button type="submit" className="btn primary-btn">
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </Form>

      {/* TABLE */}
      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {!Array.isArray(products) || products.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty">
                  No products available
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr key={item?.id || Math.random()}>
                  <td>{item?.name ?? "Unnamed"}</td>
                  <td>{item?.category ?? "-"}</td>
                  <td>
                    ₵
                    {item?.price != null
                      ? parseFloat(item.price).toFixed(2)
                      : "0.00"}
                  </td>
                  <td>{item?.quantity ?? 0}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => handleEdit(item?.id)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleOpenDeleteModal(item?.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsEditModalOpen(false)}
        >
          <form
            className="modal-form"
            onSubmit={handleUpdate}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-grid">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Product Name"
                  className="form-input dark"
                  onChange={handleChange}
                />
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  placeholder="Price"
                  className="form-input dark"
                  onChange={handleChange}
                />
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  placeholder="Quantity"
                  className="form-input dark"
                  onChange={handleChange}
                />
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  placeholder="Category"
                  className="form-input dark"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="submit"
                className="modal-save-btn"
                disabled={isEditing}
              >
                <Check size={16} />{" "}
                {isEditing ? "Editing Product..." : "Edit Product"}
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="modal-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p>Are you sure you want to delete this product?</p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={handleDelete}
                className="modal-save-btn"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="modal-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
