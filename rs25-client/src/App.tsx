import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useReimbursementFunctions } from "./reimbursementFunctions";
import {
  SubmitButton,
  InputField,
  InputSelect,
  Title,
  InputFieldTextArea,
  InputFieldNumber,
  SpookyButton,
  Button,
  InputRadio,
  SmallerTitle,
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
import { fetchAppUserById, updateAppUser } from "./applicationUserFunctions";
import { GlobalLoading } from "./LoadingOverlay";
import { jsPDF } from "jspdf";
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
  const auth = useAuth();
  const {
    data,
    fetchReimbursements,
    fetchReimbursementByUserId,
    deleteReimbursement,
    updateReimbursement,
    fetchReimbursementById,
  } = useReimbursementFunctions();
  // eslint-disable-next-line
  useEffect(() => {
    if (auth?.user?.role === "Admin") {
      fetchReimbursements();
    } else {
      fetchReimbursementByUserId(auth?.user?.id);
    }
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
          fetchReimbursementByUserId={fetchReimbursementByUserId}
          updateReimbursement={updateReimbursement}
          fetchReimbursementById={fetchReimbursementById}
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

    if (!bodyContent || bodyContent === "") {
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
  const {
    createReimbursement,
    userOrVendor,
    setActionRequested,
    setUserOrVendor,
  } = useReimbursementFunctions();
  const { createPurchase } = usePurchaseFunctions();
  const { sendEmail } = useEmailFunctions();
  const [rowsPur, setRowsPur] = React.useState<Purchase[]>([]);
  const [totalAmount, setTotalAmount] = React.useState<number>(0);

  const nav = useNavigate();
  const auth = useAuth();

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
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Reimbursement Details", 10, 10);
        doc.setFontSize(12);
        doc.text(`Submitted by: ${auth?.user?.username}`, 10, 20);
        doc.text(
          `Reimbursee: ${newReimResponse.vendorName || auth?.user?.username}`,
          10,
          30
        );
        doc.text(
          `Address: ${auth?.user?.address}, ${auth?.user?.city}, ${auth?.user?.state}, ${auth?.user?.zipCode}`,
          10,
          40
        );
        doc.text(
          `Action Requested: ${newReimResponse.actionRequested}`,
          10,
          50
        );
        doc.text(
          `Total: ${newReimResponse.totalAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}`,
          10,
          60
        );
        doc.text(
          `Date Submitted: ${newReimResponse.dateSubmitted.split("T")[0]}`,
          10,
          70
        );

        let yOffset = 85;
        rowsPurWithId.forEach((purchase, index) => {
          doc.text(`Purchase ${index + 1}`, 10, yOffset);
          doc.text(`Account: ${purchase.accountp}`, 10, yOffset + 10);
          doc.text(`Description: ${purchase.descriptionp}`, 10, yOffset + 20);
          doc.text(
            `Amount: ${Number(purchase.amountp).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}`,
            10,
            yOffset + 30
          );
          doc.text(`Date: ${purchase.datep}`, 10, yOffset + 40);
          yOffset += 50;
          if (purchase.file) {
            const fileURL = URL.createObjectURL(purchase.file);
            const img = new Image();
            img.src = fileURL;

            if (yOffset + 100 > doc.internal.pageSize.height) {
              doc.addPage();
              yOffset = 10;
            }

            doc.addImage(img, "JPEG", 10, yOffset, 100, 100);
          }
          yOffset += 110;
        });

        /*for (const purchase of rowsPurWithId) {
                if (purchase.file) {
                    const fileURL = URL.createObjectURL(purchase.file);
                    const img = new Image();
                    img.src = fileURL;
                    doc.addImage(img, 'JPEG', 10, yOffset, 100, 100);
                    yOffset += 100;
                }
            }*/

        doc.save(`Reimbursement_${newReimId}_Details.pdf`);

        const pdfBlob = doc.output("blob");

        // to should be email address of admin
        const data = {
          to: `carterleitch@gmail.com`,
          subject: `New Reimbursement Created!`,
          content: "WIP",
          attachment: pdfBlob,
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
        <label htmlFor="radio-container-reimbursee">
          Select who to reimburse.
        </label>
        <div className="radio-input-container" id="radio-container-reimbursee">
          <InputRadio
            id="user"
            value="user"
            name="userorvendor"
            label="Me"
            checked={true}
            onChange={(e) => setUserOrVendor(e.target.value)}
          />
          <InputRadio
            id="vendor"
            value="vendor"
            name="userorvendor"
            label="Other person or company"
            onChange={(e) => setUserOrVendor(e.target.value)}
          />
        </div>

        {userOrVendor === "vendor" ? (
          <div>
            <label htmlFor="vendor-div">
              Other person or company's information
            </label>

            <div id="vendor-div" style={{ marginTop: "4px" }}>
              <InputField id="vendorName" type="text" label="Name"></InputField>
              <InputField
                id="vendorWebsite"
                type="text"
                label="Website (if applicable)"
              ></InputField>
              <InputField
                id="vendorAddress"
                type="text"
                label="Street"
              ></InputField>
              <InputField id="vendorCity" type="text" label="City"></InputField>
              <InputField
                id="vendorState"
                type="text"
                label="State"
              ></InputField>
              <InputField
                id="vendorZipCode"
                type="text"
                label="Zip Code"
              ></InputField>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <label htmlFor="radio-container-action-requested">
          Select purpose of request.
        </label>
        <div
          className="radio-input-container"
          id="radio-container-action-requestedcontainer"
        >
          <InputRadio
            id="reimbursement"
            value="Reimbursement"
            name="actionrequested"
            label="Reimbursement"
            checked={true}
            onChange={(e) => setActionRequested(e.target.value)}
          />
          <InputRadio
            id="notification"
            value="Notification"
            name="actionrequested"
            label="Notification of purchase"
            onChange={(e) => setActionRequested(e.target.value)}
          />
        </div>

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
function LoginPage() {
  const nav = useNavigate();
  const auth = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;

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
    </div>
  );
}
function LogoutPage() {
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
function AccessDeniedPage() {
  return (
    <div className="content">
      <Title content="Access Denied" />
      <p className="center-p">
        You do not have permission to access this page.
      </p>
      <br />
    </div>
  );
}
function AccountPage() {
  const [editMode, setEditMode] = React.useState(false);
  const nav = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth?.logout();
    setTimeout(() => {
      nav("/Account/logout");
    }, 0);
    toast.success("Successfully logged out!");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const firstName = (document.getElementById("firstName") as HTMLInputElement)
      .value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement)
      .value;
    const phoneNumber = (
      document.getElementById("phoneNumber") as HTMLInputElement
    ).value;
    const address = (document.getElementById("address") as HTMLInputElement)
      .value;
    const city = (document.getElementById("city") as HTMLInputElement).value;
    const state = (document.getElementById("state") as HTMLInputElement).value;
    const zipCode = (document.getElementById("zipCode") as HTMLInputElement)
      .value;
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !address ||
      !city ||
      !state ||
      !zipCode
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    const updatedData = {
      id: auth?.user?.id,
      emailAddress: auth?.user?.username,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
    };
    try {
      fetchAppUserById(auth?.user?.id || "").then((user) => {
        if (user) {
          console.log("Fetched user:", user);
          updateAppUser(user.id, updatedData)
            .then(() => {
              auth?.user && Object.assign(auth.user, updatedData);
              if (auth && auth.user) {
                auth.user.firstName = firstName;
                auth.user.lastName = lastName;
                auth.user.phoneNumber = phoneNumber;
                auth.user.address = address;
                auth.user.city = city;
                auth.user.state = state;
                auth.user.zipCode = zipCode;
              }
              setEditMode(false);
              toast.success("Account information updated successfully!");
            })
            .catch((error) => {
              console.error("Error updating account information:", error);
              toast.error("Failed to update account information.");
            });
        } else {
          toast.error("User not found.");
        }
      });
    } catch (error) {
      console.error("Error fetching user information:", error);
      toast.error("Failed to fetch user information.");
    }
  };

  return (
    <div className="content">
      <Title content="Account Information" />
      <div>
        <form onSubmit={handleSubmit} className="normal-form">
          <InputField
            id="userName"
            type="text"
            label="Email/Username"
            defaultValue={auth?.user?.username}
            readonly={true}
          />
          <InputField
            id="role"
            type="text"
            label="Role"
            defaultValue={auth?.user?.role}
            readonly={true}
          />
          <InputField
            id="firstName"
            type="text"
            label="First Name"
            defaultValue={auth?.user?.firstName}
            readonly={!editMode}
          />
          <InputField
            id="lastName"
            type="text"
            label="Last Name"
            defaultValue={auth?.user?.lastName}
            readonly={!editMode}
          />
          <InputField
            id="phoneNumber"
            type="text"
            label="Phone Number"
            defaultValue={auth?.user?.phoneNumber}
            readonly={!editMode}
          />
          <InputField
            id="address"
            type="text"
            label="Address"
            defaultValue={auth?.user?.address}
            readonly={!editMode}
          />
          <InputField
            id="city"
            type="text"
            label="City"
            defaultValue={auth?.user?.city}
            readonly={!editMode}
          />
          <InputField
            id="state"
            type="text"
            label="State"
            defaultValue={auth?.user?.state}
            readonly={!editMode}
          />
          <InputField
            id="zipCode"
            type="text"
            label="Zip Code"
            defaultValue={auth?.user?.zipCode}
            readonly={!editMode}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            {editMode && <SubmitButton content="Save Changes" />}
          </div>
        </form>
      </div>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={() => setEditMode(!editMode)} content="Edit Account" />
        <SpookyButton onClick={handleLogout} content="Logout" />
      </div>
    </div>
  );
}

function DetailsPage() {
  interface PurchaseDetails {
    id: number;
    account: string;
    description: string;
    amount: number;
    purchaseDate: string;
    reimId: string;
  }

  const [searchParams] = useSearchParams();
  const selectedReimId = Number(searchParams.get("id") || "");
  const { fetchReimbursementById } = useReimbursementFunctions();
  const { fetchPurchaseByReimId } = usePurchaseFunctions();
  const [purchases, setPurchases] = React.useState<PurchaseDetails[]>([]);
  const [reimbursement, setReimbursement] = React.useState<any>(null);
  console.log("Banana Selected Reimbursement ID:", selectedReimId);
  React.useEffect(() => {
    if (selectedReimId) {
      fetchReimbursementById(selectedReimId).then((data) => {
        setReimbursement(data);
      });
      fetchPurchaseByReimId(selectedReimId).then((data) => {
        setPurchases(data);
      });
    }
  }, []);

  if (!reimbursement) {
    return <div>Loading...</div>;
  }
  return (
    <div className="content">
      <Title content="Reimbursement Details" />
      <div>
        <form className="normal-form">
          <InputField
            id="userName"
            type="text"
            label="Submitted By"
            defaultValue={reimbursement.userName}
            readonly={true}
          />
          <InputField
            id="actionRequested"
            type="text"
            label="Action Requested"
            defaultValue={reimbursement.actionRequested}
            readonly={true}
          />
          <InputField
            id="status"
            type="text"
            label="Status"
            defaultValue={reimbursement.status}
            readonly={true}
          />
          <InputField
            id="dateSubmitted"
            type="text"
            label="Date Submitted"
            defaultValue={reimbursement.dateSubmitted.split("T")[0]}
            readonly={true}
          />
          {reimbursement.dateApproved && (
            <InputField
              id="dateApproved"
              type="text"
              label="Date Approved"
              defaultValue={reimbursement.dateApproved.split("T")[0]}
              readonly={true}
            />
          )}
          <InputField
            id="totalAmount"
            type="text"
            label="Total Amount"
            defaultValue={reimbursement.totalAmount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
            readonly={true}
          />
          {reimbursement.vendorName && (
            <InputField
              id="vendorName"
              type="text"
              label="Vendor Name"
              defaultValue={reimbursement.vendorName}
              readonly={true}
            />
          )}
          {reimbursement.vendorWebsite && (
            <InputField
              id="vendorWebsite"
              type="text"
              label="Vendor Website"
              defaultValue={reimbursement.vendorWebsite}
              readonly={true}
            />
          )}
        </form>
      </div>
      <div>
        {purchases.length > 0
          ? purchases.map((purchase, index) => (
              <div key={index}>
                <SmallerTitle content={`Purchase ${index + 1}`}></SmallerTitle>
                <form className="normal-form">
                  <InputField
                    id={`account-${index}`}
                    type="text"
                    label="Account"
                    defaultValue={purchase.account}
                    readonly={true}
                  />
                  <InputFieldTextArea
                    id={`description-${index}`}
                    label="Description"
                    value={purchase.description}
                    readonly={true}
                    disabled={true}
                  />
                  <InputField
                    id={`amount-${index}`}
                    type="text"
                    label="Amount"
                    defaultValue={Number(purchase.amount).toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )}
                    readonly={true}
                  />
                  <InputField
                    id={`date-${index}`}
                    type="text"
                    label="Date"
                    defaultValue={purchase.purchaseDate.split("T")[0]}
                    readonly={true}
                  />
                </form>
              </div>
            ))
          : ""}
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
              {auth?.user?.username !== undefined ? (
                <Link className="link-list-item" to="/">
                  Dashboard
                </Link>
              ) : (
                ""
              )}
            </li>
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
        <GlobalLoading />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["Admin", "User"]}>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element=<PrivateRoute allowedRoles={["Admin", "User"]}>
              <CreateReimbursementPage />
            </PrivateRoute>
          />
          {/*          <Route path="/update" element={<UpdateReimbursementPage />} />
           */}
          <Route
            path="/bugreport"
            element={
              <PrivateRoute allowedRoles={["Admin", "User"]}>
                <BugReportPage />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/Account/login" element={<LoginPage />} />
          <Route path="/Account/logout" element={<LogoutPage />} />
          <Route path="/Account/accessdenied" element={<AccessDeniedPage />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route
            path="/Account"
            element={
              <PrivateRoute allowedRoles={["Admin", "User"]}>
                <AccountPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="bottom-left" autoClose={3000} />
    </div>
  );
}

export default App;
