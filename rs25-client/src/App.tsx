import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useReimbursementFunctions } from './reimbursementFunctions';
import { Button, RedirectButton, SubmitButton } from './Elements';
import './App.css';

function AboutPage() {
    return (
        <div className="content">
            <h1>About Page</h1>
            I am Cartr Hi
        </div>
    );
}
function ErrorPage() {
    return (
        <div className="content">
            <h1>Missing 404</h1>
            <p>Something went wrong. Please try again later. This is not the page you are looking for.</p>
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
            <h1>Bug Report Page</h1>
            <p>If you find any bugs, please report them here.</p>
        </div>
    );
}
function CreateReimbursementPage() {
    const {
        createReimbursement,
    } = useReimbursementFunctions();
    return (
        <div className="content">
            <h1>Create Reimbursement</h1>
            <form className="create-reim-form">
                <label htmlFor="vendor">Vendor </label>
                <input type="text" id="vendor" placeholder="Vendor" className="normal-input" />
                <br />
                <label htmlFor="vendoraddress">Vendor Address </label>
                <input type="text" id="vendoraddress" placeholder="Vendor Address" className="normal-input" />
                <br />
                <label htmlFor="vendorwebsite">Vendor Website </label>
                <input type="text" id="vendorwebsite" placeholder="Vendor Website" className="normal-input" />
                <br />
                <label htmlFor="total">Total Amount </label>
                <input type="number" id="totalamount" placeholder="Total Amount" className="normal-input" />
                <br />
                <label htmlFor="datesubmitted">Date Submitted </label>
                <input type="date" id="datesubmitted" placeholder="Date Submitted" className="normal-input" />
                <br />
                <label htmlFor="paymentmethod">Payment Method </label>
                <select id="paymentmethod" className="normal-input">
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <br />
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
            <h1>Update Reimbursement</h1>
            <form>
                <label htmlFor="updateId">Update: </label>
                <input type="number" id="updateId" placeholder="Enter ID to update" />
                <label htmlFor="vendor">Vendor: </label>
                <input type="text" id="vendoru" placeholder="Vendor" />
                <br />
                <label htmlFor="vendoraddress">Vendor Address: </label>
                <input type="text" id="vendoraddressu" placeholder="Vendor Address" />
                <br />
                <label htmlFor="vendorwebsite">Vendor Website: </label>
                <input type="text" id="vendorwebsiteu" placeholder="Vendor Website" />
                <br />
                <label htmlFor="total">Total Amount: </label>
                <input type="number" id="totalamountu" placeholder="Total Amount" />
                <br />
                <label htmlFor="datesubmitted">Date Submitted: </label>
                <input type="date" id="datesubmittedu" placeholder="Date Submitted" />
                <br />
                <label htmlFor="paymentmethod">Payment Method: </label>
                <select id="paymentmethodu">
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <br />
                <button type="button" onClick={updateReimbursement}>Submit</button>
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
