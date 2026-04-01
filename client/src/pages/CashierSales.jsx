import { redirect, useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFetch";
import dayjs from "dayjs";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/sales/my-sales");
    return data || { sales: [] };
  } catch (error) {
    console.error("Failed to load sales data:", error);
    return { sales: [] };
  }
};

const CashierSales = () => {
  const { sales = [] } = useLoaderData() || {};

  return (
    <div className="sales-page">
      <h2 className="page-title">Sales</h2>

      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Cash</th>
              <th>Change</th>
            </tr>
          </thead>

          <tbody>
            {(!Array.isArray(sales) || sales.length === 0) && (
              <tr>
                <td colSpan="5" className="empty">
                  No sales yet
                </td>
              </tr>
            )}

            {Array.isArray(sales) &&
              sales.map((sale) => {
                const formattedDate = sale?.createdAt
                  ? dayjs(sale.createdAt).format("YYYY-MM-DD")
                  : "N/A";
                return (
                  <tr key={sale?.id || sale?._id}>
                    <td>
                      {sale?.paymentMethod === "CASH"
                        ? "N/A"
                        : sale?.paymentReference}
                    </td>
                    <td>{formattedDate}</td>
                    <td>
                      ₵
                      {sale?.totalAmount != null
                        ? parseFloat(sale.totalAmount).toFixed(2)
                        : "0.00"}
                    </td>
                    <td>{sale?.paymentMethod ?? "N/A"}</td>
                    <td>
                      ₵
                      {sale?.cashGiven != null
                        ? parseFloat(sale.cashGiven).toFixed(2)
                        : "0.00"}
                    </td>
                    <td>
                      ₵
                      {sale?.change != null
                        ? parseFloat(sale.change).toFixed(2)
                        : "0.00"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashierSales;
