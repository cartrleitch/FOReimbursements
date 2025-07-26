import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useReimbursementFunctions } from "./reimbursementFunctions";
import {
  SubmitButton,
  InputField,
  InputSelect,
  FileInput,
  Title,
  InputFieldTextArea,
  InputFieldNumber,
  SpookyButton,
} from "./Components";
import { ReimbursementTable } from "./ReimTableComponent";
import { PurchaseTable, Purchase } from "./PurTableComponent";
import { usePurchaseFunctions } from "./purchaseFunctions";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import React from "react";
import { useEmailFunctions } from "./emailFunctions";
import { useAuth } from "./AuthContext";
import { PrivateRoute } from "./PrivateRoute";

function AboutPage() {
  return (
    <div className="content">
      <Title content="About the Reimbursement App" />
      <p className="center-p">
        This app is used to easily submit reimbursement requests for employees
        and volunteers of Five Oaks Church. These requests can then be easily
        accessed, exported, and approved by an admin. <br />
        <br />
        Made by Carter Leitch.
      </p>
    </div>
  );
}
function ErrorPage() {
  return (
    <div className="content">
      <Title content="Missing 404" />
      <p className="center-p">
        Something went wrong. Please try again later or check url. This is not
        the page you are looking for.
      </p>
      <br />
      <img src="/404.jpeg" alt="404 Not Found" className="error-image" />
    </div>
  );
}
function MainPage() {
  const { data, fetchReimbursements, deleteReimbursement } =
    useReimbursementFunctions();
  // eslint-disable-next-line
  useEffect(() => {
    fetchReimbursements();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="content">
      <Title content="Reimbursement Dashboard" />
      <div className="table-container">
        <ReimbursementTable
          rows={data}
          deleteReimbursement={deleteReimbursement}
          fetchReimbursements={fetchReimbursements}
        />
      </div>
    </div>
  );
}
function BugReportPage() {
  const auth = useAuth();
  const { sendEmail } = useEmailFunctions();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const bugType = (document.getElementById("bugtype") as HTMLSelectElement)
      .value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value;

    const username = auth?.user?.username;
    var bodyContent = "";
    if (username) {
      bodyContent =
        "Submitted by: " + username + "\nInformation provided:\n" + description;
    }

    if (!bodyContent || bodyContent == "") {
      toast.error("Please fill in the description field.");
      return;
    }

    const data = {
      to: "carterleitch@gmail.com",
      subject: `Bug Report - ${bugType}`,
      content: bodyContent,
    };
    sendEmail(data);
    (document.getElementById("bugtype")! as HTMLSelectElement).value = "Bug";
    (document.getElementById("description")! as HTMLTextAreaElement).value = "";
    toast.success("Bug report submitted successfully!");
  };

  return (
    <div className="content">
      <Title content="Bug Report" />
      <p className="center-p">
        If you find any bugs or have any feature suggestions, please submit them
        here.
      </p>
      <br />
      <form className="normal-form" onSubmit={handleSubmit}>
        <InputSelect
          id="bugtype"
          options={["Bug", "Feature Request", "Other"]}
          label="Report Type"
        />
        <InputFieldTextArea
          id="description"
          placeholder="Describe the issue or suggestion"
          label="Description"
        />
        <SubmitButton content="Submit Report" />
      </form>
    </div>
  );
}
function CreateReimbursementPage() {
  const { createReimbursement } = useReimbursementFunctions();
  const { createPurchase } = usePurchaseFunctions();
  const { sendEmail } = useEmailFunctions();
  const [rowsPur, setRowsPur] = React.useState<Purchase[]>([]);
  const [totalAmount, setTotalAmount] = React.useState<number>(0);

  const nav = useNavigate();

  const updateTotalAmount = (updatedRows?: Purchase[]) => {
    const rowsToUse = updatedRows || rowsPur;
    var total = 0;

    for (const purchase of rowsToUse) {
      try {
        total += Number(purchase.amountp);
      } catch (e) {
        console.error("Error calculating total amount:", e);
      }
    }
    setTotalAmount(total);
  };

  const handleSubmit = async () => {
    if (rowsPur.length === 0) {
      toast.error(
        "Please fill in all fields correctly and add at least one purchase."
      );
      return;
    }
    const newReimResponse = await createReimbursement();
    const newReimId = newReimResponse.id;
    console.log("New Reimbursement ID:", newReimId);
    if (newReimId >= 0) {
      const rowsPurWithId = rowsPur.map((purchase) => ({
        ...purchase,
        reimId: newReimId.toString(),
      }));
      const successPur = await createPurchase(rowsPurWithId);
      if (successPur) {
        var purchaseInfo = `Reimbursement Info\nVendor: ${
          newReimResponse.vendor
        }\nVendor Address: ${newReimResponse.vendorAddress}\nVendor Website: ${
          newReimResponse.vendorWebsite
        }\nTotal: ${newReimResponse.totalAmount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}\nDate Submitted: ${
          newReimResponse.dateSubmitted.split("T")[0]
        }\nPayment Method: ${newReimResponse.paymentMethod}\n\nPurchase Info\n`;

        var purCounter = 0;

        for (const purchase of rowsPurWithId) {
          purCounter++;

          purchaseInfo += `\nPurchase ${purCounter}\nAccount: ${
            purchase.accountp
          }\nDescription: ${purchase.descriptionp}\nAmount: ${Number(
            purchase.amountp
          ).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}\nDate: ${purchase.datep}\n`;
        }

        const data = {
          to: "carterleitch@gmail.com",
          subject: `New Reimbursement Created!`,
          content: purchaseInfo,
        };
        sendEmail(data);
        toast.success("Reimbursement created successfully!");
        nav("/");
      } else {
        toast.error("Please add at least one purchase.");
        return;
      }
    } else {
      return;
    }
  };

  return (
    <div className="content">
      <Title content="Create Reimbursement" />

      <form
        className="normal-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <InputField
          id="vendor"
          placeholder="Vendor"
          type="text"
          label="Vendor"
        />
        <InputField
          id="vendoraddress"
          placeholder="Vendor Address"
          type="text"
          label="Vendor Address"
        />
        <InputField
          id="vendorwebsite"
          placeholder="Vendor Website"
          type="text"
          label="Vendor Website"
        />
        <InputFieldNumber
          id="totalamount"
          placeholder="Total Amount $"
          type="number"
          label="Total Amount"
          step="0.01"
          min="0"
          value={totalAmount.toString()}
          readonly={true}
        />
        <InputSelect
          id="paymentmethod"
          options={["Credit Card", "Cash", "Check", "Bank Transfer"]}
          label="Payment Method"
        />
        <div className="pur-table-container">
          <PurchaseTable
            rows={rowsPur}
            setRows={setRowsPur}
            updateTotalAmount={updateTotalAmount}
          />
        </div>
        <br />
        <SubmitButton content="Submit" />
      </form>
    </div>
  );
}
function UpdateReimbursementPage() {
  const { updateReimbursement } = useReimbursementFunctions();
  return (
    <div className="content">
      <Title content="Update Reimbursement" />
      <form className="normal-form">
        <InputField
          id="vendoru"
          placeholder="Vendor"
          type="text"
          label="Vendor"
        />
        <InputField
          id="vendoraddressu"
          placeholder="Vendor Address"
          type="text"
          label="Vendor Address"
        />
        <InputField
          id="vendorwebsiteu"
          placeholder="Vendor Website"
          type="text"
          label="Vendor Website"
        />
        <InputField
          id="totalamountu"
          placeholder="Total Amount"
          type="number"
          label="Total Amount"
        />
        <InputField
          id="datesubmittedu"
          placeholder="Date Submitted"
          type="date"
          label="Date Submitted"
        />
        <InputSelect
          id="paymentmethodu"
          options={["Credit Card", "Cash", "Check", "Bank Transfer"]}
          label="Payment Method"
        />
        <FileInput id="receiptsu" label="Receipts" />
        <SubmitButton onClick={updateReimbursement} content="Submit" />
      </form>
    </div>
  );
}
function LoginPage() {
  const nav = useNavigate();
  const auth = useAuth();

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
    console.log("Login attempt with username:", emailaddress);
    console.log("Login attempt with password:", password);
    try {
      const response = await fetch("http://localhost:5000/api/Auth/login", {
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
    </div>
  );
}
function LogoutPage() {
  return (
    <div className="content">
      <Title content="Successfully Logged Out" />
      <p className="center-p">You can now close this tab.</p>
      <br />
    </div>
  );
}
function LoginDeniedPage() {
  return (
    <div className="content">
      <Title content="Login Denied" />
      <p className="center-p">
        You do not have permission to access this page.
      </p>
      <br />
    </div>
  );
}
function AccountPage() {
  const nav = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth?.logout();
    nav("/Account/login");
    toast.success("Successfully logged out!");
  };

  return (
    <div className="content">
      <Title content="Account Information" />
      <p className="center-p">Username: {auth?.user?.username}</p>
      <p className="center-p">Role: {auth?.user?.role}</p>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <SpookyButton onClick={handleLogout} content="Logout" />
      </div>
    </div>
  );
}
function App() {
  const auth = useAuth();

  return (
    <div>
      <Router>
        <nav className="nav-bar">
          <Link to="/">
            <img
              src="/fiveoaksbanner.png"
              alt="Five Oaks Church"
              className="nav-bar-image"
            ></img>
          </Link>
          <ul className="link-list">
            <li>
              <Link className="link-list-item" to="/about">
                About
              </Link>
            </li>
            <li>
              {auth?.user?.username !== undefined ? (
                <Link className="link-list-item" to="/bugreport">
                  Bug Report
                </Link>
              ) : (
                ""
              )}
            </li>
            <li>
              {auth?.user?.username !== undefined ? (
                <Link className="link-list-item" to="/Account">
                  {auth?.user?.username}
                </Link>
              ) : (
                <Link className="link-list-item" to="/Account/login">
                  {"Login"}
                </Link>
              )}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["Admin", "User"]}>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route path="/create" element={<CreateReimbursementPage />} />
          <Route path="/update" element={<UpdateReimbursementPage />} />
          <Route path="/bugreport" element={<BugReportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/Account/login" element={<LoginPage />} />
          <Route path="/Account/logout" element={<LogoutPage />} />
          <Route path="/Account/logindenied" element={<LoginDeniedPage />} />
          <Route path="/Account" element={<AccountPage />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-left" autoClose={3000} />
    </div>
  );
}

export default App;
