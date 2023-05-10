import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-free-solid";

import { Controller, useForm } from "react-hook-form";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'

import DataManager from "../api/DataManager";
import Table from "./Table";
import Alert from "./Alert";

import config from "../config";

const status_t = {
  0: "Missing",
  1: "Exists"
};

const contract_type_t = {
  "CONTRACT": "CONTRACT",
  "PROJECT": "PROJECT",
  "OTHER": "OTHER"
};

String.prototype.toPascalCase = function () {
  const words = this.match(/[a-z]+/gi);
  if (!words) return "";
  return words
    .map(function (w) {
      return w.charAt(0).toUpperCase() + w.substr(1).toLowerCase();
    })
    .join(" ");
};

const Prefixes = () => {
  let navigate = useNavigate();
  const [prefixes, setPrefixes] = useState([]);

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getPrefixes().then((response) => setPrefixes(response));
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: null
      },
      {
        accessorFn: (row) => row.owner,
        id: "owner",
        cell: (info) => info.getValue(),
        header: () => <span>Owner</span>,
        footer: null
      },
      {
        accessorFn: (row) => row.domain_name,
        id: "domain",
        cell: (info) => info.getValue(),
        header: () => <span>Domain</span>,
        footer: null
      },
      {
        accessorFn: (row) => row.provider_name,
        id: "provider",
        cell: (info) => info.getValue(),
        header: () => <span>Provider</span>,
        footer: null
      },
      {
        id: "action",
        cell: (props) => (
          <div className="edit-buttons btn-group shadow">
            <Link
              className="btn btn-secondary btn-sm "
              to={`/prefixes/${props.row.original.id}`}>
              <FontAwesomeIcon icon="list" />
            </Link>
            <Link
              className="btn btn-secondary btn-sm "
              to={`/prefixes/${props.row.original.id}/update`}>
              <FontAwesomeIcon icon="edit" />
            </Link>
            <Link
              className="btn btn-secondary btn-sm "
              to={`/prefixes/${props.row.original.id}/delete`}>
              <FontAwesomeIcon icon="times" />
            </Link>
          </div>
        ),

        header: () => <span>Description</span>,
        footer: null,
        enableColumnFilter: false
      }
    ],
    []
  );

  return (
    <div>

      {prefixes && (
        <div className="col mx-4 mt-4 prefix-table">
          <h2 className="view-title">
            <i><FontAwesomeIcon icon="tags" size="lg" /></i>
            <span>Prefix List</span>
            <button className="btn btn-secondary mb-2"
              onClick={() => { navigate("/prefixes/add"); }}>
              <FontAwesomeIcon icon="plus" size="lg" /> Create new
            </button>
          </h2>

          <Table columns={columns} data={prefixes} />

        </div>
      )}
    </div>
  );
};

const PrefixDetails = (props) => {
  let params = useParams();
  let navigate = useNavigate();
  const [prefixes, setPrefixes] = useState([]);
  const [pidCount, setPIDCount] = useState(0);
  const [resolvableCount, setResolvablePIDCount] = useState(0);

  let prefix = {};
  if (prefixes) {
    prefixes.forEach((p) => {
      if (String(p.id) === params.id) {
        prefix = p;
      }
    });
  }

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getPrefixes().then((response) => setPrefixes(response));
  }, []);

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    let prefix = {};
    if (prefixes) {
      prefixes.forEach((p) => {
        if (String(p.id) === params.id) {
          prefix = p;
        }
      });
    }
    if (prefix.name !== undefined) {
      DM.getPIDCountByPrefixID(prefix.name).then((response) => {
        if (!(response instanceof Object)) {
          setPIDCount(response);
        }
      });
    }
  });

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    let prefix = {};
    if (prefixes) {
      prefixes.forEach((p) => {
        if (String(p.id) === params.id) {
          prefix = p;
        }
      });
    }
    if (prefix.name !== undefined) {
      DM.getResolvablePIDCountByPrefixID(prefix.name).then((response) => {
        if (!(response instanceof Object)) {
          setResolvablePIDCount(response);
        }
      });
    }
  });

  if (isNaN(Number(params.id))) {
    return <Navigate to="/" replace={true} />;
  }

  const handleDelete = (id) => {
    let DM = new DataManager(config.endpoint);
    DM.deletePrefix(id).then(() => navigate("/prefixes"));
  };

  let deleteCard = null;

  if (props.toDelete) {
    deleteCard = (
      <div className="container">
        <div className="card border-danger mb-2">
          <div className="card-header border-danger text-danger text-center">
            <h5>
              <FontAwesomeIcon className="mx-3" icon="exclamation-triangle" />
              <strong>Prefix Deletion</strong>
            </h5>
          </div>
          <div className=" card-body border-danger text-center">
            Are you sure you want to delete prefix: <strong>{prefix.name}</strong> ?
          </div>
          <div className="card-footer border-danger text-danger text-center">
            <button
              className="btn btn-danger mr-2"
              onClick={() => {
                handleDelete(params.id);
              }}>
              Delete
            </button>
            <button
              onClick={() => {
                navigate("/prefixes");
              }}
              className="btn btn-dark">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    deleteCard = null;
  }

  // number of total pids
  let numPidTotal = 0
  // number of resolvable pids
  let numPidResolv = 0
  // number of non resolvable pids
  let numPidNonResolv = 0
  // number of unknown pids - data not yet given
  let numPidUnknown = 0
  // percentage of resolvable pids
  let numPidPercResolv = 0
  // number of users - data not yet given 
  let numUsers = 1

  // if data available process the numbers
  if (pidCount) {
    numPidTotal = parseInt(pidCount)

    if (resolvableCount) {
      numPidResolv = parseInt(resolvableCount)
      numPidNonResolv = numPidTotal - numPidResolv  
      numPidPercResolv = (numPidResolv * 100) / numPidTotal
    }
  }

  

  return (
    <div>
      {deleteCard}
      <div className="container">

      {/* prefix info starts here */}
      <div className="row">
            {/* left column (prefix side info panel) */}
            <div className="col-4">
              <div className="card mt-4 text-center">
                <span style={{ 'fontSize': '5rem' }}>📦</span>
                <h5 className="mx-4 pb-2 border-bottom">Prefix: {prefix && prefix.name}</h5>
                
                <div className="row px-4 py-2">
                  <div className="row">
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">Service: </div>
                        </div>
                        <span type="text" className="form-control" > {prefix && prefix.service_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">Provider: </div>
                        </div>
                        <span type="text" className="form-control" > {prefix && prefix.provider_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">Domain: </div>
                        </div>
                        <span type="text" className="form-control" > {prefix && prefix.domain_name}</span>
                      </div>
                    </div>
                  </div>
                  
                  {prefix && prefix.owner &&
                  <div className="row">
                    <div className="col-auto">
                        <div className="input-group mb-2">
                          <div className="input-group-prepend">
                            <div className="input-group-text">Owner: </div>
                          </div>
                          <span type="text" className="form-control" > {prefix.owner}</span>
                        </div>
                    </div>
                  </div>
                    
                  }
                  { prefix && prefix.contact_name &&
                  <div className="row">
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">Contact Name: </div>
                        </div>
                        <span type="text" className="form-control" > {prefix.contact_name}</span>
                      </div>
                    </div>
                  </div>
                  }
                  { prefix && prefix.contact_email &&
                  <div className="row">
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">Contact Email: </div>
                        </div>
                        <span type="text" className="form-control" > {prefix.contact_email}</span>
                      </div>
                    </div>
                  </div>
                  }
                  { prefix && prefix.contract_end &&
                  <div className="row">
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">Contract End: </div>
                        </div>
                        <span type="text" className="form-control" > {prefix.contract_end}</span>
                      </div>
                    </div>
                  </div>
                  }
                  { prefix && prefix.contract_type &&
                  <div className="row">
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">Contract Type: </div>
                        </div>
                        <span type="text" className="form-control" > {prefix.contract_type}</span>
                      </div>
                    </div>
                  </div>
                  }
                  {prefix && prefix.lookup_service_type &&
                  <div className="row">
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">Lookup Type: </div>
                        </div>
                        <span type="text" className="form-control" > {prefix.lookup_service_type}</span>
                      </div>
                    </div>
                  </div>
                  }
                  {prefix && prefix.used_by &&
                  <div className="row">
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">Used By: </div>
                        </div>
                        <span type="text" className="form-control" > {prefix.used_by}</span>
                      </div>
                    </div>
                  </div>
                  }
              </div>
            </div>

          </div>

          {pidCount > 0 && resolvableCount && 
          <>
           {/* middle layout column starts */}
          <div className="col-4">

              {/* Handle number dashboard  */}
              <div className="card mt-4 px-4 py-2">
                <div className="row" style={{'fontSize':'1.6rem'}}>
                  <div className="col-6">
                  Handles
                  </div>
                  <div className="col-6" style={{'textAlign':'right'}}>
                  <code className="num num-default">{numPidTotal}</code>
                  {" "}<i style={{'color':'lightgrey'}}><FontAwesomeIcon icon="tags" /></i>
                  </div>
                </div>
              </div>
          

              {/* Resolvable percentage dashboard element */}
              <div className="card mt-4 px-4 py-3">
                <div className="row" style={{'fontSize':'1.26rem', 'fontWeight':'500'}}>
                    <div className="col-6">
                    Resolvable
                    </div>
                    <div className="col-6" style={{'textAlign':'right'}}>
                    <code style={{'fontWeight':'bold'}} className="num-default">{Math.round(numPidPercResolv)}%</code>
                    </div>
                </div>
                <div className="progress mt-2" style={{"height": "5px"}}>
                  <div className="progress-bar" role="progressbar" style={{'width': numPidPercResolv + '%'}} aria-valuenow={{numPidPercResolv}} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
             
          </div>
      

         {/* third layout column (left)  */}
          <div className="col-4">
              {/* User number dashboard element */}
              <div className="card mt-4 px-4 py-2">
                <div className="row" style={{'fontSize':'1.6rem'}}>
                  <div className="col-6">
                  Users
                  </div>
                  <div className="col-6" style={{'textAlign':'right'}}>
                  <code className="num num-default">{numUsers}</code>
                  {" "}<i style={{'color':'lightgrey'}}><FontAwesomeIcon icon="user" /></i>
                  </div>
                </div>

              </div>
           

              {/* Statistics dashboard element*/}
              <div className="card mt-4 px-4 py-3">
                <span className="border-bottom pb-1" style={{'fontSize':'1.26rem','fontWeight':'500'}}>Statistics</span>
                  <div className="mt-2" style={{'fontSize':'1rem'}}>
                    <code className="num-sm num-ok">{numPidResolv}</code> out of <code className="num-sm num-default">{numPidTotal}</code> resolvable<br/>
                    <code className="num-sm num-critical">{numPidNonResolv}</code> out of <code className="num-sm num-default">{numPidTotal}</code> non-resolvable<br/>
                    <code className="num-sm num-unknown">{numPidUnknown}</code> out of <code className="num-sm num-default">{numPidTotal}</code> unknown<br/>
                  </div>
              </div>
              
          </div>
          </>
          }
          
          {/* Edit/Delete prefix buttons  */}
          <div className="text-center mt-4">
                <div className="btn-group shadow">
                  <Link
                    className="btn btn-secondary"
                    to={`/prefixes/${prefix.id}/update`}>
                    <FontAwesomeIcon icon="edit" /> Update Prefix
                  </Link>
                  <Link
                    className="btn btn-secondary"
                    to={`/prefixes/${prefix.id}/delete`}>
                    <FontAwesomeIcon icon="times" /> Delete Prefix
                  </Link>
                </div>
              </div>

            
      </div>

      {/* prefix info ends here */}

        
       
        <div className="card-footer">

        </div>
        <br />
        {props.toDelete === false ? (
          <button
            onClick={() => {
              navigate("/prefixes/");
            }}
            className="btn btn-dark">
            Back
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

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
              <div className="col-sm-10">
                <Field className="form-select" as="select" name={f}>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </Field>
              </div>
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

const PrefixAdd = () => {
  let navigate = useNavigate();

  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const dateFormat = "YYYY-MM-DD[T]HH:mm:ss[Z]"
  const [formDefaultValues, setDefaultFormValues] = useState({
    service_id: [],
    provider_id: [],
    domain_id: [],
    status: 1,
    owner: "",
    contact_name: "",
    contact_email: "",
    contract_end: "",
    contract_type: "",
    lookup_service_type: ""
  })

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: useMemo(() => {
      return formDefaultValues;
    }, [formDefaultValues]),
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const [providers, setProviders] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getProviders().then((response) => {
      setProviders(response);
    });
  }, []);

  const [domains, setDomains] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getDomains().then((response) => {
      setDomains(response);
    });
  }, []);

  const [services, setServices] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getServices().then((response) => {
      setServices(response);
    });
  }, []);

  const [lookup_service_types, setLookUpServiceTypes] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getReverseLookUpTypes().then((response) => {
      setLookUpServiceTypes(response);
    });
  }, []);

  useEffect(() => {
    setDefaultFormValues(
      {
        ...formDefaultValues,
        ...{
          lookup_service_type: (lookup_service_types && lookup_service_types.length > 0 ? "" : formDefaultValues.lookup_service_type)
        }
      }
    );
    reset(
      {
        ...formDefaultValues,
        ...{
          lookup_service_type: formDefaultValues.lookup_service_type
        }
      }
    );
  }, [lookup_service_types]);

  const onformSubmit = (data) => {
    if (data["contract_end"] !== undefined && data["contract_end"] !== "") {
      data["contract_end"] = moment(data["contract_end"]).format(dateFormat);
    }
    let DM = new DataManager(config.endpoint);
    DM.addPrefix(data).then((r) => {
      setAlert(true);
      if (!("message" in r)) {
        setAlertType("success");
        setAlertMessage("Prefix succesfully created.");
        setTimeout(() => {
          navigate("/prefixes/");
        }, 2000);
      }
      else {
        setAlertType("danger");
        setAlertMessage(r["message"]);
      }
    })
  };

  const lookup_service_type_select = (
    <>
      <label htmlFor="status" className="form-label fw-bold">
        LookUp Type
      </label>
      <select
        className={`form-select ${errors.lookup_service_type ? "is-invalid" : ""}`}
        id="lookupServiceType"
        {...register("lookup_service_type", { required: false })}>
        <option disabled value="">
          Select Type
        </option>
        {lookup_service_types &&
          lookup_service_types.map((t, i) => {
            return (
              <option key={`type-${i}`} value={t}>
                {t}
              </option>
            );
          })}
      </select>
      {errors.lookup_service_type && (
        <div className="invalid-feedback">Lookup Service Type must be selected</div>
      )}
    </>
  );

  if (providers) {
    return (
      <div className="container">
        {alert &&
          <Alert type={alertType} message={alertMessage} />
        }
        <form onSubmit={handleSubmit(onformSubmit)}>
          <div className="row mt-4 text-start">
            <h2>Create new prefix</h2>
            <div className="mb-3 mt-4">
              <label htmlFor="prefixName" className="form-label fw-bold">
                Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                id="prefixName"
                aria-describedby="prefixNameHelp"
                {...register("name", {
                  required: { value: true, message: "Name is required" },
                  minLength: { value: 3, message: "Minimum length is 3" }
                })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="serviceID" className="form-label fw-bold">
                Service
              </label>
              <select
                className={`form-select ${errors.service_id ? "is-invalid" : ""}`}
                id="serviceID"
                {...register("service_id", { required: true })}>
                <option disabled value="">
                  Select Service
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}{" "}
                  </option>
                ))}
              </select>
              {errors.service_id && (
                <div className="invalid-feedback">Service must be selected</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="providerID" className="form-label fw-bold">
                Provider
              </label>
              <select
                className={`form-select ${errors.provider_id ? "is-invalid" : ""}`}
                id="providerID"
                {...register("provider_id", { required: true })}>
                <option disabled value="">
                  Select Provider
                </option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
              {errors.provider_id && (
                <div className="invalid-feedback">Provider must be selected</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="domainID" className="form-label fw-bold">
                Domain
              </label>
              <select
                className={`form-select ${errors.domain_id ? "is-invalid" : ""}`}
                id="domainID"
                {...register("domain_id", { required: true })}>
                <option disabled value="">
                  Select Domain
                </option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}{" "}
                  </option>
                ))}
              </select>
              {errors.domain_id && <div className="invalid-feedback">Domain must be selected</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="owner" className="form-label fw-bold">
                Owner
              </label>
              <input
                type="text"
                className={`form-control ${errors.owner ? "is-invalid" : ""}`}
                id="owner"
                {...register("owner", {
                  required: { value: false, message: "Owner is required" },
                  minLength: { value: 3, message: "Minimum length is 3" }
                })}
              />
              {errors.owner && <div className="invalid-feedback">{errors.owner.message}</div>}
            </div>
            <div className="mb-3 mt-4">
              <label htmlFor="prefixContactName" className="form-label fw-bold">
                Contact Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.contact_name ? "is-invalid" : ""}`}
                id="prefixContactName"
                aria-describedby="prefixContactNameHelp"
                {...register("contact_name", {
                  required: { value: false, message: "Contact Name is required" },
                  minLength: { value: 3, message: "Minimum length is 3" }
                })}
              />
              {errors.contact_name && <div className="invalid-feedback">{errors.contact_name.message}</div>}
            </div>
            <div className="mb-3 mt-4">
              <label htmlFor="prefixContactEmail" className="form-label fw-bold">
                Contact Email
              </label>
              <input
                type="text"
                className={`form-control ${errors.contact_name ? "is-invalid" : ""}`}
                id="prefixContactEmail"
                aria-describedby="prefixContactEmailHelp"
                {...register("contact_email", {
                  pattern: {
                    value: /(\S)+|(\S+@\S+\.\S+)/,
                    message: "Entered value does not match email format"
                  }
                })}
              />
              {errors.contact_email && <div className="invalid-feedback">{errors.contact_email.message}</div>}
            </div>
            <div className="mb-3 mt-4">
              <label htmlFor="prefixContractEndDate" className="form-label fw-bold">
                Contract End Date
              </label>
              <Controller
                control={control}
                name='contract_end'
                render={({ field }) => (
                  <DatePicker
                    className={`form-control ${errors.contract_end ? "is-invalid" : ""}`}
                    placeholderText='Select date'
                    onChange={(date) => {field.onChange(date)}}
                    selected={field.value}
                  />
              )}
              />
              {errors.contract_end && <div className="invalid-feedback">{errors.contract_end.message}</div>}
            </div>
            <div className="mb-3 mt-4">
              <label htmlFor="prefixContractType" className="form-label fw-bold">
                Contract Type
              </label>
              <select
                className={`form-select ${errors.contract_type ? "is-invalid" : ""}`}
                id="prefixContractType"
                {...register("contract_type", { required: false })}>
                <option disabled value="">
                  Select Contract Type
                </option>
                {Object.entries(contract_type_t).map((contract) => (
                  <option key={"contract-"+contract[0]} value={contract[0]}>
                    {contract[0]}
                  </option>
                ))}
              </select>
              {errors.contract_type && <div className="invalid-feedback">{errors.contract_type.message}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="usedBy" className="form-label fw-bold">
                Used by
              </label>
              <input
                type="text"
                className={`form-control ${errors.used_by ? "is-invalid" : ""}`}
                id="usedBy"
                {...register("used_by", {
                  required: { value: false, message: "Used By is required" },
                  minLength: { value: 3, message: "Minimum length is 3" }
                })}
              />
              {errors.used_by && <div className="invalid-feedback">{errors.used_by.message}</div>}
            </div>
            <div className="mb-3">
              {lookup_service_types && lookup_service_types.length > 0
                ? lookup_service_type_select
                : null}
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label fw-bold">
                Status
              </label>
              <select
                className={`form-select ${errors.status ? "is-invalid" : ""}`}
                id="status"
                {...register("status", { required: false })}>
                <option disabled value="">
                  Select Status
                </option>
                <option key="status-0" value="1">
                  {status_t["1"]}
                </option>
                <option key="status-1" value="0">
                  {status_t["0"]}
                </option>
              </select>
              {errors.status && <div className="invalid-feedback">Status must be selected</div>}
            </div>
          </div>
          <div className="row text-end">
            <div className="column col-10"></div>
            <div className="column col-2 d-flex justify-content-end">
              <button
                type="submit"
                value="Submit"
                className="btn btn-primary"
                style={{ marginRight: "1rem" }}>
                Create
              </button>
              <button
                onClick={() => {
                  navigate("/prefixes/");
                }}
                className="btn btn-dark">
                Back
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  } else {
    return <></>;
  }
};

const PrefixUpdate = () => {
  let params = useParams();
  let navigate = useNavigate();

  const [defaultFormValues, setDefaultFormValues] = useState({});
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const dateFormat = "YYYY-MM-DD[T]HH:mm:ss[Z]";

  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getPrefixes(params.id).then((response) => {
      const d = {
        name: response.name,
        service_id: response.service_id,
        provider_id: response.provider_id,
        domain_id: response.provider_id,
        owner: response.owner,
        contact_name: response.contact_name,
        contact_email: response.contact_email,
        contract_end: response.contract_end !== null ? moment(response.contract_end, dateFormat).toDate() : "",
        contract_type: response.contract_type,
        used_by: response.used_by,
        status: response.status,
        lookup_service_type: response.lookup_service_type
      };
      setDefaultFormValues(d)
      reset(d);
    });
  }, [params.id]);

  const [providers, setProviders] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getProviders().then((response) => {
      setProviders(response);
    });
  }, []);

  const [domains, setDomains] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getDomains().then((response) => {
      setDomains(response);
    });
  }, []);

  const [services, setServices] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getServices().then((response) => {
      setServices(response);
    });
  }, []);

  const [lookup_service_types, setLookUpServiceTypes] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getReverseLookUpTypes().then((response) => {
      setLookUpServiceTypes(response);
    });
  }, []);

  const onformSubmit = (data) => {
    let DM = new DataManager(config.endpoint);
    let method = "PATCH";

    if (data["contract_end"] !== undefined && data["contract_end"] !== "") {
      data["contract_end"] = moment(data["contract_end"]).format(dateFormat);
    }

    let intersection = {};
    for (let key in data) {
      if (key in defaultFormValues && data[key] !== defaultFormValues[key]) {
        intersection[key] = data[key];
      }
    }

    let updated_keys = Object.keys(defaultFormValues);
    let total_keys = Object.keys(intersection);
    if (updated_keys.filter((x) => total_keys.includes(x)).length === total_keys.length) {
      for (const [key] of Object.entries(defaultFormValues)) {
        if (defaultFormValues[key] === intersection[key]) {
          method = "PUT";
        }
      }
    }

    DM.updatePrefix(params.id, method, intersection).then((r) => {
      setAlert(true);
      if (!("message" in r)) {
        setAlertType("success");
        setAlertMessage("Prefix succesfully updated.");
        setTimeout(() => {
          navigate("/prefixes/");
        }, 2000);
      }
      else {
        setAlertType("danger");
        setAlertMessage(r["message"]);
      }
    });
  };

  const lookup_service_type_select = (
    <>
      <label htmlFor="status" className="form-label fw-bold">
        LookUp Type
      </label>
      <select
        className={`form-select ${errors.lookup_service_type ? "is-invalid" : ""}`}
        id="lookupServiceType"
        {...register("lookup_service_type", { required: false })}>
        <option disabled value="">
          Select Type
        </option>
        {lookup_service_types &&
          lookup_service_types.map((t, i) => {
            return (
              <option key={`type-${i}`} value={t}>
                {t}
              </option>
            );
          })}
      </select>
      {errors.lookup_service_type && (
        <div className="invalid-feedback">Lookup Service Type must be selected</div>
      )}
    </>
  );

  return (
    <div className="container">
      {alert &&
        <Alert type={alertType} message={alertMessage} />
      }
      <form onSubmit={handleSubmit(onformSubmit)}>
        <div className="row text-start mt-4">
          <h2>Update prefix</h2>
          <div className="mb-3 mt-4">
            <label htmlFor="prefixName" className="form-label fw-bold">
              Name
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="prefixName"
              aria-describedby="prefixNameHelp"
              {...register("name", {
                required: { value: true, message: "Name is required" },
                minLength: { value: 3, message: "Minimum length is 3" }
              })}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="serviceID" className="form-label fw-bold">
              Service
            </label>
            <select
              className={`form-select ${errors.service_id ? "is-invalid" : ""}`}
              id="serviceID"
              {...register("service_id", { required: true })}>
              <option disabled value="">
                Select Service
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}{" "}
                </option>
              ))}
            </select>
            {errors.service_id && (
              <div className="invalid-feedback">Service must be selected</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="providerID" className="form-label fw-bold">
              Provider
            </label>
            <select
              className={`form-select ${errors.provider_id ? "is-invalid" : ""}`}
              id="providerID"
              {...register("provider_id", { required: true })}>
              <option disabled value="">
                Select Provider
              </option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
            {errors.provider_id && (
              <div className="invalid-feedback">Provider must be selected</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="domainID" className="form-label fw-bold">
              Domain
            </label>
            <select
              className={`form-select ${errors.domain_id ? "is-invalid" : ""}`}
              id="domainID"
              {...register("domain_id", { required: true })}>
              <option disabled value="">
                Select Domain
              </option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}{" "}
                </option>
              ))}
            </select>
            {errors.domain_id && <div className="invalid-feedback">Domain must be selected</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="owner" className="form-label fw-bold">
              Owner
            </label>
            <input
              type="text"
              className={`form-control ${errors.owner ? "is-invalid" : ""}`}
              id="owner"
              {...register("owner", {
                required: { value: false, message: "Owner is required" },
                minLength: { value: 3, message: "Minimum length is 3" }
              })}
            />
            {errors.owner && <div className="invalid-feedback">{errors.owner.message}</div>}
            </div>
            <div className="mb-3 mt-4">
              <label htmlFor="prefixContactName" className="form-label fw-bold">
                Contact Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.contact_name ? "is-invalid" : ""}`}
                id="prefixContactName"
                aria-describedby="prefixContactNameHelp"
                {...register("contact_name", {
                  required: { value: false, message: "Contact Name is required" },
                  minLength: { value: 3, message: "Minimum length is 3" }
                })}
              />
              {errors.contact_name && <div className="invalid-feedback">{errors.contact_name.message}</div>}
            </div>
            <div className="mb-3 mt-4">
              <label htmlFor="prefixContactEmail" className="form-label fw-bold">
                Contact Email
              </label>
              <input
                type="text"
                className={`form-control ${errors.contact_email ? "is-invalid" : ""}`}
                id="prefixContactEmail"
                aria-describedby="prefixContactEmailHelp"
                {...register("contact_email", {
                  required: { value: false, message: "Contact Email is required" },
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format"
                  }
                })}
              />
              {errors.contact_email && <div className="invalid-feedback">{errors.contact_email.message}</div>}
          </div>
          <div className="mb-3 mt-4">
              <label htmlFor="prefixContractEnd" className="form-label fw-bold">
                Contract End Date
              </label>
              <Controller
                control={control}
                name='contract_end'
                render={({ field }) => (
                  <DatePicker
                    className={`form-control ${errors.contract_end ? "is-invalid" : ""}`}
                    placeholderText='Select date'
                    onChange={(date) => {field.onChange(date)}}
                    selected={field.value}
                  />
              )}
              />
              {errors.contract_end && <div className="invalid-feedback">{errors.contract_end.message}</div>}
            </div>
            <div className="mb-3 mt-4">
              <label htmlFor="prefixContractType" className="form-label fw-bold">
                Contract Type
              </label>
              <select
                className={`form-select ${errors.contract_type ? "is-invalid" : ""}`}
                id="prefixContractType"
                {...register("contract_type", { required: false })}>
                <option disabled value="">
                  Select Contract Type
                </option>
                {Object.entries(contract_type_t).map((contract) => (
                  <option key={"contract-"+contract[0]} value={contract[0]}>
                    {contract[0]}
                  </option>
                ))}
              </select>
              {errors.contract_type && <div className="invalid-feedback">{errors.contract_type.message}</div>}
            </div>
          <div className="mb-3">
            <label htmlFor="usedBy" className="form-label fw-bold">
              Used by
            </label>
            <input
              type="text"
              className={`form-control ${errors.used_by ? "is-invalid" : ""}`}
              id="usedBy"
              {...register("used_by", {
                required: { value: false, message: "Used By is required" },
                minLength: { value: 3, message: "Minimum length is 3" }
              })}
            />
            {errors.used_by && <div className="invalid-feedback">{errors.used_by.message}</div>}
          </div>
          <div className="mb-3">
            {lookup_service_types && lookup_service_types.length > 0
              ? lookup_service_type_select
              : null}
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label fw-bold">
              Status
            </label>
            <select
              className={`form-select ${errors.status ? "is-invalid" : ""}`}
              id="status"
              {...register("status", { required: false })}>
              <option disabled value="">
                Select Status
              </option>
              <option key="status-0" value="1">
                {status_t["1"]}
              </option>
              <option key="status-1" value="0">
                {status_t["0"]}
              </option>
            </select>
            {errors.status && <div className="invalid-feedback">Status must be selected</div>}
          </div>
        </div>
        <div className="row text-end">
          <div className="column col-10"></div>
          <div className="column col-2 d-flex justify-content-end">
            <button
              type="submit"
              value="Submit"
              className="btn btn-primary"
              style={{ marginRight: "1rem" }}>
              Update
            </button>
            <button
              onClick={() => {
                navigate("/prefixes/");
              }}
              className="btn btn-dark">
              Back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export { Prefixes, PrefixDetails, PrefixAdd, PrefixUpdate, PrefixLookup };
