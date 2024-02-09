import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-free-solid";
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

import "react-datepicker/dist/react-datepicker.css";

import DataManager from "../../api/DataManager";
import Table from "../Table";

import config from "../../config";

import PrefixDetails from "./PrefixDetails";
import PrefixAdd from "./PrefixAdd"
import PrefixUpdate from "./PrefixUpdate"
import PrefixLookup from "./PrefixLookup"
import PrefixEditStats from "./PrefixEditStats";


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
            <Link
              className="btn btn-secondary btn-sm "
              to={`/prefixes/${props.row.original.id}/editstatistics`}>
              <FontAwesomeIcon icon={faChartBar} />
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





export { Prefixes, PrefixDetails, PrefixAdd, PrefixUpdate, PrefixLookup, PrefixEditStats };
