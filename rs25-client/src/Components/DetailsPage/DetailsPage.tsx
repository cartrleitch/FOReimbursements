import React from "react";
import { useSearchParams } from "react-router-dom";
import { useReimbursementFunctions } from "../../HelperFunctions/reimbursementFunctions";
import { usePurchaseFunctions } from "../../HelperFunctions/purchaseFunctions";
import { fetchVendorByID } from "../../HelperFunctions/vendorFunctions";
import {
  InputField,
  InputFieldTextArea,
  SmallerTitle,
  Title,
} from "../UniversalComponents/UniversalComponents";
import { downloadReceipt } from "../../HelperFunctions/receiptFunctions";
export default function DetailsPage() {
  interface PurchaseDetails {
    id: number;
    account: string;
    description: string;
    amount: number;
    purchaseDate: string;
    fileName: string;
    reimId: string;
  }

  const [searchParams] = useSearchParams();
  const selectedReimId = Number(searchParams.get("id") || "");
  const { fetchReimbursementById } = useReimbursementFunctions();
  const { fetchPurchaseByReimId } = usePurchaseFunctions();
  const [purchases, setPurchases] = React.useState<PurchaseDetails[]>([]);
  const [reimbursement, setReimbursement] = React.useState<any>(null);
  const [vendorInfo, setVendorInfo] = React.useState<any>(null);

  React.useEffect(() => {
    if (selectedReimId) {
      fetchReimbursementById(selectedReimId).then((data) => {
        setReimbursement(data);
        if (data.vendorId) {
          fetchVendorByID(Number(data.vendorId)).then((vendorData) => {
            setVendorInfo(vendorData);
          });
        }
      });
      fetchPurchaseByReimId(selectedReimId).then((data) => {
        setPurchases(data);
      });
    }
  }, [selectedReimId, fetchReimbursementById, fetchPurchaseByReimId]);

  console.log("Reimbursement Data:", reimbursement);

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
              label="Reimbursee Name"
              defaultValue={reimbursement.vendorName}
              readonly={true}
            />
          )}
          {vendorInfo && vendorInfo.address && (
            <InputField
              id="vendorAddress"
              type="text"
              label="Reimbursee Address"
              defaultValue={vendorInfo.address}
              readonly={true}
            />
          )}

          {vendorInfo && vendorInfo.city && (
            <InputField
              id="vendorCity"
              type="text"
              label="Reimbursee City"
              defaultValue={vendorInfo.city}
              readonly={true}
            />
          )}
          {vendorInfo && vendorInfo.state && (
            <InputField
              id="vendorState"
              type="text"
              label="Reimbursee State"
              defaultValue={vendorInfo.state}
              readonly={true}
            />
          )}
          {vendorInfo && vendorInfo.zipCode && (
            <InputField
              id="vendorZip"
              type="text"
              label="Reimbursee Zip Code"
              defaultValue={vendorInfo.zipCode}
              readonly={true}
            />
          )}

          {reimbursement.vendorWebsite && (
            <InputField
              id="vendorWebsite"
              type="text"
              label="Reimbursee Website"
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
                      },
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
                  <a
                    href="#"
                    className="center-p"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadReceipt(purchase.fileName);
                    }}
                  >
                    Download Receipt
                  </a>
                </form>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
}
