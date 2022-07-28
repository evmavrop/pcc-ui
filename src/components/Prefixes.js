import React, { useEffect, useState, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free-solid'

import DataManager from "../api/DataManager";
import Table from "./Table";

const Prefixes = () => {

  const [prefixes, setPrefixes] = useState([]);

  useEffect(() => {
    let DM = new DataManager("localhost:8080/v1");
    DM.getPrefixes().then((response) => setPrefixes(response));
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: null,
      },
      {
        accessorFn: (row) => row.owner,
        id: "owner",
        cell: (info) => info.getValue(),
        header: () => <span>Owner</span>,
        footer: null,
      },
      {
        accessorFn: (row) => row.domain_name,
        id: "domain",
        cell: (info) => info.getValue(),
        header: () => <span>Domain</span>,
        footer: null,
      },
      {
        accessorFn: (row) => row.provider_name,
        id: "provider",
        cell: (info) => info.getValue(),
        header: () => <span>Provider</span>,
        footer: null,
      },
      {
        id: "action",
        cell: props => (
          
          <div className="edit-buttons">
            <Link className="btn btn-light btn-sm ml-1 mr-1" to={`/prefixes/${props.row.original.id}`} >
              <FontAwesomeIcon icon="list" />
            </Link>
          </div>
        ),
        
        header: () => <span>Description</span>,
        footer: null,
        enableColumnFilter: false,
      }
      ,
    ],
    []
  );

  return (
    <div>
      {prefixes && <Table columns={columns} data={prefixes} />}
    </div>
  );
};

const PrefixDetails = () => {
  let params = useParams();
  const [prefix, setPrefix] = useState([]);

  useEffect(() => {
    console.log("in use effect prefix details")
    let DM = new DataManager("localhost:8080/v1");
    DM.getPrefixes(params.id).then((response) => setPrefix(response));
  }, []);

  if (isNaN(Number(params.id))) {
    return (<Navigate to="/" replace={true} />);
  }

  return (

    <form>
  <label>
    Name: {prefix && prefix.name}
  </label>
  <br></br>
  <label>
    Service: {prefix && prefix.service_name}
  </label>
  <br></br>
  <label>
    Provider: {prefix && prefix.provider_name}
  </label>
  <br></br>
  <label>
    Domain: {prefix && prefix.domain_name}
  </label>
  <br></br>
  
  <label>
    Owner: {prefix && prefix.owner}
  </label>
  <br></br>
  <label>
    Used By: {prefix && prefix.used_by}
  </label>
</form>
 )
}

const PrefixAdd = () => {
  
  return (<span>Add</span>)
}

export { Prefixes, PrefixDetails, PrefixAdd };