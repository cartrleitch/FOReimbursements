import { useState } from "react";
import { Purchase } from "./PurTableComponent";
import React from "react";
import { toast } from "react-toastify";
export function usePurchaseFunctions() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const API_URL = `${apiUrl}/api/Purchase`;
  const API_URL_RECEIPT = `${apiUrl}/api/Receipt`;

  const [data] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasReceipt, setHasReceipt] = React.useState<string>("receipt");

  async function fetchPurchases() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

      console.log("hasReceipt:", hasReceipt);
      if (!account || !description || isNaN(amount) || !purchasedate) {
        toast.error("Please fill in all fields correctly.");
        return false;
      }
      setLoading(true);
      setError(null);
      try {
        // POST purchase data (not the file)
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            account,
            description,
            amount,
            purchasedate,
            reimId,
          }),
        });
        console.log("<---- Purchase Response status:", response);
        // if hasReceipt and file is uploaded, upload the file
        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          const purchaseId = (await response.json()).id;
          const responseFile = await fetch(`${API_URL}/upload/${purchaseId}`, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (!response.ok || !responseFile.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
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
      const relatedReceipts = await fetch(`${API_URL_RECEIPT}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!relatedReceipts.ok) {
        throw new Error(`HTTP error! status: ${relatedReceipts.status}`);
      }
      for (const receipt of await relatedReceipts.json()) {
        const response = await fetch(`${API_URL_RECEIPT}/${receipt.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      const response = await fetch(`${API_URL}/${reimId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

  async function getAISummary(fileBase64: string) {
    setLoading(true);
    setError(null);
    console.log(fileBase64);
    try {
      const response = await fetch(`${API_URL}/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(fileBase64),
      });
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
    getAISummary,
    hasReceipt,
    setHasReceipt,
  };
}
