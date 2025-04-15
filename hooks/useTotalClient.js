import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useClients from "./useClients";
import useInvoices from "./useInvoices";

export function useTotalClients() {
  const { data: session } = useSession();
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const [totalClients, setTotalClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!session?.user?.id || clients.length === 0) return;

      try {
        const clientsMap = new Map(
          clients.map((client) => [
            client.id,
            { ...client, invoiceCount: 0, totalSpent: 0, lastInvoice: null },
          ])
        );

        invoices.forEach((invoice) => {
          const clientId = invoice.client_id;

          if (clientsMap.has(clientId)) {
            const client = clientsMap.get(clientId);
            client.invoiceCount += 1;
            client.totalSpent += invoice.total || 0;

            if (
              !client.lastInvoice ||
              new Date(invoice.created_at) > new Date(client.lastInvoice)
            ) {
              client.lastInvoice = invoice.created_at;
              client.lastInvoiceStatus = invoice.status;
            }
          }
        });

        const totalClientsList = Array.from(clientsMap.values());
        totalClientsList.sort((a, b) => {
          if (!a.lastInvoice && !b.lastInvoice) return 0;
          if (!a.lastInvoice) return 1;
          if (!b.lastInvoice) return -1;
          return new Date(b.lastInvoice) - new Date(a.lastInvoice);
        });

        setTotalClients(totalClientsList);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [session, clients, invoices]);

  return { totalClients, isLoading };
}
