import React, { useState } from 'react';
import './App.css';

function App() {
    const API_URL = "http://localhost:5000/api/Reimbursement";
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

  return (
      <div className="App">

      </div>
  );
}

export default App;
