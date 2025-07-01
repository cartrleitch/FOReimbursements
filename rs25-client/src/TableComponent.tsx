import { DataGrid, GridColDef } from '@mui/x-data-grid'; 

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
}

const columnns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 }, 
    { field: 'vendor', headerName: 'Vendor', width: 150 }, 
    { field: 'vendorAddress', headerName: 'Vendor Address', width: 200 }, 
    { field: 'vendorWebsite', headerName: 'Vendor Website', width: 150 }, 
    { field: 'totalAmount', headerName: 'Total Amount', width: 120, type: 'number' }, 
    { field: 'dateSubmitted', headerName: 'Date Submitted', width: 180, type: 'date' }, 
    { field: 'paymentMethod', headerName: 'Payment Method', width: 150 } 

];

export function ReimbursementTable({ rows }: TableProps) {
    return (
        <div className="reim-table">
            <DataGrid rows={rows} columns={columnns} checkboxSelection autoPageSize/> 
        </div>
    );
}