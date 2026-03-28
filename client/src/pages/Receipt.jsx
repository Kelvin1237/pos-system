import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Receipt = () => {
  const [sale, setSale] = useState(null);

  useEffect(() => {
    const latestSale = JSON.parse(localStorage.getItem("latestSale"));
    if (latestSale) setSale(latestSale);
  }, []);

  const handleDownload = () => {
    const input = document.getElementById("receipt");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${sale.id}.pdf`);
    });
  };

  if (!sale) return <p>No sale found!</p>;

  return (
    <div className="receipt-page">
      <div id="receipt" className="receipt-container">
        <h2>Receipt</h2>
        <p>Date: {sale.date}</p>
        <p>Cashier: {sale.cashier}</p>

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
            {sale.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>${item.price}</td>
                <td>${item.price * item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>Subtotal: ${sale.subtotal}</p>
        <p>Cash Given: ${sale.cashGiven}</p>
        <p>Change: ${sale.change}</p>
        <p>Total: ${sale.totalAmount}</p>
      </div>
      <div className="receipt-btn-div">
        <button className="btn-download">Print PDF</button>
        <button onClick={handleDownload} className="btn-download">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Receipt;
