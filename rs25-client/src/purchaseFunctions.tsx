import { useState } from "react";
import { Purchase } from "./PurTableComponent";
export function usePurchaseFunctions() {
  const API_URL = "http://localhost:5000/api/Purchase";
  const API_URL_RECEIPT = "http://localhost:5000/api/Receipt";

  // eslint-disable-next-line
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPurchases() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createPurchase(purchases: Purchase[]) {
    for (const purchase of purchases) {
      const reimId = purchase.reimId ? purchase.reimId : "";
      const account = purchase.accountp;
      const description = purchase.descriptionp;
      const amount = Number(purchase.amountp);
      const purchasedate = new Date(purchase.datep).toISOString();
      const file = purchase.file;

      if (!account || !description || isNaN(amount) || !purchasedate || !file) {
        alert("Please fill in all fields correctly.");
        return false;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account,
            description,
            amount,
            purchasedate,
            reimId,
          }),
        });
        const formData = new FormData();
        formData.append("file", file);
        const purchaseId = (await response.json()).id;
        const responseFile = await fetch(`${API_URL}/upload/${purchaseId}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok || !responseFile.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await fetchPurchases();
      } catch (err: any) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    }
    return true;
  }

  async function deletePurchase(id: number) {
    try {
      const relatedReceipts = await fetch(`${API_URL_RECEIPT}/${id}`);
      if (!relatedReceipts.ok) {
        throw new Error(`HTTP error! status: ${relatedReceipts.status}`);
      }
      for (const receipt of await relatedReceipts.json()) {
        const response = await fetch(`${API_URL_RECEIPT}/${receipt.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      await fetchPurchases();
    }
  }

  async function updatePurchase() {
    const id = 0;
    const account = "";
    const description = "";
    const amount = 1;
    const purchasedate = new Date().toISOString();

    if (!account || !description || isNaN(amount) || !purchasedate) {
      alert("Please fill in all fields correctly.");
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(id),
          account,
          description,
          amount,
          purchasedate,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchPurchases();
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function fetchPurchaseByReimId(reimId: number) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${reimId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    error,
    fetchPurchases,
    createPurchase,
    deletePurchase,
    updatePurchase,
    fetchPurchaseByReimId,
  };
}
