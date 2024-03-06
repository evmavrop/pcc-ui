import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-free-solid";
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import "react-datepicker/dist/react-datepicker.css";
import DataManager from "../../api/DataManager";
import config from "../../config";
import DataTable from 'react-data-table-component';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

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

const columns = [
  {
    name: 'Name',
    selector: row => row.name,
    sortable: true,
  },
  {
    name: 'Owner',
    selector: row => row.owner,
    sortable: true,
  },
  {
    name: 'Domain',
    selector: row => row.domain_name,
    sortable: true,
  },
  {
    name: 'Provider',
    selector: row => row.provider_name,
    sortable: true,
  },
  {
    name: 'Actions',
    cell: (row) => (
      <div className="btn-group">
        <Link className="btn btn-secondary btn-sm" to={`/prefixes/${row.id}`}>
          <FontAwesomeIcon icon="list" />
        </Link>
        <Link className="btn btn-secondary btn-sm" to={`/prefixes/${row.id}/update`}>
          <FontAwesomeIcon icon="edit" />
        </Link>
        <Link className="btn btn-secondary btn-sm" to={`/prefixes/${row.id}/delete`}>
          <FontAwesomeIcon icon="times" />
        </Link>
        <Link
          className="btn btn-secondary btn-sm"
          to={`/prefixes/editstatistics/${row.id}`}
        >
          <FontAwesomeIcon icon={faChartBar} />
        </Link>
      </div>
    ),
  },
];

// Custom style for the table, to have bigger font and colored rows on hover
const customStyles = {
  headCells: {
    style: {
      color: '#202124',
      fontSize: '18px',
    },
  },
  rows: {
    style: {
      fontSize: '16px',
    },
    highlightOnHoverStyle: {
      backgroundColor: 'rgb(199,218,255)',
      borderBottomColor: '#FFFFFF',
      borderRadius: '10px',
      outline: '1px solid #FFFFFF',
    },
  }
};


const Prefixes = () => {
  let navigate = useNavigate();
  const [prefixes, setPrefixes] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getPrefixes().then((response) => setPrefixes(response));
  }, []);

  const filteredPrefixes = prefixes.filter((item) => {
    return Object.values(item).some(
      (value) =>
        value &&
        typeof value === 'string' &&
        value.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  const subHeaderComponentMemo = useMemo(() => {

    return (
      <>
        <div className="col-6"></div>
        <div className="col-6">
          <div className="input-group input-group-md">
            <input type="text" className="form-control" placeholder="Search..." value={filterText} aria-describedby="button-addon2"
              onChange={(e) => setFilterText(e.target.value)} />
          </div>
        </div>
      </>
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <div>

      {prefixes && (
        <div className="col mx-4 mt-4 prefix-table">
          <h2 className="view-title">
            <i> <FontAwesomeIcon icon="tags" size="lg" /></i>
            <span>Prefix List</span>
            <button className="btn btn-secondary mb-2" onClick={() => { navigate("/prefixes/add"); }}>
              <FontAwesomeIcon icon="plus" size="lg" /> Create new
            </button>
          </h2>

          <Tabs id="justify-tab-example" className="mb-3" justify
          >
            <Tab eventKey="GRNET" title={<span style={{ fontSize: '18px' }}><b>GRNET</b></span>} active></Tab>
            <Tab eventKey="DKRZ" title={<span style={{ fontSize: '18px' }}><b>DKRZ</b></span>} active></Tab>
            <Tab eventKey="SURF" title={<span style={{ fontSize: '18px' }}><b>SURF</b></span>} active></Tab>
            <Tab eventKey="GWDG" title={<span style={{ fontSize: '18px' }}><b>GWDG</b></span>} active></Tab>
          </Tabs>

          <DataTable
            columns={columns}
            data={filteredPrefixes}
            theme="default"
            customStyles={customStyles}
            highlightOnHover
            pointerOnHover
            pagination
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
          />
        </div>
      )}
    </div>
  );
};


export { Prefixes, PrefixDetails, PrefixAdd, PrefixUpdate, PrefixLookup, PrefixEditStats };