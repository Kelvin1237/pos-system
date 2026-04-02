import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

/* =========================
   LOADER TO FETCH CUSTOMERS
========================= */
export const loader = async () => {
  try {
    const { data } = await customFetch.get("/customers");
    return data.customers || [];
  } catch (error) {
    console.error("Failed to load customers:", error);
    return [];
  }
};

const Customers = () => {
  const initialCustomers = useLoaderData(); // loader data
  const [customers, setCustomers] = useState(initialCustomers || []);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();

  /* =========================
     HANDLE SEARCH (FRONTEND)
  ========================= */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = initialCustomers.filter((customer) => {
      const searchStr = value.toLowerCase();
      return (
        customer.fullName.toLowerCase().includes(searchStr) ||
        (customer.email?.toLowerCase().includes(searchStr) ?? false) ||
        (customer.phone?.toLowerCase().includes(searchStr) ?? false)
      );
    });

    setCustomers(filtered);
  };

  /* =========================
     HANDLE ADD CUSTOMER
  ========================= */
  const handleAddCustomer = async (e) => {
    e.preventDefault(); // prevent form submission reload
    const { fullName, email, phone } = newCustomer;

    try {
      const { data } = await customFetch.post("/customers", {
        fullName,
        phone,
        email: email || null,
      });

      if (!data?.customer) throw new Error("Invalid response from server");

      toast.success(`Customer "${data.customer.fullName}" added successfully`);

      // Add the new customer to the local state
      setCustomers((prev) => [data.customer, ...prev]);

      // Clear form
      setNewCustomer({ fullName: "", email: "", phone: "" });
      setSearch(""); // Reset search

      navigate("/dashboard/customers"); // Ensure we stay on the customers page
    } catch (error) {
      const errorMessage =
        error?.response?.data?.msg ??
        error?.response?.data?.error?.[0] ??
        "Failed to add customer";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <div className="customers-page">
      <h2 className="page-title">Customer Management</h2>

      {/* ADD NEW CUSTOMER FORM */}
      <form className="add-customer-form" onSubmit={handleAddCustomer}>
        <input
          type="text"
          placeholder="Full Name"
          value={newCustomer.fullName}
          onChange={(e) =>
            setNewCustomer((prev) => ({ ...prev, fullName: e.target.value }))
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newCustomer.email}
          onChange={(e) =>
            setNewCustomer((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Phone"
          value={newCustomer.phone}
          onChange={(e) =>
            setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))
          }
          required
        />
        <button type="submit">Add Customer</button>
      </form>

      {/* SEARCH */}
      <div className="customer-search">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="customers-table-wrapper">
        {loading ? (
          <p>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p>No customers found</p>
        ) : (
          <div className="sales-container">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Loyalty Points</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.fullName}</td>
                    <td>{customer.email || "-"}</td>
                    <td>{customer.phone || "-"}</td>
                    <td>{customer.loyaltyPoints || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
