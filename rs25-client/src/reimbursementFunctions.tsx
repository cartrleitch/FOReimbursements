import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
export function useReimbursementFunctions() {
  const API_URL = "http://localhost:5000/api/Reimbursement";
  const API_URL_PURCHASE = "http://localhost:5000/api/Purchase";
  const API_URL_RECEIPT = "http://localhost:5000/api/Receipt";
  // eslint-disable-next-line
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
    const [error, setError] = useState<string | null>(null);
    const [userOrVendor, setUserOrVendor] = useState<string>("user");
    const [actionRequested, setActionRequested] = useState<string>("reimbursement");

    const auth = useAuth();

    async function fetchReimbursements() {
    setLoading(true);
    setError(null);
    console.log("fetchReimbursements triggered");
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // POST a new reimbursement to the API
    async function createReimbursement() {
        var userOrVendor;
        if (userOrVendor === "user") {
            userOrVendor = auth?.user?.id;
        }
        else if (userOrVendor === "vendor") {
            // create vendor using data from the form then get the id and assign it to userOrVendor
            const vendorName = (document.getElementById("vendorName") as HTMLInputElement).value;
            const vendorAddress = (document.getElementById("vendorAddress") as HTMLInputElement).value;
            const vendorWebsite = (document.getElementById("vendorWebsite") as HTMLInputElement).value;
            const vendorCity = (document.getElementById("vendorCity") as HTMLInputElement).value;
            const vendorState = (document.getElementById("vendorState") as HTMLInputElement).value;
            const vendorZip = (document.getElementById("vendorZipCode") as HTMLInputElement).value;
        }
        else {
            return -1;
        }
        const actionReq = actionRequested;
    const totalAmount = parseFloat(
      (document.getElementById("totalamount") as HTMLInputElement).value
    );
    
    const dateSubmitted : string  = new Date().toISOString();
    
    if (
      isNaN(totalAmount) ||
      !dateSubmitted
    ) {
      console.log(dateSubmitted);
      // If any field is empty or invalid, show an error message
      toast.error("Please fill in all fields correctly.");
      return -1;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
          body: JSON.stringify({
          actionRequested,
          totalAmount,
          dateSubmitted,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        const result = await response.json();
        console.log(result);
      await fetchReimbursements();
      return result;
    } catch (err: any) {
      setError(err.message);
      return -1;
    } finally {
      setLoading(false);
    }
  }

  // DELETE a reimbursement by ID
  async function deleteReimbursement(id: number) {
    try {
      setLoading(true);
      setError(null);
        const relatedPurchases = await fetch(`${API_URL_PURCHASE}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });
      if (!relatedPurchases.ok) {
        throw new Error(`HTTP error! status: ${relatedPurchases.status}`);
      }
      for (const purchase of await relatedPurchases.json()) {
        // Delete related receipts first
        try {
          const relatedReceipt = await fetch(
              `${API_URL_RECEIPT}/${purchase.id}`
              , {
                  method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
              }
          );
          if (!relatedReceipt.ok) {
            throw new Error(`HTTP error! status: ${relatedReceipt.status}`);
          }
          const relatedRecId = (await relatedReceipt.json())[0].id;
          const responseRec = await fetch(
            `${API_URL_RECEIPT}/${relatedRecId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
          );
          if (!responseRec.ok) {
            throw new Error(`HTTP error! status: ${responseRec.status}`);
          }
        } catch (err: any) {
          console.error(
            `Failed to delete receipt for purchase ${purchase.id}: ${err.message}`
          );
        }

        // Then delete the purchase
        const response = await fetch(`${API_URL_PURCHASE}/${purchase.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      // Finally, delete the reimbursement
      const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Reimbursement deleted successfully");
      await fetchReimbursements();
    } catch (err: any) {
      setError(err.message);
    }
  }

  // PUT a new reimbursement to the API
  async function updateReimbursement() {
    const id = (document.getElementById("updateId") as HTMLInputElement).value;
    const vendor = (document.getElementById("vendoru") as HTMLInputElement)
      .value;
    const vendorAddress = (
      document.getElementById("vendoraddressu") as HTMLInputElement
    ).value;
    const vendorWebsite = (
      document.getElementById("vendorwebsiteu") as HTMLInputElement
    ).value;
    const totalAmount = parseFloat(
      (document.getElementById("totalamountu") as HTMLInputElement).value
    );
    const dateSubmittedIn = (
      document.getElementById("datesubmittedu") as HTMLInputElement
    ).value;
    const paymentMethod = (
      document.getElementById("paymentmethodu") as HTMLSelectElement
    ).value;

    const dateSubmitted = new Date(dateSubmittedIn).toISOString();

    if (
      !vendor ||
      !vendorAddress ||
      !vendorWebsite ||
      isNaN(totalAmount) ||
      !dateSubmitted
    ) {
      alert("Please fill in all fields correctly. " + dateSubmitted);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          id: Number(id),
          vendor,
          vendorAddress,
          vendorWebsite,
          totalAmount,
          dateSubmitted,
          paymentMethod,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchReimbursements();
      alert("Reimbursement updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // This hook is used to manage the state and functions related to reimbursements.
  // It includes fetching, creating, updating, and deleting reimbursements.
  return {
    data,
    loading,
    error,
    fetchReimbursements,
    createReimbursement,
    updateReimbursement,
      deleteReimbursement,
      userOrVendor,
      setUserOrVendor,
      actionRequested,
      setActionRequested,
  };
}
