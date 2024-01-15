import React, { useEffect, useState, useMemo, useRef } from "react";
import { Formik, Field, Form } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataManager from "../../api/DataManager";
import config from "../../config";
import Table from "../Table";



const PrefixLookup = () => {
    const [filters, setReverseLookUpFilters] = useState([]);
    const [handles, setHandles] = useState([]);
    const [handlesNextPage, setHandlesNextPage] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
  
    useEffect(() => {
      let DM = new DataManager(config.endpoint);
      DM.getReverseLookUpFilters().then((response) => setReverseLookUpFilters(response));
    }, []);
  
    useEffect(() => {
      let DM = new DataManager(config.endpoint);
      if (ref.current !== null) {
        DM.reverseLookUp(pageIndex, pageSize, { filters: ref.current.values }).then((response) => {
          setHandles(flattenhandles(response));
        });
        DM.reverseLookUp(pageIndex + 1, pageSize, { filters: ref.current.values }).then(
          (response) => {
            setHandlesNextPage(flattenhandles(response));
          }
        );
      }
    }, [pageIndex, pageSize]);
  
    const ref = useRef(null);
    const checksum_type = useRef("CHECKSUM");
    const checksum_value = useRef("");
  
    let filtersDiv = [];
  
    const columnsDetailed = useMemo(
      () => [
        {
          accessorFn: (row) => row.handle,
          id: "handle",
          cell: (info) => info.getValue(),
          header: () => <span>Handle</span>,
          enableSorting: false,
          footer: null
        },
        {
          accessorFn: (row) => row.values,
          id: "type",
          enableSorting: false,
          enableColumnFilter: false
        },
        {
          accessorFn: (row) => row.values.type,
          id: "value",
          enableSorting: false,
          enableColumnFilter: false
        }
      ],
      []
    );
  
    const columns = useMemo(
      () => [
        {
          accessorFn: (row) => row.handle,
          id: "handle",
          cell: (info) => info.getValue(),
          header: () => <span>Handle</span>,
          footer: null
        }
      ],
      []
    );
  
    const filtersDivCreate = () => {
      filtersDiv = [];
      let checksumOptions = [];
      filters &&
        filters.length > 0 &&
        filters.forEach((f, i) => {
          if (f === "RETRIEVE_RECORDS") {
            filtersDiv.push(
              <div key={"filter-div-" + i} className="mb-3 row">
                <label className="col-sm-2 col-form-label">{f.toPascalCase()}</label>
                <div className="col-sm-2">
                  <Field className="form-select" as="select" name={f}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Field>
                </div>
                 <div className="col-sm-8">If set to True: the output will be a full Handle record. if set to False: the output will be a list of Handles.</div> 
              </div>
            );
          } else if (f == "CHECKSUM" || f == "EUDAT_CHECKSUM") {
            checksumOptions.push(
              <option key={"checksum-option-" + i} value={f}>{f}</option>
            );
          }
          else {
            filtersDiv.push(
              <div key={"filter-div-" + i} className="mb-3 row">
                <label className="col-sm-2 col-form-label">{f.toPascalCase()}</label>
                <div className="col-sm-10">
                  <Field
                    id={"formik-field-id-" + f}
                    type="text"
                    className="form-control"
                    name={f}></Field>
                </div>
              </div>
            );
          }
        });
      if (checksumOptions) {
        filtersDiv.push(
          <div key={"filter-div-checksum"} className="mb-3 row">
            <label className="col-sm-2 col-form-label">Checksum</label>
            <div className="col-sm-4">
              <Field id={"formik-field-id-checksum-option"} className="form-select" as="select" name="checksum-option" 
              onChange={(e) => {
                ref.current.handleChange(e);
                checksum_type.current = e.currentTarget.value;
              }}>
                {checksumOptions}
              </Field>
            </div>
            <div className="col-sm-6">
              <Field
                id={"formik-field-id-checksum"}
                type="text"
                className="form-control"
                name="checksum-value"
                onChange={(e) => {
                  ref.current.handleChange(e);
                  checksum_value.current = e.currentTarget.value;
                }}
              >
                </Field>
            </div>
          </div>
        );
      }
    };
  
    const filtersFormikInitialize = () => {
      let d = {};
      if (filters) {
        filters.forEach((f) => {
          if (f === "RETRIEVE_RECORDS") {
            d[f] = "false";
          }
          else {
            d[f] = "";
          }
        });
      }
      d["checksum-option"] = "CHECKSUM";
      d["checksum-value"] = "";
      return d;
    };
  
    const formikSetValues = () => {
      let d = {};
      if (filters) {
        filters.forEach((f) => {
          if (f === "RETRIEVE_RECORDS") {
            d[f] = "false";
          }
          else {
            d[f] = "";
          }
        });
      }
      d["checksum-option"] = "CHECKSUM";
      d["checksum-value"] = "";
      ref.current.setValues(d);
    };
  
    const flattenhandles = (handles) => {
      return handles;
    };
  
    filtersDivCreate();
  
    let cols = [];
    let rowspanenabled = false;
    if (handles && handles.length > 0 && handles[0].values.length > 0) {
      cols = columnsDetailed;
      rowspanenabled = true;
    } else {
      cols = columns;
      rowspanenabled = false;
    }
  
    return (
      <div className="container">
        <h2 className="view-title mt-4 mb-4">
          <i><FontAwesomeIcon icon="search" size="lg" /></i>
          <span>Lookup</span>
  
        </h2>
        {filters && filters.length > 0 && (
          <>
            <Formik
              innerRef={ref}
              enableReinitialize={true}
              initialValues={filtersFormikInitialize()}
              onSubmit={(data) => {
                // Handle Checksum
                data["CHECKSUM"] = "";
                data["EUDAT_CHECKSUM"] = "";
                data[checksum_type.current] = checksum_value.current;
                delete data["checksum-option"];
                delete data["checksum-value"];
                // FIXME: Workaround for the LOC filter. Move its value to URL filter and parse response
                let tmp = false;
                if (data["LOC"] !== "") {
                  data["URL"] = data["LOC"];
                  data["LOC"] = "";
                  tmp = true;
                }
                let DM = new DataManager(config.endpoint);
                if (ref.current !== null) {
                  DM.reverseLookUp(pageIndex, pageSize, { filters: data }).then((response) => {
                    if (tmp) {
                      response.map(r => {
                        r.values.map(v => {
                          if (v["10320/LOC"] !== undefined) {
                            setHandles(flattenhandles(response));
                          }
                        });
                      });
                    }
                    else {
                      setHandles(flattenhandles(response));
                    }
                  });
                  DM.reverseLookUp(pageIndex + 1, pageSize, { filters: ref.current.values }).then(
                    (response) => {
                      if (tmp) {
                        response.map(r => {
                          if (r["values"].length > 0) {
                            r.values.map(v => {
                              if (v["10320/LOC"] !== undefined) {
                                setHandlesNextPage(flattenhandles(response));
                              }
                            });
                          }
                        });
                      }
                      else {
                        setHandlesNextPage(flattenhandles(response));
                      }
                    }
                  );
                }
                // FIXME: Revert the LOC filter value
                if (tmp) {
                  let v = data["URL"];
                  data["URL"] = "";
                  data["LOC"] = v;
                  tmp = false;
                }
                // This is crucial because the keys that are forbidden for the API call are
                // necessary for the formik
                data["checksum-option"] = checksum_type.current;
                data["checksum-value"] = checksum_value.current;
              }}>
              <Form>
                {filtersDiv}
                <button type="submit" className="btn btn-primary mb-3">
                  Submit
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    formikSetValues();
                  }}
                  className="btn btn-dark mb-3">
                  Clear
                </button>
              </Form>
            </Formik>
            <div className="row d-flex flex-column justify-content-between">
              <Table columns={cols} data={handles} rowspan={rowspanenabled} />
              <div className="flex items-center gap-2">
                <button
                  className="border rounded p-1"
                  onClick={() => {
                    setPageIndex(pageIndex - 1);
                  }}
                  disabled={pageIndex === 0 ? true : false}>
                  {"<"}
                </button>
                <button
                  className="border rounded p-1"
                  onClick={() => {
                    setPageIndex(pageIndex + 1);
                  }}
                  disabled={handlesNextPage.length === 0 ? true : false}>
                  {">"}
                </button>
                <span className="flex items-center gap-1">
                  <div>Page</div>
                  <strong>{pageIndex + 1}</strong>
                </span>
                <span className="flex items-center gap-1">
                  | Go to page:
                  <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0;
                      setPageIndex(page);
                    }}
                    disabled={handlesNextPage.length === 0 ? true : false}
                    className="border p-1 rounded w-16"
                  />
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  export default PrefixLookup;