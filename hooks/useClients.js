import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/init";
import { useSession } from "next-auth/react";

const useClients = () => {
  const { data: session } = useSession();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const clientsRef = collection(db, "clients");
      const q = query(clientsRef, where("user_id", "==", session.user.id));
      const querySnapshot = await getDocs(q);

      const clientList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setClients(clientList);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const addClient = async (clientData) => {
    try {
      const clientsRef = collection(db, "clients");
      const newClientRef = await addDoc(clientsRef, clientData);

      await updateDoc(doc(db, "clients", newClientRef.id), {
        id: newClientRef.id,
      });

      await fetchClients();

      return newClientRef;
    } catch (error) {
      console.error("Error adding client:", error);
      throw error;
    }
  };

  const updateClient = async (clientId, updateData) => {
    try {
      const clientRef = doc(db, "clients", clientId);
      await updateDoc(clientRef, updateData);

      await fetchClients();
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, [session, fetchClients]);

  return {
    clients,
    isLoading,
    addClient,
    updateClient,
    refreshClients: fetchClients,
  };
};

export default useClients;
