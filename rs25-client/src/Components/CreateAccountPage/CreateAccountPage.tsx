import { useApplicationUserFunctions } from "../../HelperFunctions/applicationUserFunctions";
import { InputField, InputSelect, SubmitButton, Title } from "../UniversalComponents/UniversalComponents";
import { states } from "../../StateCodes";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function CreateAccountPage() {
	const { createAppUser } = useApplicationUserFunctions();
    const [state, setState] = useState<string>("");
    const nav = useNavigate();

	function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();
		const email = (document.getElementById("email") as HTMLInputElement).value;
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
        if (!email) {
            toast.error("Email field is required");
            return;
        }
        const newAccountData = {
            emailAddress: email,
            firstName,
            lastName,
            phoneNumber,
            address,
            city,
            state,
            zipCode,
        }

        try {
            createAppUser(newAccountData);
            toast.success("Account created successfully!");
            nav("/userdashboard");
        } catch (error) {
            toast.error("Failed to create account.");
        }
	}

	return (
		<div className="content">
            <Title content="Create Account" />
			<form className="normal-form" onSubmit={handleSubmit}>	
			<InputField
            id="email"
            type="text"
            label="Email"
          />
          <InputField
            id="firstName"
            type="text"
            label="First Name"
          />
          <InputField
            id="lastName"
            type="text"
            label="Last Name"
          />
          <InputField
            id="phoneNumber"
            type="text"
            label="Phone Number"
          />
          <InputField
            id="address"
            type="text"
            label="Address"
          />
          <InputField
            id="city"
            type="text"
            label="City"
          />
          <InputSelect
            id="state"
            label="State"
            options={states}
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <InputField
            id="zipCode"
            type="text"
            label="Zip Code"
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SubmitButton content="Create Account" />
          </div>
			</form>
		</div>
	);
}
