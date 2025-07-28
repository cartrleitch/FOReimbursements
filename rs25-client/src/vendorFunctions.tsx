const API_URL = "http://localhost:5000/api/Vendor";

export async function fetchVendors() {
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
        const result = await response.json();
        return result;
    } catch (err: any) {
        console.error(`Failed to fetch vendors: ${err.message}`);
        throw err;
    }
}

export async function createVendor(vendorData: {
    name: string;
    address?: string;
    website?: string;
    city?: string;
    state?: string;
    zip?: string;
}) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(vendorData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (err: any) {
        console.error(`Failed to create vendor: ${err.message}`);
        throw err;
    }
}

export function useVendorFunctions() {
    return { fetchVendors, createVendor };
}