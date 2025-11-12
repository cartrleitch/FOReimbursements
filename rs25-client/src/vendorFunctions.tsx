const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/api/Vendor`;

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

export async function fetchVendorByID(vendorID: number) {
    try {
        const response = await fetch(`${API_URL}/${vendorID}`, {
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
        console.error(`Failed to fetch vendor by ID: ${err.message}`);
        throw err;
    }
}

export async function createVendor(vendorData: {
    name: string;
    address?: string;
    website?: string;
    city?: string;
    state?: string;
    zipCode?: string;
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