import { toast } from "react-toastify";

export function useEmailFunctions() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const API_URL = `${apiUrl}/api/Email/send`;

  async function sendEmail(emailData: {
    to: string;
    subject: string;
    content: string;
    attachment?: Blob;
    attachmentFileName?: string;
  }) {
    try {
      const { to, subject, content, attachment, attachmentFileName } = emailData;

      let attachmentB64 = null;
      if (attachment) {
        attachmentB64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(attachment);
        });
      }

      const emailDataToSend = {
        to,
        subject,
        content,
        attachmentB64,
        attachmentFileName,
        };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(emailDataToSend),
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
