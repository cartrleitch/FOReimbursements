import { useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export function useApplicationUserFunctions() {
  const [data, setData] = useState<any[]>([]);

  async function fetchAppUsers() {
    const API_URL = `${apiUrl}/api/ApplicationUser`;

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
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error("Failed to fetch application users:", err);
    }
  }

  async function fetchAppUserById(userId: string) {
    const API_URL = `${apiUrl}/api/ApplicationUser/${userId}`;

    return fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch((err) => {
        console.error("Failed to fetch application user:", err);
        throw err;
      });
  }
  async function createAppUser(userData: {
    emailAddress: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }) {
    const API_URL = `${apiUrl}/api/ApplicationUser`;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newUser = await response.json();
      setData((prevData) => [...prevData, newUser]);
    } catch (err) {
      console.error("Failed to create application user:", err);
      throw err;
    }
  }

  async function updateAppUser(
    userId: string,
    updatedData: {
      id?: string;
      emailAddress?: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    },
  ) {
    const API_URL = `${apiUrl}/api/ApplicationUser/${userId}`;
    console.log("Updating application user with ID:", userId);
    console.log("Updated data:", updatedData);
    return fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch((err) => {
        console.error("Failed to update application user:", err);
        throw err;
      });
  }

  async function deleteAppUser(userId: string) {
    const API_URL = `${apiUrl}/api/ApplicationUser/${userId}`;
    try {
      const result = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      setData((prevData) => prevData.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Failed to delete application user:", err);
      throw err;
    }
  }

  return {
    data,
    fetchAppUsers,
    fetchAppUserById,
    createAppUser,
    updateAppUser,
    deleteAppUser,
  };
}
