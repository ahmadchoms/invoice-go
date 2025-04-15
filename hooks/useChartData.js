import { useMemo } from "react";

const useChartData = (filteredInvoices, invoices, yearFilter) => {
  return useMemo(() => {
    const monthlyData = Array(12)
      .fill()
      .map((_, i) => ({
        name: new Date(0, i).toLocaleString("id-ID", { month: "short" }),
        total: 0,
        previous: 0,
        count: 0,
      }));

    const statusData = [
      { name: "Paid", value: 0 },
      { name: "Pending", value: 0 },
      { name: "Overdue", value: 0 },
    ];

    filteredInvoices.forEach((invoice) => {
      if (!invoice.created_at) return;

      const month = new Date(invoice.created_at).getMonth();
      const total = parseFloat(invoice.total || 0);

      monthlyData[month].total += total;
      monthlyData[month].count += 1;

      if (invoice.status === "paid") {
        statusData[0].value += 1;
      } else if (invoice.status === "pending") {
        statusData[1].value += 1;
      } else if (invoice.status === "overdue") {
        statusData[2].value += 1;
      }
    });

    const previousYear = parseInt(yearFilter) - 1;
    invoices.forEach((invoice) => {
      if (!invoice.created_at) return;

      const invoiceDate = new Date(invoice.created_at);
      if (invoiceDate.getFullYear() === previousYear) {
        const month = invoiceDate.getMonth();
        const total = parseFloat(invoice.total || 0);
        monthlyData[month].previous += total;
      }
    });

    return { monthlyData, statusData };
  }, [filteredInvoices, invoices, yearFilter]);
};

export default useChartData;
