import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import customFetch from "../utils/customFetch";
import { useDashboardContext } from "./DashboardLayout";

const Receipt = () => {
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useDashboardContext();

  useEffect(() => {
    const fetchLatestSale = async () => {
      try {
        setLoading(true);

        const { data } = await customFetch.get("/sales/my-sales");

        const sales = Array.isArray(data?.sales) ? data.sales : [];

        if (sales.length === 0) {
          setSale(null);
          return;
        }

        // ✅ Sort newest first
        const sortedSales = [...sales].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setSale(sortedSales[0]);
      } catch (error) {
        console.error("Failed to fetch latest sale:", error);
        setSale(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSale();
  }, []);

  const handleDownload = async () => {
    const input = document.getElementById("receipt");
    if (!input) return;

    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${sale?.id || "latest"}.pdf`);
    } catch (error) {
      console.error("Failed to download receipt:", error);
    }
  };

  if (loading) return <p>Loading receipt...</p>;
  if (!sale) return <p>No sale found!</p>;

  return (
    <div className="receipt-page">
      <div id="receipt" className="receipt-container">
        <h2>Receipt</h2>

        <p>
          Date:{" "}
          {sale?.createdAt
            ? `${new Date(sale.createdAt).toLocaleDateString()} ${new Date(
                sale.createdAt,
              ).toLocaleTimeString()}`
            : "N/A"}
        </p>

        <p>Cashier: {user?.fullName || "Unknown"}</p>

        <p>Payment Method: {sale?.paymentMethod || "Unknown"}</p>

        {sale?.paymentMethod !== "CASH" && sale?.paymentReference && (
          <p>Payment Reference: {sale.paymentReference}</p>
        )}

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(sale?.SalesItems) && sale.SalesItems.length > 0 ? (
              sale.SalesItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item?.Product?.name || "Item"}</td>
                  <td>{item?.quantity ?? 0}</td>
                  <td>
                    ₵
                    {item?.price != null
                      ? Number(item.price).toFixed(2)
                      : "0.00"}
                  </td>
                  <td>
                    ₵
                    {item?.price != null && item?.quantity != null
                      ? (Number(item.price) * Number(item.quantity)).toFixed(2)
                      : "0.00"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <p>
          Total: ₵
          {sale?.totalAmount != null
            ? Number(sale.totalAmount).toFixed(2)
            : "0.00"}
        </p>

        <p>
          {sale?.paymentMethod === "CASH" ? "Cash Given" : "Amount Paid"}: ₵
          {sale?.cashGiven != null ? Number(sale.cashGiven).toFixed(2) : "0.00"}
        </p>

        <p>
          Change: ₵
          {sale?.change != null ? Number(sale.change).toFixed(2) : "0.00"}
        </p>
      </div>

      <div className="receipt-btn-div">
        <button className="btn-download" onClick={() => window.print()}>
          Print PDF
        </button>

        <button onClick={handleDownload} className="btn-download">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Receipt;
