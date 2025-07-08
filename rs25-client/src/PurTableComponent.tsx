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
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
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
];

export function PurchaseTable({ rows, setRows, files, setFiles }: TableProps) {
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>();
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);

  const [accountp, setAccount] = React.useState("");
  const [descriptionp, setDescription] = React.useState("");
  const [amountp, setAmount] = React.useState("");
    const [datep, setDate] = React.useState("");
    const [file, setFile] = React.useState<File | null>(null);

  const addPurchase = () => {
      console.log(accountp + " " + descriptionp + " " + amountp + " " + datep + " " + file);
    if (!accountp || !descriptionp || !amountp || !datep) {
        console.log(accountp + " " + descriptionp + " " + amountp + " " + datep + " " + file);

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
    <div className="pur-table">
      <h3>Purchases</h3>
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
        <FileInput id="receipts" label="Receipts" onChange={handleFileChange} />
      </div>
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
  );
}
