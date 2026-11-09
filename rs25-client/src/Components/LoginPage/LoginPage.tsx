import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  InputField,
  SubmitButton,
  Title,
} from "../UniversalComponents/UniversalComponents";
import { useAuth } from "../../Auth/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const nav = useNavigate();
  const auth = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const login = async (e: any) => {
    e.preventDefault();

    const emailaddress = (
      document.getElementById("username") as HTMLInputElement
    ).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    if (!emailaddress || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailaddress, password }),
      });
      console.log("Login request sent:", response);
      if (response.ok) {
        const data = await response.json();
        auth?.login(data.token);
        toast.success("Login successful!");
        nav("/");
      } else {
        toast.error("Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="content">
      <Title content="Login" />
      <form className="normal-form" onSubmit={login}>
        <InputField
          id="username"
          placeholder="Username"
          type="text"
          label="Username"
        />
        <InputField
          id="password"
          placeholder="Password"
          type="password"
          label="Password"
        />
        <SubmitButton content="Login" />
      </form>
      <a href="/Account/passwordreset" className="forgot-password-link">
        Forgot Password?
      </a>
    </div>
  );
}
