import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'; 
import React from 'react';
import { useReimbursementFunctions } from './reimbursementFunctions';
interface Reimbursement {
    id: number;
    vendor: string;
    vendorAddress: string;
    vendorWebsite: string;
    totalAmount: number;
    dateSubmitted: string;
    paymentMethod: string;
}

interface TableProps {
    rows: Reimbursement[];
    deleteReimbursement: (id: number) => Promise<void>;
}

const columnns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1, hideable: false }, 
    { field: 'vendor', headerName: 'Vendor', flex: 1 }, 
    { field: 'vendorAddress', headerName: 'Vendor Address', flex: 1 }, 
    { field: 'vendorWebsite', headerName: 'Vendor Website', flex: 1 }, 
    { field: 'totalAmount', headerName: 'Total Amount', flex: 1, type: 'number', headerAlign: 'left' }, 
    { field: 'dateSubmitted', headerName: 'Date Submitted', flex: 1, type: 'date', valueGetter: (params : any) => params.value ? new Date(params.value) : null}, 
    { field: 'paymentMethod', headerName: 'Payment Method', flex: 1 } 

];

export function ReimbursementTable({ rows, deleteReimbursement } : TableProps) {
    console.log("ReimbursementTable rows:", rows);
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>();
    const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
  
    return (
        <div className="reim-table">
            <DataGrid rows={rows} columns={columnns} checkboxSelection disableMultipleRowSelection autoPageSize columnVisibilityModel={{ id: false }}
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(id) => {
                    setRowSelectionModel(id);
                    const selectedRowData = rows.find((row) => row.id === Array.from(id.ids)[0]);
                    setSelectedRowId(selectedRowData?.id || null);
                    console.log(selectedRowData?.id);
                }}
                rowSelectionModel={rowSelectionModel}
            /> 
            <button
                onClick={async () => {
                    console.log(selectedRowId);
                    if (selectedRowId !== null) {
                        deleteReimbursement(selectedRowId)
                    } else {
                        alert("No row selected!");
                    }
                }}
                disabled={selectedRowId === null}
                className="normal-button"
            >
                Delete Selected Row
            </button>
        </div>
    );
}