import React, { useState } from 'react';
import './App.css';

function App() {
    const API_URL = "http://localhost:5000/api/Reimbursement";
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // GET reimbursements from the API
    async function fetchReimbursements() {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // POST a new reimbursement to the API
    async function createReimbursement() {
        const vendor = (document.getElementById("vendor") as HTMLInputElement).value;
        const vendorAddress = (document.getElementById("vendoraddress") as HTMLInputElement).value;
        const vendorWebsite = (document.getElementById("vendorwebsite") as HTMLInputElement).value;
        const total = parseFloat((document.getElementById("total") as HTMLInputElement).value);
        const dateSubmittedIn = (document.getElementById("datesubmitted") as HTMLInputElement).value;
        const paymentMethod = (document.getElementById("paymentmethod") as HTMLSelectElement).value;

        const dateSubmitted = new Date(dateSubmittedIn).toISOString();

        if (!vendor || !vendorAddress || !vendorWebsite || isNaN(total) || !dateSubmitted) {
            alert("Please fill in all fields correctly. " + dateSubmitted);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vendor,
                    vendorAddress,
                    vendorWebsite,
                    total,
                    dateSubmitted,
                    paymentMethod
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchReimbursements();
            alert("Reimbursement created successfully!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // DELETE a reimbursement by ID
    async function DeleteReimbursement() {
        const id = (document.getElementById("deleteId") as HTMLInputElement).value;
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.status;
                })
        }
        catch (err: any) {
            setError(err.message);
        }
    }

  return (
      <div className="App">
          <div>
              <h1>Create Reimbursement</h1>
              <form>
                  <label htmlFor="vendor">Vendor: </label>
                  <input type="text" id="vendor" placeholder="Vendor" />
                  <br />
                  <label htmlFor="vendoraddress">Vendor Address: </label>
                  <input type="text" id="vendoraddress" placeholder="Vendor Address" />
                  <br />
                  <label htmlFor="vendorwebsite">Vendor Website: </label>
                  <input type="text" id="vendorwebsite" placeholder="Vendor Website" />
                  <br />
                  <label htmlFor="total">Total Amount: </label>
                  <input type="number" id="total" placeholder="Total Amount" />
                  <br />
                  <label htmlFor="datesubmitted">Date Submitted: </label>
                  <input type="date" id="datesubmitted" placeholder="Date Submitted" />
                  <br />
                  <label htmlFor="paymentmethod">Payment Method: </label>
                  <select id="paymentmethod">
                        <option value="Credit Card">Credit Card</option>
                        <option value="Cash">Cash</option>
                        <option value="Check">Check</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  <br />
                  <button type="button" onClick={createReimbursement}>Submit</button>
              </form>
              <button onClick={fetchReimbursements} disabled={loading}>
                  {loading ? "Loading..." : "Fetch Reimbursements"}
              </button>
              <br />
              <input type="number" id="deleteId" placeholder="Enter ID to delete" />
              <br />
              <button type="button" onClick={DeleteReimbursement}>Delete</button>
          </div>
      </div>
  );
}

export default App;
