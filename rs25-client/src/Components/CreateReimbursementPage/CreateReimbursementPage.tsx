import { Title } from "../UniversalComponents/UniversalComponents";
import {
  PurchaseTable,
  Purchase,
} from "../../Components/PurTable/PurTableComponent";
import { useEmailFunctions } from "../../HelperFunctions/emailFunctions";
import { jsPDF } from "jspdf";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReimbursementFunctions } from "../../HelperFunctions/reimbursementFunctions";
import { usePurchaseFunctions } from "../../HelperFunctions/purchaseFunctions";
import React from "react";
import {
  InputField,
  InputFieldNumber,
  InputRadio,
  SubmitButton,
} from "../UniversalComponents/UniversalComponents";
import { fetchVendorByID } from "../../HelperFunctions/vendorFunctions";

const reimbursementReportEmail =
  import.meta.env.VITE_REIMBURSEMENT_REPORT_EMAIL || "";

export default function CreateReimbursementPage() {
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
        "Please fill in all fields correctly and add at least one purchase.",
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
        let vendorData = null;
        if (newReimResponse.vendorId) {
          vendorData = await fetchVendorByID(Number(newReimResponse.vendorId));
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Reimbursement Details", 10, 10);
        doc.setFontSize(12);

        let yOffset = 20;

        doc.text(`Submitted by: ${auth?.user?.username}`, 10, (yOffset += 10));
        doc.text(
          `User Phone Number: ${auth?.user?.phoneNumber}`,
          10,
          (yOffset += 10),
        );
        doc.text(
          `Reimbursee: ${newReimResponse.vendorName || auth?.user?.username}`,
          10,
          (yOffset += 10),
        );

        if (vendorData) {
          doc.text(
            `Address: ${vendorData.address || ""}, ${vendorData.city || ""}, ${
              vendorData.state || ""
            }, ${vendorData.zipCode || ""}`,
            10,
            (yOffset += 10),
          );
        } else {
          doc.text(
            `Address: ${auth?.user?.address}, ${auth?.user?.city}, ${auth?.user?.state}, ${auth?.user?.zipCode}`,
            10,
            (yOffset += 10),
          );
        }
        if (vendorData && vendorData.website) {
          doc.text(
            `Reimbursee Website: ${vendorData.website}`,
            10,
            (yOffset += 10),
          );
        }
        doc.text(
          `Action Requested: ${newReimResponse.actionRequested}`,
          10,
          (yOffset += 10),
        );
        doc.text(
          `Total: ${newReimResponse.totalAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}`,
          10,
          (yOffset += 10),
        );
        doc.text(
          `Date Submitted: ${newReimResponse.dateSubmitted.split("T")[0]}`,
          10,
          (yOffset += 10),
        );

        yOffset += 15;
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
            yOffset + 30,
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

        // doc.save(`Reimbursement_${newReimId}_Details.pdf`);

        const pdfBlob = doc.output("blob");

        // to should be email address of admin
        const data = {
          to: reimbursementReportEmail,
          subject: `New Reimbursement Created!`,
          content: "Reimbursement request PDF is attached.",
          attachment: pdfBlob,
          attachmentFileName: `Reimbursement_${newReimId}_Details.pdf`,
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
