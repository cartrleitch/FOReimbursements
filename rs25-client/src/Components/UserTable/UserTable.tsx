import React from "react";
import { toast } from "react-toastify";
import { User } from "../../Auth/AuthContext";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
  SpookyButton,
  RedirectButton,
  Title,
} from "../UniversalComponents/UniversalComponents";
import { useApplicationUserFunctions } from "../../HelperFunctions/applicationUserFunctions";
import "./UserTable.css";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1, hideable: true },
  { field: "email", headerName: "Email", flex: 1, hideable: true },
  { field: "role", headerName: "Role", flex: 1, hideable: true },
  { field: "firstName", headerName: "First Name", flex: 1, hideable: true },
  { field: "lastName", headerName: "Last Name", flex: 1, hideable: true },
  { field: "phoneNumber", headerName: "Phone Number", flex: 1, hideable: true },
  { field: "address", headerName: "Address", flex: 1, hideable: true },
  { field: "city", headerName: "City", flex: 1, hideable: true },
  { field: "state", headerName: "State", flex: 1, hideable: true },
  { field: "zipCode", headerName: "Zip Code", flex: 1, hideable: true },
];

interface TableProps {
  rows: User[];
  onDelete: (userId: string) => Promise<void>;
}

export default function UserTable({ rows, onDelete }: TableProps) {
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>();
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);

  return (
    <div className="content">
      <div className="user-table">
        <Title content="User Dashboard" />
        <div className="user-table-button-div">
          <RedirectButton to="/Account/create" content="New" />
          <SpookyButton
            onClick={async () => {
              if (selectedRowId !== null) {
                const userChoice = confirm(
                  "Are you sure you want to delete this account? Reimbursements associated with this account will NOT be deleted.",
                );
                if (userChoice) {
                  try {
                    onDelete(selectedRowId);
                    toast.success("Account deleted successfully!");
                  } catch (error) {
                    toast.error("Failed to delete account.");
                  }
                }
              } else {
                toast.error("No row selected!");
              }
            }}
            content="Delete"
          />
        </div>
        <DataGrid
          rows={rows}
          columns={columns}
          columnVisibilityModel={{ id: false }}
          checkboxSelection
          disableMultipleRowSelection
          autoPageSize
          getRowId={(row) => row.id}
          onRowSelectionModelChange={(id) => {
            setRowSelectionModel(id);
            const selectedRowData = rows.find(
              (row) => row.id === Array.from(id.ids)[0],
            );
            setSelectedRowId(selectedRowData?.id || null);
          }}
          rowSelectionModel={rowSelectionModel}
        />
      </div>
    </div>
  );
}
