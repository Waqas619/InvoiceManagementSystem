import React, { useMemo, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./index.css";
import CustomButton from "../Button";
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
            width: "250px",
            cellRenderer: CustomCellRenderer,
            height: "200px",
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
        return { field: col, cellRenderer: CustomCellRenderer };
      }
    });
    return newColmns;
  };

  const onBtnExport = useCallback(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    let date = moment().format("YYYY-MM-DD-hhmmss");
    let fileName = `${user.FullName}_${date}.csv`;
    gridRef.current.api.exportDataAsCsv({ fileName });
  }, []);

  const CustomCellRenderer = (props) => {
    if (typeof props.value === "boolean") {
      return <span>{props.value.toString().toUpperCase()}</span>;
    } else {
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
            <CustomButton
              onClick={() => {
                debugger;
                props.value.handleClick(props.value.Id);
              }}
              text={props.value.name.toString().toUpperCase()}
            />
          </div>
        );
      } else {
        return <span>{props.value}</span>;
      }
    }
  };

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
  }));

  return (
    <div style={{ height: "350px" }}>
      {exportEnabled && (
        <div
          style={{
            margin: "10px 0",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <CustomButton onClick={onBtnExport} text="Export"></CustomButton>
        </div>
      )}
      <AgGridReact
        ref={gridRef}
        className="ag-theme-alpine"
        animateRows="true"
        columnDefs={getColumns(data[0])}
        defaultColDef={defaultColDef}
        gridOptions={{ suppressRowClickSelection: true }}
        enableRangeSelection="true"
        rowData={data}
      />
      {paginationEnabled && (
        <div
          style={{
            margin: "10px 0",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <CustomButton
            onClick={() => onPageChange(pageNumber - 1)}
            text="Previous"
            customStyle={{
              opacity: pageNumber === 0 ? "0.5" : "1",
              pointerEvents: pageNumber === 0 ? "none" : "all",
            }}
          ></CustomButton>
          <CustomButton
            customStyle={{
              fontFamily: "monospace !important",
              opacity: isNextButtonDisabled === true ? "0.5" : "1",
              pointerEvents: isNextButtonDisabled === true ? "none" : "all",
            }}
            onClick={() => onPageChange(pageNumber + 1)}
            text="Next"
          ></CustomButton>
        </div>
      )}
    </div>
  );
}

export default DataTable;
