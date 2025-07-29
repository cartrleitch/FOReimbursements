import { toast } from "react-toastify";

export function useEmailFunctions() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const API_URL = `${apiUrl}/api/Email/send`;

  async function sendEmail(emailData: {
    to: string;
    subject: string;
    content: string;
  }) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(emailData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err: any) {
      toast.error(`Failed to send email: ${err.message}`);
    }
  }

  return { sendEmail };
}
