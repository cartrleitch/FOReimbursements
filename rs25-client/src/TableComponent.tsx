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
    { field: 'id', headerName: 'ID', flex: 1, hideable : false }, 
    { field: 'vendor', headerName: 'Vendor', flex: 1 }, 
    { field: 'vendorAddress', headerName: 'Vendor Address', flex: 1 }, 
    { field: 'vendorWebsite', headerName: 'Vendor Website', flex: 1 }, 
    { field: 'totalAmount', headerName: 'Total Amount', flex: 1, type: 'number', headerAlign: 'left' }, 
    { field: 'dateSubmitted', headerName: 'Date Submitted', flex: 1, type: 'date', valueGetter: (params : any) => params.value ? new Date(params.value) : null}, 
    { field: 'paymentMethod', headerName: 'Payment Method', flex: 1 } 

];

export function ReimbursementTable({ rows }: TableProps) {
    return (
        <div className="reim-table">
            <DataGrid rows={rows} columns={columnns} checkboxSelection disableMultipleRowSelection autoPageSize columnVisibilityModel={{id: false}} /> 
        </div>
    );
}