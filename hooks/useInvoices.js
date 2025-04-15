import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/init";
import { useSession } from "next-auth/react";

const useInvoices = () => {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!session?.user?.id) return;

      try {
        const invoicesRef = collection(db, "invoices");
        const q = query(invoicesRef, where("user_id", "==", session.user.id));
        const querySnapshot = await getDocs(q);

        const invoiceList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setInvoices(invoiceList);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchInvoices();
    }
  }, [session]);

  return { invoices, isLoading };
};

export default useInvoices;
