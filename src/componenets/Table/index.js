import React, { useMemo, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./index.css";
import { Button } from "antd";
import moment from "moment/moment";

function DataTable(props) {
  const {
    data = [],
    exportEnabled = false,
    paginationEnabled = false,
    pageNumber = 0,
    onPageChange = () => {},
    isNextButtonDisabled = false,
  } = props;
  const gridRef = useRef();

  const getColumns = (columns) => {
    let newColmns = Object.keys(columns).map((col) => {
      if (Object.keys(columns).includes("Action")) {
        if (col === "Action") {
          return {
            field: col,
            // minWidth: "250px",
            flex: 1,
            cellRenderer: CustomCellRenderer,
            filter: false,
            sortable: false,
          };
        } else {
          return {
            field: col,
            flex: 1,
            cellRenderer: CustomCellRenderer,
            height: "200px",
          };
        }
      } else {
        return { field: col, cellRenderer: CustomCellRenderer, flex: 1 };
      }
    });
    return newColmns;
  };

  const CustomCellRenderer = (props) => {
    if (typeof props.value === "boolean") {
      return <span>{props.value.toString().toUpperCase()}</span>;
    }
    if (props.column.colId === "Action") {
      return (
        <div
          style={{
            margin: "0px !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "200px",
            height: "100%",
            fontSize: "5px",
          }}
        >
          <Button
            onClick={() => {
              props.value.handleClick(props.value.Id);
            }}
          >
            {props.value.name.toString().toUpperCase()}
          </Button>
        </div>
      );
    } else {
      return <span>{props.value}</span>;
    }
  };

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
  }));

  return (
    <div style={{ height: "350px" }}>
      <AgGridReact
        ref={gridRef}
        className="ag-theme-alpine"
        animateRows="true"
        columnDefs={getColumns(data[0])}
        defaultColDef={defaultColDef}
        gridOptions={{ suppressRowSelection: true }}
        enableRangeSelection="true"
        rowData={data}
      />
    </div>
  );
}

export default DataTable;
