import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free-solid'

import DataManager from "../api/DataManager";
import Table from "./Table";

const Domains = () => {

  const [domains, setDomains] = useState([]);

  useEffect(() => {
    let DM = new DataManager("localhost:8080/v1");
    DM.getDomains().then((response) => setDomains(response));
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.domain_id,
        id: "id",
        cell: (info) => info.getValue(),
        header: () => <span>ID</span>,
        footer: null,
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: null,
      },
      {
        accessorFn: (row) => row.description,
        id: "description",
        cell: (info) => info.getValue(),
        header: () => <span>Description</span>,
        footer: null,
      },
      {
        id: "action",
        cell: props => (
          <div className="edit-buttons">
            <Link
              className="btn btn-light btn-sm ml-1 mr-1"
              to={"#"}
            >
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
      {domains && <Table columns={columns} data={domains} />}
    </div>
  );
};

export default Domains;
