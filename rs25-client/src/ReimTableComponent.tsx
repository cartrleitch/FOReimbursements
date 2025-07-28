import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import React from "react";
import { RedirectButton, Button } from "./Components";
import { DisplayOnlyPurchaseTable, Purchase } from "./PurTableComponent";
import { usePurchaseFunctions } from "./purchaseFunctions";
import { toast } from "react-toastify";
interface Reimbursement {
  id: number;
  vendorid: string;
  userid: string;
  payTo: string;
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
}

const columnns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1, hideable: false },
  { field: "vendorId", headerName: "VendorId", flex: 1, hideable: false },
  { field: "userId", headerName: "UserId", flex: 1, hideable: false },
  {
    field: "payTo",
    headerName: "Pay To",
    flex: 1,
    renderCell: (params) => {
      return "Vendor or User name";
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
  { field: "dateApproved", headerName: "Date Approved", flex: 1, type: "date" },
];

export function ReimbursementTable({
  rows,
  deleteReimbursement,
  fetchReimbursements,
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

  return (
    <div className="reim-table">
      <div className="table-button-div">
        <RedirectButton to="/create" content="New" />
        <Button onClick={fetchReimbursements} content="Refresh" />
        {/*<RedirectButton to="/update" content="Edit" />*/}
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
