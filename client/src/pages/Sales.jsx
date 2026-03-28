import { redirect, useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFetch";
import dayjs from "dayjs";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/sales");
    return data;
  } catch (error) {
    return redirect("/dashboard/pos");
  }
};

const Sales = () => {
  const { sales } = useLoaderData();

  return (
    <div className="sales-page">
      <h2 className="page-title">Sales</h2>

      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Cash</th>
              <th>Change</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  No sales yet
                </td>
              </tr>
            )}

            {sales.map((sale) => {
              const formattedDate = dayjs(sale.createdAt).format("YYYY-MM-DD");
              return (
                <tr key={sale.id}>
                  <td>{formattedDate}</td>
                  <td>${parseFloat(sale.totalAmount).toFixed(2)}</td>
                  <td>{sale.paymentMethod}</td>
                  <td>${parseFloat(sale.cashGiven).toFixed(2)}</td>
                  <td>${parseFloat(sale.change).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
