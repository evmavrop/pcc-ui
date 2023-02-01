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
     
        <table className="table table-striped table-hover">
          <thead className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                            {header.column.getCanFilter() ? (
                              <div className="d-flex flex-column">
                                <Filter column={header.column} table={table} />
                              </div>
                            ) : null}
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
                    let itemData = cell.getValue()
                   
                    if (!Array.isArray(itemData)) {
                    return (
                      <td key={cell.id} className="align-middle">
                            
                            {
                              
                              flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          
                      </td>
                    );} else {
                      let results = []
                      
                      for (let i=0; i<itemData.length; i++) {
                        console.log("lala", itemData[i])
                        results.push(<tr><td align="right" >{itemData[i].type}: </td><td>{itemData[i].value}</td></tr>)
                      }
                     
                      return (
                        
                        <td key={cell.id} className="align-middle">
                            <table className="table table-sm table-striped table-bordered">
                              <tbody>
                                {results}
                              </tbody>
                            </table>
                            
                          
                      </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      
    );
  };

function Filter({ column, table }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <span
        style={{ fontWeight: "bold", fontSize: "1rem" }}
        onClick={column.getToggleSortingHandler()}
      >
        {column.id.charAt(0).toUpperCase()
          + column.id.slice(1)}
        {{
          asc: " ▲",
          desc: " ▼",
        }[column.getIsSorted()] || <span className="sort-indication"> ▲▼</span>}
        
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
      className="input"
      aria-label="Sizing example input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default Table;
