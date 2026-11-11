import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import {
  Title,
  InputField,
  SubmitButton,
  Button,
  SpookyButton,
  InputSelect,
} from "../UniversalComponents/UniversalComponents";
import { toast } from "react-toastify";
import { useApplicationUserFunctions } from "../../HelperFunctions/applicationUserFunctions";
import { states } from "../../StateCodes";
import "./AccountPage.css";
export default function AccountPage() {
  const [editMode, setEditMode] = React.useState(false);
  const auth = useAuth();
  const { fetchAppUserById, updateAppUser } = useApplicationUserFunctions();

  const [state, setState] = React.useState<string>(auth?.user?.state || "");
  const nav = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    setTimeout(() => {
      nav("/Account/logout");
    }, 0);
    toast.success("Successfully logged out!");
  };

  const handleResetPassword = () => {
    nav("/Account/passwordreset");
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
      emailAddress: auth?.user?.email,
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
            defaultValue={auth?.user?.email}
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
          <InputSelect
            id="state"
            label="State"
            readonly={!editMode}
            options={states}
            value={state}
            onChange={(e) => setState(e.target.value)}
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
      <div className="button-container">
        <Button onClick={() => setEditMode(!editMode)} content="Edit Account" />
        <Button
          onClick={() => handleResetPassword()}
          content="Reset Password"
        />
        <SpookyButton onClick={handleLogout} content="Logout" />
      </div>
    </div>
  );
}
