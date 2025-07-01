import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useReimbursementFunctions } from './reimbursementFunctions';
import { Button, RedirectButton, SubmitButton, InputField, InputSelect, FileInput, Title, InputFieldTextArea } from './Components';
import './App.css';

function AboutPage() {
    return (
        <div className="content">
            <Title content="About the Reimbursement App" />
            <p className="center-p">This app is used to easily submit reimbursement requests for employees and volunteers of Five Oaks Church. These requests can then be easily accessed, exported, and approved by an admin. <br/><br/>Made by Carter Leitch.</p>    
        </div>
    );
}
function ErrorPage() {
    return (
        <div className="content">
            <Title content="Missing 404" />
            <p className="center-p">Something went wrong. Please try again later or check url. This is not the page you are looking for.</p>
            <br />
            <img src="/404.jpeg" alt="404 Not Found" className="error-image" />
        </div>
    );
}
function MainPage() {
    const {
        fetchReimbursements,
        deleteReimbursement,
    } = useReimbursementFunctions();
    return (
        <div className="content">
            <h1>Main Page</h1>
            <h1>Welcome to the Reimbursement App</h1>
            <p>This app allows you to create, update, and delete reimbursements.</p>
            <Button onClick={fetchReimbursements} content="Fetch Reimbursements" />
            <br />
            <br />
            <input type="number" id="deleteId" placeholder="Enter ID to delete" className="normal-input" />
            <br />
            <Button onClick={deleteReimbursement} content="Delete" />
            <br />
            <RedirectButton to="/create" content="Create Reimbursement" />
            <RedirectButton to="/update" content="Update Reimbursement" />
        </div>
    );
}
function BugReportPage() {
    return (
        <div className="content">
            <Title content="Bug Report" />
            <p className="center-p">If you find any bugs or have any feature suggestions, please submit them here.</p>
            <form className="normal-form">
                <InputSelect id="bugtype" options={["Bug", "Feature Request", "Other"]} label="Report Type" />
                <InputFieldTextArea id="description" placeholder="Describe the issue or suggestion" label="Description" />                
                <SubmitButton onClick={() => alert("Report submitted!")} content="Submit Report" />
            </form>
        </div>
    );
}
function CreateReimbursementPage() {
    const {
        createReimbursement,
    } = useReimbursementFunctions();
    return (
        <div className="content">
            <Title content="Create Reimbursement" />
            <form className="normal-form">
                <InputField id="vendor" placeholder="Vendor" type="text" label="Vendor" />
                <InputField id="vendoraddress" placeholder="Vendor Address" type="text" label="Vendor Address" />
                <InputField id="vendorwebsite" placeholder="Vendor Website" type="text" label="Vendor Website" />
                <InputField id="totalamount" placeholder="Total Amount" type="number" label="Total Amount" />
                <InputField id="datesubmitted" placeholder="Date Submitted" type="date" label="Date Submitted" />
                <InputSelect id="paymentmethod" options={["Credit Card", "Cash", "Check", "Bank Transfer"]} label="Payment Method" />
                <FileInput id="receipts" label="Receipts" />
                <SubmitButton onClick={createReimbursement} content="Submit" />
            </form>
        </div>
    );
}
function UpdateReimbursementPage(){ 
    const {
        updateReimbursement,
    } = useReimbursementFunctions();
    return (
        <div className="content">
            <Title content="Update Reimbursement" />
            <form className="normal-form">
                <InputField id="vendoru" placeholder="Vendor" type="text" label="Vendor" />
                <InputField id="vendoraddressu" placeholder="Vendor Address" type="text" label="Vendor Address" />
                <InputField id="vendorwebsiteu" placeholder="Vendor Website" type="text" label="Vendor Website" />
                <InputField id="totalamountu" placeholder="Total Amount" type="number" label="Total Amount" />
                <InputField id="datesubmittedu" placeholder="Date Submitted" type="date" label="Date Submitted" />
                <InputSelect id="paymentmethodu" options={["Credit Card", "Cash", "Check", "Bank Transfer"]} label="Payment Method" />
                <FileInput id="receiptsu" label="Receipts" />
                <SubmitButton onClick={updateReimbursement} content="Submit" />
            </form>
        </div>
    );
}
function App() {
    
  return (
      <Router>
          <nav className="nav-bar">
              <Link to="/"><img src="/fiveoaksbanner.png" alt="Five Oaks Church" className="nav-bar-image"></img></Link>
              <ul className="link-list">
                  <li><Link className="link-list-item" to="/about">About</Link></li>
                  <li><Link className="link-list-item" to="/bugreport">Bug Report</Link></li>
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
  );
}

export default App;
