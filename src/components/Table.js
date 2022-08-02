import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";


const Table = (props) => {
  const data = props.data;
  const columns = props.columns;

  const [columnFilters, setColumnFilters] = React.useState([]);

  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <div className="card">
      <table className="table table-sm table-hover App-card1">
        <thead className="thead-light">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div style={{ cursor: "pointer" }}
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            style: header.column.getCanSort()
                              ? { cursor: "pointer" }
                              : {},
                          }}
                        >
                          {header.column.getCanFilter() ? (
                            <div className="d-flex flex-column">
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : <div className="d-flex flex-column"><span
                            style={{ fontWeight: "bold", fontSize: "1rem"}}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted()] || ""}
                            {header.column.id.charAt(0).toUpperCase()
                              + header.column.id.slice(1)}
                          </span>
                            <input
                              type="text"
                              className="form-control"
                              aria-label="Sizing example input"
                              style={{ visibility: "hidden" }}
                            />
                          </div>}
                        </div>
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="border-bottom">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      <div className="p-2">
                        <span className="d-block font-weight-bold">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

function Filter({ column, table }) {
  let firstValue = "";
  if (table.getPreFilteredRowModel().flatRows[0]) {
    firstValue = table.getPreFilteredRowModel().flatRows[0].getValue(column.id);
  }

  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <span
        style={{ fontWeight: "bold", fontSize: "1rem" }}
        onClick={column.getToggleSortingHandler()}
      >
        {{
          asc: " 🔼",
          desc: " 🔽",
        }[column.getIsSorted()] || ""}
        {column.id.charAt(0).toUpperCase()
          + column.id.slice(1)}
      </span>
      <DebouncedInput
        type="text"
        value={columnFilterValue || ""}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search...`}
        list={column.id + "list"}
      />
    </>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 100,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      type="text"
      className="form-control border"
      aria-label="Sizing example input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default Table;
