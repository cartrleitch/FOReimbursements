import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import React from "react";
import {
  Button,
  InputField,
  InputFieldNumber,
  InputFieldTextArea,
  InputSelect,
  FileInput,
} from "./Components";

export interface Purchase {
  id: number;
  accountp: string;
  descriptionp: string;
  amountp: string;
  datep: string;
  reimId?: string;
  file?: File | null;
}

interface TableProps {
  rows: Purchase[];
  setRows: React.Dispatch<React.SetStateAction<Purchase[]>>;
}

const columnns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1, hideable: false },
  { field: "accountp", headerName: "Account", flex: 1 },
  { field: "descriptionp", headerName: "Description", flex: 1 },
  {
    field: "amountp",
    headerName: "Amount",
    flex: 1,
    type: "number",
    headerAlign: "left",
    align: "left",
  },
  {
    field: "datep",
    headerName: "Date",
    flex: 1,
    type: "date",
    valueGetter: (value: any) => new Date(value),
  },
  {
    field: "file",
    headerName: "Receipt",
    flex: 1,
    hideable: true,
    renderCell: (params) => {
      const file = params.row.file;
      if (file) {
        const fileURL = URL.createObjectURL(file);
        return (
          <a href={fileURL} download={file.name}>
            Download
          </a>
        );
      }
      return <span>No file</span>;
    },
  },
];

export function PurchaseTable({ rows, setRows }: TableProps) {
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>();
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [accountp, setAccount] = React.useState("");
  const [descriptionp, setDescription] = React.useState("");
  const [amountp, setAmount] = React.useState("");
  const [datep, setDate] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  const addPurchase = () => {
    if (!accountp || !descriptionp || !amountp || !datep) {
      alert("Please fill in all fields correctly.");
    } else {
      const newPurchase: Purchase = {
        id: rows.length + 1,
        accountp,
        descriptionp,
        amountp,
        datep,
        file,
      };
      setRows([...rows, newPurchase]);
      setAccount("");
      setDescription("");
      setAmount("");
      setDate("");
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = ""; // Clear the file input
      }
    }
  };

  const deletePurchase = () => {
    if (selectedRowId === null) {
      alert("Please select a purchase to delete.");
      return;
    }
    setRows(rows.filter((row) => row.id !== selectedRowId));
    setSelectedRowId(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div>
      <h3>Purchases</h3>
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
      </div>
      <div>
        <div className="pur-table-inputs">
          <InputSelect
            id="accountp"
            options={["Account 1", "Account 2", "Account 3"]}
            label="Account"
            onChange={(e) => setAccount(e.target.value)}
            value={accountp}
          />
          <InputFieldTextArea
            id="descriptionp"
            placeholder="Description"
            label="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={descriptionp}
          />
          <InputFieldNumber
            id="amountp"
            placeholder="Amount"
            type="number"
            label="Amount"
            step="0.01"
            min="0"
            onChange={(e) => setAmount(e.target.value)}
            value={amountp}
          />
          <InputField
            id="datep"
            placeholder="Date"
            type="date"
            label="Date"
            onChange={(e) => setDate(e.target.value)}
            value={datep}
          />
          <FileInput
            id="receipts"
            label="Receipts"
            onChange={handleFileChange}
            ref={inputRef}
          />
          <div className="pur-table-button-div">
            <Button
              content="Add Purchase"
              className="pur-table-normal-button"
              onClick={addPurchase}
            />
            <Button
              content="Remove Purchase"
              className="pur-table-spooky-button"
              onClick={deletePurchase}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface DisplayOnlyProps {
  rows: Purchase[];
}

const displayColumnns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1, hideable: false },
  { field: "account", headerName: "Account", flex: 1 },
  { field: "description", headerName: "Description", flex: 1 },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    type: "number",
    headerAlign: "left",
    align: "left",
  },
  {
    field: "purchaseDate",
    headerName: "Date",
    flex: 1,
    type: "date",
    valueGetter: (value: any) => new Date(value),
  },
  {
    field: "file",
    headerName: "Receipt",
    flex: 1,
    hideable: true,
    renderCell: (params) => {
      const fileName = params.row.fileName;
      const downloadUrl = `http://localhost:5000/api/receipt/download/${fileName}`;
      if (fileName) {
        return (
          <a href={downloadUrl} download={fileName}>
            Download
          </a>
        );
      }
      return <span>No file</span>;
    },
  },
];
export function DisplayOnlyPurchaseTable({ rows }: DisplayOnlyProps) {
  return (
    <div className="pur-table">
      <DataGrid
        rows={rows}
        columns={displayColumnns}
        autoPageSize
        columnVisibilityModel={{ id: false }}
      />
    </div>
  );
}
