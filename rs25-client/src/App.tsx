import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useReimbursementFunctions } from './reimbursementFunctions';
import './App.css';

function AboutPage() {
    return (
        <div>
            <h1>About Page</h1>
            I am Cartr Hi
        </div>
    );
}
function ErrorPage() {
    return (
        <div>
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
        <div>
            <h1>Main Page</h1>
            <h1>Welcome to the Reimbursement App</h1>
            <p>This app allows you to create, update, and delete reimbursements.</p>
            <button onClick={fetchReimbursements}>
                Fetch Reimbursements
            </button>
            <br />
            <input type="number" id="deleteId" placeholder="Enter ID to delete" />
            <br />
            <button type="button" onClick={deleteReimbursement}>Delete</button>
            <br />
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
        </div>
    );
}
function BugReportPage() {
    return (
        <div>
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
        <div>
            <h1>Create Reimbursement</h1>
            <form>
                <label htmlFor="vendor">Vendor: </label>
                <input type="text" id="vendor" placeholder="Vendor" />
                <br />
                <label htmlFor="vendoraddress">Vendor Address: </label>
                <input type="text" id="vendoraddress" placeholder="Vendor Address" />
                <br />
                <label htmlFor="vendorwebsite">Vendor Website: </label>
                <input type="text" id="vendorwebsite" placeholder="Vendor Website" />
                <br />
                <label htmlFor="total">Total Amount: </label>
                <input type="number" id="totalamount" placeholder="Total Amount" />
                <br />
                <label htmlFor="datesubmitted">Date Submitted: </label>
                <input type="date" id="datesubmitted" placeholder="Date Submitted" />
                <br />
                <label htmlFor="paymentmethod">Payment Method: </label>
                <select id="paymentmethod">
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <br />
                <button type="button" onClick={createReimbursement}>Submit</button>
            </form>
        </div>
    );
}
function UpdateReimbursementPage(){ 
    const {
        updateReimbursement,
    } = useReimbursementFunctions();
    return (
        <div>
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
                  <li><Link className="link-list-item" to="/">Main</Link></li>
                  <li ><Link className="link-list-item" to="/create">Create Reimbursement</Link></li>
                  <li><Link className="link-list-item" to="/update">Update Reimbursement</Link></li>
                  <li><Link className="link-list-item" to="/bugreport">Bug Report</Link></li>
                  <li><Link className="link-list-item" to="/about">About</Link></li>
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
