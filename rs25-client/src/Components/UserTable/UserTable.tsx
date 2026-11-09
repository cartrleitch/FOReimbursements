import React from "react";
import { toast } from "react-toastify";
import { User, useAuth } from "../../Auth/AuthContext";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
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
}

export default function UserTable({ rows }: TableProps) {
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>();
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);

  const auth = useAuth();

  return (
    <div className="user-table">
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
  );
}
