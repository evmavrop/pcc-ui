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
      {prefixes && <><div className="col">
        {<Link className="btn btn-light" to="/prefixes/add">
            <FontAwesomeIcon className="mr-2" icon="plus" size="lg" /> Create
            Prefix
          </Link>
        }
      </div><Table columns={columns} data={prefixes} /></>}
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

  const [name, setName] = useState("");
  const [service_id, setServiceID] = useState("");
  const [provider_id, setProviderID] = useState("");
  const [domain_id, setDomainID] = useState("");
  const [owner, setOwner] = useState("");
  const [used_by, setUsedBy] = useState("");
  const [status, setStatus] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleServiceIDChange = (event) => {
    setServiceID(event.target.value);
  }

  const handleProviderIDChange = (event) => {
    setProviderID(event.target.value);
  }

  const handleDomainIDChange = (event) => {
    setDomainID(event.target.value);
  }

  const handleOwnerChange = (event) => {
    setOwner(event.target.value);
  }

  const handleUsedByChange = (event) => {
    setUsedBy(event.target.value);
  }

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  }

  const handleSubmit = (event) => {
    let DM = new DataManager("localhost:8080/v1");

    const data = {
      "name": name,
      "service_id": service_id,
      "provider_id": provider_id,
      "domain_id": domain_id,
      "owner": owner,
      "used_by": used_by,
      "status": status,
    }

    DM.addPrefix(data).then((response) => { console.log(response) });
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="prefixName" className="form-label">Name</label>
        <input type="text" value={name} onChange={handleNameChange} className="form-control" id="prefixName" aria-describedby="prefixNameHelp" />
      </div>
      <div className="mb-3">
        <label htmlFor="serviceID" className="form-label">Service</label>
        <input type="text" value={service_id} onChange={handleServiceIDChange} className="form-control" id="serviceId" />
      </div>
      <div className="mb-3">
        <label htmlFor="providerID" className="form-label">Provider</label>
        <input type="text" value={provider_id} onChange={handleProviderIDChange} className="form-control" id="providerID" />
      </div>
      <div className="mb-3">
        <label htmlFor="domainID" className="form-label">Domain</label>
        <input type="text" value={domain_id} onChange={handleDomainIDChange} className="form-control" id="domainId" />
      </div>
      <div className="mb-3">
        <label htmlFor="owner" className="form-label">Owner</label>
        <input type="text" value={owner} onChange={handleOwnerChange} className="form-control" id="owner" />
      </div>
      <div className="mb-3">
        <label htmlFor="usedBy" className="form-label">Used by</label>
        <input type="text" value={used_by} onChange={handleUsedByChange} className="form-control" id="usedBy" />
      </div>
      <div className="mb-3">
        <label htmlFor="status" className="form-label">Status</label>
        <input type="text" value={status} onChange={handleStatusChange} className="form-control" id="status" />
      </div>
      <button type="submit" value="Submit" className="btn btn-primary">Submit</button>
    </form>
  )
}

export { Prefixes, PrefixDetails, PrefixAdd };