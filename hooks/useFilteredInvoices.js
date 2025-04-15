import { useMemo } from "react";

const useFilteredInvoices = (invoices, yearFilter) => {
  return useMemo(() => {
    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.created_at);
      return invoiceDate.getFullYear().toString() === yearFilter;
    });
  }, [invoices, yearFilter]);
};

export default useFilteredInvoices;
