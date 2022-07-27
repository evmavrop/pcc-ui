import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

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
              <Link className="btn btn-light btn-sm ml-1 mr-1" to={"#"} >
                 <FontAwesomeIcon icon="list" />
              </Link>
           </div>
        ),
        header: () => <span>Description</span>,
        footer: null,
        enableColumnFilter: false,
      },
    ],
    []
  );

  return (
    <div>
      {prefixes && <Table columns={columns} data={prefixes} />}
    </div>
  );
};

export default Prefixes;