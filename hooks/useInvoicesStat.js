import { useMemo } from "react";

const useInvoiceStats = (invoices) => {
  return useMemo(() => {
    return invoices.reduce(
      (stats, invoice) => {
        stats.total += 1;
        if (invoice.status === "paid") {
          stats.paid += 1;
          stats.totalValue += parseFloat(invoice.total || 0);
        } else if (invoice.status === "pending") {
          stats.pending += 1;
        } else if (invoice.status === "overdue") {
          stats.overdue += 1;
        }
        return stats;
      },
      { total: 0, paid: 0, pending: 0, overdue: 0, totalValue: 0 }
    );
  }, [invoices]);
};

export default useInvoiceStats;
