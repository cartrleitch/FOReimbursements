export const downloadReceipt = async (fileName: string) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const downloadUrl = `${apiUrl}/api/receipt/download/${encodeURIComponent(fileName)}`;

  try {
    const response = await fetch(downloadUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading receipt:", error);
  }
};
