import { useState, useEffect } from "react";

const useFilteredClients = (clients) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState(clients);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (client.company &&
            client.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  return { searchTerm, setSearchTerm, filteredClients };
};

export default useFilteredClients;
