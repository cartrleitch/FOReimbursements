import { Title, Button } from "../UniversalComponents/UniversalComponents";
import { useNavigate } from "react-router-dom";
export default function LogoutPage() {
  const nav = useNavigate();
  return (
    <div className="content">
      <Title content="Successfully Logged Out" />
      <p className="center-p">
        You can now close this tab or return to login page to login again.
      </p>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={() => nav("/Account/login")} content="Login" />
      </div>
    </div>
  );
}
