import { useState } from 'react';

export function usePurchaseFunctions() {
    const API_URL = 'http://localhost:5000/api/Purchase';
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchPurchases() {
        setLoading(true);
        setError(null);
        console.log('fetchPurchases triggered');
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (err: any) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    async function createPurchase() {
        const account = "";
        const description = "";
        const amount = 1;
        const purchasedate = new Date().toISOString();

        if (!account || !description || isNaN(amount) || !purchasedate) {
            alert('Please fill in all fields correctly.');
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
                    purchasedate
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchPurchases();
        }
        catch (err: any) {
            setError(err.message);
            return false
        }
        finally {
            setLoading(false);
        }
    }

    async function deletePurchase(id: number) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (err: any) {
            setError(err.message);
        }
        finally {
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
            alert('Please fill in all fields correctly.');
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
                    purchasedate
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchPurchases();
        }
        catch (err: any) {
            setError(err.message);
            return false
        }
        finally {
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
        updatePurchase
    };
}