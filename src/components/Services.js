import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free-solid'

import DataManager from "../api/DataManager";
import Table from "./Table";

import config from "../config";

const Services = () => {

  const [services, setServices] = useState([]);

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getServices().then((response) => setServices(response));
  }, []);

  const columns = useMemo(
    () => [

      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: null,
        enableColumnFilter : false,
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
    <div className="mt-4 mx-4">
      <h2 className="view-title">
          <i><FontAwesomeIcon icon="flag" size="lg" /></i>
          <span>Services List</span>
        </h2>
      {services && <Table columns={columns} data={services}  />}
    </div>
  );
};

export default Services;
