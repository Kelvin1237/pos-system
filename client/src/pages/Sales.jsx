import { redirect, useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFetch";
import dayjs from "dayjs";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/sales");
    return data;
  } catch (error) {
    console.error("Failed to load sales data:", error);
    return redirect("/dashboard/pos");
  }
};

const Sales = () => {
  const data = useLoaderData();
  const sales = Array.isArray(data?.sales) ? data.sales : [];

  return (
    <div className="sales-page">
      <h2 className="page-title">Sales</h2>

      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Cash</th>
              <th>Change</th>
              <th>Points Earned</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty">
                  No sales yet
                </td>
              </tr>
            ) : (
              sales.map((sale) => {
                const formattedDate = sale?.createdAt
                  ? dayjs(sale.createdAt).format("YYYY-MM-DD")
                  : "N/A";

                const pointsEarned = Math.floor(
                  Number(sale?.totalAmount || 0) / 10,
                );
                return (
                  <tr key={sale?.id || Math.random()}>
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
                    <td>{sale?.Customer?.fullName || "Walk-in Customer"}</td>
                    <td>{sale?.paymentMethod || "N/A"}</td>
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
                    <td>{sale?.Customer ? `${pointsEarned} pts` : "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
