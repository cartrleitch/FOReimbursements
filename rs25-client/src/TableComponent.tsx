import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'; 
import React from 'react';
import { RedirectButton, Button } from './Components';
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
    fetchReimbursements: () => Promise<void>;
}

const columnns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1, hideable: false }, 
    { field: 'vendor', headerName: 'Vendor', flex: 1 }, 
    { field: 'vendorAddress', headerName: 'Vendor Address', flex: 1 }, 
    { field: 'vendorWebsite', headerName: 'Vendor Website', flex: 1 }, 
    { field: 'totalAmount', headerName: 'Total Amount', flex: 1, type: 'number', headerAlign: 'left', align: 'left' }, 
    { field: 'dateSubmitted', headerName: 'Date Submitted', flex: 1, type: 'date', valueGetter: (value : any) => new Date(value)}, 
    { field: 'paymentMethod', headerName: 'Payment Method', flex: 1 } 

];

export function ReimbursementTable({ rows, deleteReimbursement, fetchReimbursements } : TableProps) {
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
                }}
                rowSelectionModel={rowSelectionModel}
            /> 
            <br />
            <div className="table-button-div">
                <Button onClick={fetchReimbursements} content="Refresh" />
                <RedirectButton to="/create" content="New" />
                <RedirectButton to="/update" content="Edit" />
                <Button onClick={async () => {
                    if (selectedRowId !== null) {
                        deleteReimbursement(selectedRowId)
                    } else {
                        alert("No row selected!");
                    }
                    }} content="Delete" />
            </div>
        </div>
    );
}