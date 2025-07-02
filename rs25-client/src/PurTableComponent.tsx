import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import React from "react";
import { RedirectButton, Button } from "./Components";
interface Purchase {
    id: number;
    description: string;
    account: string;
    amount: string;
    date: string;
    reimId: string;
}

interface TableProps {
    rows: Purchase[];
}

const columnns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1, hideable: false },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "account", headerName: "Account", flex: 1 },
    {
        field: "amount",
        headerName: "Amount",
        flex: 1,
        type: "number",
        headerAlign: "left",
        align: "left",
    },
    {
        field: "date",
        headerName: "Date",
        flex: 1,
        type: "date",
        valueGetter: (value: any) => new Date(value),
    },
];

export function PurchaseTable({
    rows,
}: TableProps) {
    const [rowSelectionModel, setRowSelectionModel] =
        React.useState<GridRowSelectionModel>();
    const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);

    return (
        <div className="pur-table">
            <DataGrid
                rows={rows}
                columns={columnns}
                checkboxSelection
                disableMultipleRowSelection
                autoPageSize
                columnVisibilityModel={{ id: false }}
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(id) => {
                    setRowSelectionModel(id);
                    const selectedRowData = rows.find(
                        (row) => row.id === Array.from(id.ids)[0]
                    );
                    setSelectedRowId(selectedRowData?.id || null);
                }}
                rowSelectionModel={rowSelectionModel}
            />
            <br />
            <div className="pur-table-button-div">
                <Button content="Add Purchase" onClick={() => { console.log("Add Purchase clicked"); }} />
                <Button content="Remove Purchase" className="spooky-button" onClick={() => { console.log("Add Purchase clicked"); }} />
                {/*<Button onClick={fetchReimbursements} content="Refresh" />
                <RedirectButton to="/create" content="New" />
                <RedirectButton to="/update" content="Edit" />
                <Button
                    onClick={async () => {
                        if (selectedRowId !== null) {
                            deleteReimbursement(selectedRowId);
                        } else {
                            alert("No row selected!");
                        }
                    }}
                    content="Delete"
                    className="spooky-button"
                />*/}
            </div>
        </div>
    );
}
