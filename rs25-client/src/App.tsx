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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const bugType = (document.getElementById("bugtype") as HTMLSelectElement)
        .value;
        const description = (
        document.getElementById("description") as HTMLTextAreaElement
        ).value;
    
        if (!description) {
        toast.error("Please fill in the description field.");
        return;
        }
    
        // Send the bug report to your server
        console.log("Bug Report Submitted:", { bugType, description });
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
        <SubmitButton
          content="Submit Report"
        />
      </form>
    </div>
  );
}
function CreateReimbursementPage() {
  const { createReimbursement } = useReimbursementFunctions();
  const { createPurchase } = usePurchaseFunctions();
  const [rowsPur, setRowsPur] = React.useState<Purchase[]>([]);
  const [totalAmount, setTotalAmount] = React.useState<number>(0);

  const nav = useNavigate();

  const updateTotalAmount = (updatedRows?: Purchase[]) => {
    const rowsToUse = updatedRows || rowsPur;
    console.log("Updating total amount with rows:", rowsToUse);
    var total = 0;

    for (const purchase of rowsToUse) {
      console.log("Calculating total amount for purchase:", purchase);

      try {
        total += Number(purchase.amountp);
        console.log("Current total after adding purchase:", total);
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
    const newReimId = await createReimbursement();
    console.log("New Reimbursement ID:", newReimId);
    if (newReimId >= 0) {
      const rowsPurWithId = rowsPur.map((purchase) => ({
        ...purchase,
        reimId: newReimId.toString(),
      }));
      const successPur = await createPurchase(rowsPurWithId);
      if (successPur) {
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
        <InputField
          id="datesubmitted"
          placeholder="Date Submitted"
          type="date"
          label="Date Submitted"
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
function App() {
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
              <Link className="link-list-item" to="/bugreport">
                Bug Report
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/create" element={<CreateReimbursementPage />} />
          <Route path="/update" element={<UpdateReimbursementPage />} />
          <Route path="/bugreport" element={<BugReportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-left" autoClose={3000} />
    </div>
  );
}

export default App;
