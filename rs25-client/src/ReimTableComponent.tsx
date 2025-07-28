import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import React from "react";
import {
  RedirectButton,
  Button,
  AdminOnlyWrapper,
  SpookyButton,
} from "./Components";
import { DisplayOnlyPurchaseTable, Purchase } from "./PurTableComponent";
import { usePurchaseFunctions } from "./purchaseFunctions";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
interface Reimbursement {
  id: number;
  vendorid: string;
  userid: string;
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
  { field: "dateApproved", headerName: "Date Approved or Rejected", flex: 1, type: "date" },
];

export function ReimbursementTable({
  rows,
  deleteReimbursement,
  fetchReimbursements,
  fetchReimbursementByUserId,
}: TableProps) {
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>();
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
  const [selectedRowPurchases, setSelectedRowPurchases] = React.useState<
    Purchase[]
  >([]);
  const { fetchPurchaseByReimId } = usePurchaseFunctions();
  const getRelatedPurchases = async (reimId: number) => {
    const purchases = await fetchPurchaseByReimId(reimId);
    setSelectedRowPurchases(purchases);
  };
  const auth = useAuth();

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
          <Button onClick={() => {}} content="Approve" />
        </AdminOnlyWrapper>
        <AdminOnlyWrapper>
          <SpookyButton onClick={() => {}} content="Reject" />
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
