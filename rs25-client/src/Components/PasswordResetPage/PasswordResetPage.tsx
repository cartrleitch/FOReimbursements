import {
  Title,
  InputField,
  SubmitButton,
} from "../UniversalComponents/UniversalComponents";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;
export default function PasswordResetPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");
  const token = params.get("token");
  const isResetMode = !!email && !!token;

  const [emailInput, setEmailInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Request password reset link from server
  async function requestLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!emailInput) {
      toast.error("Please enter your email address.");
      return;
    }
    try {
      toast.success("Sent link to reset password!");
      const response = await fetch(`${apiUrl}/api/Auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress: emailInput }),
      });
      if (response.ok) {
        const data = await response.json();
      }
    } catch (error) {
      console.error("Error requesting password reset link:", error);
      toast.error("An error occurred. Please try again.");
    }
  }

  async function resetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Enter a new password.");
      return;
    } else if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/Auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress: email, token, newPassword }),
      });
      if (response.ok) {
        toast.success("Password has been reset successfully.");
        nav("/Account/login");
      } else {
        toast.error("Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred. Please try again.");
    }
  }
  return (
    <div className="content">
      <Title content="Password Reset" />

      {isResetMode ? (
        <form className="normal-form" onSubmit={resetPassword}>
          <InputField
            id="newpassword"
            placeholder="New Password"
            type="password"
            label="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <InputField
            id="confirmpassword"
            placeholder="Confirm New Password"
            type="password"
            label="Confirm New Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <SubmitButton content="Reset" />
        </form>
      ) : (
        <form className="normal-form" onSubmit={requestLink}>
          <InputField
            id="email"
            placeholder="Email Address"
            type="email"
            label="Email Address"
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <SubmitButton content="Send Reset Link" />
        </form>
      )}
    </div>
  );
}
