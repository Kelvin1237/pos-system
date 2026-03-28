import { Form, redirect, useLoaderData, useNavigation } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/products");
    return data;
  } catch (error) {
    return redirect("/dashboard/admin");
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/products", data);
    toast.success("Product added successfully");
    return;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.msg ?? error?.response?.data?.error?.[0];
    toast.error(errorMessage);
    return error;
  }
};

const Products = () => {
  const { products } = useLoaderData();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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
            type="number"
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
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>${parseFloat(item.price).toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td className="actions">
                  <button className="edit-btn">Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
