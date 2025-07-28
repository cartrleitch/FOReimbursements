import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import React from "react";
import {
  RedirectButton,
  Button,
  AdminOnlyWrapper,
  SpookyButton,
  InputSelect,
} from "./Components";
import { DisplayOnlyPurchaseTable, Purchase } from "./PurTableComponent";
import { usePurchaseFunctions } from "./purchaseFunctions";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { useEmailFunctions } from "./emailFunctions";

export interface Reimbursement {
  id: number;
  vendorId: string;
  userId: string;
  submittedBy: string;
  userName: string;
  vendorName?: string;
  actionRequested: string;
  totalAmount: number;
  dateSubmitted: string;
  status: string;
  dateApproved?: string;
  paymentMethod?: string;
}

interface TableProps {
  rows: Reimbursement[];
  deleteReimbursement: (id: number) => Promise<void>;
  fetchReimbursements: () => Promise<void>;
  fetchReimbursementByUserId: (userId: string | undefined) => Promise<void>;
  updateReimbursement: (
    id: number,
    totalAmount?: number,
    dateSubmitted?: Date,
    paymentMethod?: string,
    status?: string,
    dateApproved?: Date,
    actionRequested?: string,
    userId?: string,
    vendorId?: string
  ) => Promise<void>;
  fetchReimbursementById: (id: number) => Promise<Reimbursement>;
}

const columnns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1, hideable: false },
  { field: "vendorId", headerName: "VendorId", flex: 1, hideable: false },
  { field: "userId", headerName: "UserId", flex: 1, hideable: false },
  {
    field: "userName",
    headerName: "Submitted By",
    flex: 1,
  },
  {
    field: "payTo",
    headerName: "Pay To",
    flex: 1,
    renderCell: (params) => {
      if (params.row.vendorName !== null) {
        return params.row.vendorName;
      }
      return params.row.userName;
    },
  },
  { field: "actionRequested", headerName: "Action Requested", flex: 1 },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    flex: 1,
    type: "number",
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      return params.row.totalAmount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
  },
  {
    field: "dateSubmitted",
    headerName: "Date Submitted",
    flex: 1,
    type: "date",
    valueGetter: (value: any) => new Date(value),
  },
  { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
  { field: "status", headerName: "Status", flex: 1, type: "string" },
  {
    field: "dateApproved",
    headerName: "Date Approved or Rejected",
    flex: 1,
    type: "date",
    valueGetter: (value: any) => {
      if (value === null || value === undefined) {
        return null;
      }
      return new Date(value);
    },
  },
];

export function ReimbursementTable({
  rows,
  deleteReimbursement,
  fetchReimbursements,
  fetchReimbursementByUserId,
  fetchReimbursementById,
  updateReimbursement,
}: TableProps) {
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>();
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
  const [selectedRowPurchases, setSelectedRowPurchases] = React.useState<
    Purchase[]
  >([]);
  const [showApprovalForm, setShowApprovalForm] = React.useState(false);
  const { fetchPurchaseByReimId } = usePurchaseFunctions();
  const getRelatedPurchases = async (reimId: number) => {
    const purchases = await fetchPurchaseByReimId(reimId);
    setSelectedRowPurchases(purchases);
  };
  const auth = useAuth();
  const { sendEmail } = useEmailFunctions();

  return (
    <div className="reim-table">
      <div className="table-button-div">
        <RedirectButton to="/create" content="New" />
        <Button
          onClick={() => {
            if (auth?.user?.role === "Admin") {
              fetchReimbursements();
            } else {
              fetchReimbursementByUserId(auth?.user?.id);
            }
          }}
          content="Refresh"
        />
        {/*<RedirectButton to="/update" content="Edit" />*/}
        <AdminOnlyWrapper>
          <Button
            onClick={() => {
              if (selectedRowId === null) {
                toast.error("No row selected!");
                return;
              }

              setShowApprovalForm(true);
            }}
            content="Approve"
          />
        </AdminOnlyWrapper>
        <AdminOnlyWrapper>
          <SpookyButton
            onClick={() => {
              if (selectedRowId === null) {
                toast.error("No row selected!");
                return;
              }
              fetchReimbursementById(selectedRowId || 0).then(
                (reimbursement) => {
                  if (reimbursement.status !== "Pending") {
                    toast.error(
                      "Reimbursement has already been approved or rejected."
                    );
                    return;
                  }
                  updateReimbursement(
                    selectedRowId || 0,
                    reimbursement.totalAmount,
                    reimbursement.dateSubmitted
                      ? new Date(reimbursement.dateSubmitted)
                      : undefined,
                    reimbursement.paymentMethod,
                    "Rejected",
                    new Date(),
                    reimbursement.actionRequested,
                    reimbursement.userId,
                    reimbursement.vendorId
                  );
                  const emailData = {
                    to: reimbursement.userName,
                    subject: "Reimbursement Request Rejected",
                    content: `Your reimbursement request has been rejected. Please contact the administrator for more details.\nRejected Reimbursement Details:\nRejected by: ${
                      auth?.user?.username
                    }\nReimbursement Submission Date: ${
                      reimbursement.dateSubmitted.split("T")[0]
                    }\nTotal: ${reimbursement.totalAmount.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )}\nAction Requested: ${reimbursement.actionRequested}`,
                  };
                  toast.success("Reimbursement rejected successfully!");
                  sendEmail(emailData);
                }
              );
            }}
            content="Reject"
          />
        </AdminOnlyWrapper>
        <AdminOnlyWrapper>
          <Button
            onClick={async () => {
              if (selectedRowId !== null) {
                deleteReimbursement(selectedRowId);
              } else {
                toast.error("No row selected!");
              }
            }}
            content="Delete"
            className="spooky-button"
          />
        </AdminOnlyWrapper>
      </div>
      {showApprovalForm && (
        <div style={{ marginBottom: "8px" }}>
          <InputSelect
            id="paymentMethodSelect"
            options={["Check", "Credit Card", "ACH/Direct Deposit"]}
            label="Payment Method"
          />
          <Button
            onClick={() => {
              fetchReimbursementById(selectedRowId || 0).then(
                (reimbursement) => {
                  if (reimbursement.status !== "Pending") {
                    toast.error(
                      "Reimbursement has already been approved or rejected."
                    );
                    return;
                  }
                  const paymentMethodSelected = (
                    document.getElementById(
                      "paymentMethodSelect"
                    ) as HTMLSelectElement
                  ).value;
                  updateReimbursement(
                    selectedRowId || 0,
                    reimbursement.totalAmount,
                    reimbursement.dateSubmitted
                      ? new Date(reimbursement.dateSubmitted)
                      : undefined,
                    paymentMethodSelected,
                    "Approved",
                    new Date(),
                    reimbursement.actionRequested,
                    reimbursement.userId,
                    reimbursement.vendorId
                  );
                  const emailData = {
                    to: reimbursement.userName,
                    subject: "Reimbursement Request Approved",
                    content: `Your reimbursement request has been approved. Please contact the administrator for more details or if you experience any issues.\nApproved Reimbursement Details:\nApproved by: ${
                      auth?.user?.username
                    }\nReimbursement Submission Date: ${
                      reimbursement.dateSubmitted.split("T")[0]
                    }\nTotal: ${reimbursement.totalAmount.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )}\nAction Requested: ${reimbursement.actionRequested}`,
                  };
                  sendEmail(emailData);
                  toast.success("Reimbursement approved successfully!");
                  setShowApprovalForm(false);
                }
              );
            }}
            content="Approve Reimbursement"
          />
        </div>
      )}
      <DataGrid
        rows={rows}
        columns={columnns}
        checkboxSelection
        disableMultipleRowSelection
        autoPageSize
        columnVisibilityModel={{ id: false, vendorId: false, userId: false }}
        getRowId={(row) => row.id}
        onRowSelectionModelChange={(id) => {
          setSelectedRowPurchases([]);
          setRowSelectionModel(id);
          const selectedRowData = rows.find(
            (row) => row.id === Array.from(id.ids)[0]
          );
          setSelectedRowId(selectedRowData?.id || null);
          if (selectedRowData) {
            getRelatedPurchases(selectedRowData.id);
          }
        }}
        rowSelectionModel={rowSelectionModel}
      />
      <DisplayOnlyPurchaseTable rows={selectedRowPurchases} />
      <br />
    </div>
  );
}
