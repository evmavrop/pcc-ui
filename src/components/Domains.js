import React, { useEffect, useState, useMemo } from "react";
import DataManager from "../api/DataManager";
import Table from "./Table";

import config from "../config";

const Domains = () => {

  const [domains, setDomains] = useState([]);

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
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
      }
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
