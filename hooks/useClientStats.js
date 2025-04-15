import { useEffect, useState } from "react";

const useClientStats = (clients) => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalSpent: 0,
    avgSpent: 0,
    mostActiveClient: null,
  });

  useEffect(() => {
    if (!clients || clients.length === 0) return;

    try {
      const totalSpent = clients.reduce(
        (sum, client) => sum + (client.totalSpent || 0),
        0
      );
      const avgSpent = totalSpent / clients.length;
      const mostActiveClient = clients.reduce(
        (prev, current) =>
          (prev.invoiceCount || 0) > (current.invoiceCount || 0)
            ? prev
            : current,
        clients[0]
      );

      setStats({
        totalClients: clients.length,
        totalSpent,
        avgSpent,
        mostActiveClient,
      });
    } catch (error) {
      console.error("Error calculating client stats:", error);
    }
  }, [clients]);

  return stats;
};

export default useClientStats;
