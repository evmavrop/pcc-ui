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
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import PrefixDetails from "./PrefixDetails";
import PrefixAdd from "./PrefixAdd"
import PrefixUpdate from "./PrefixUpdate"
import PrefixLookup from "./PrefixLookup"
import PrefixEditStats from "./PrefixEditStats";

const contract_type_t = {
  "CONTRACT": "CONTRACT",
  "PROJECT": "PROJECT",
};

const def_domains = {
  "Medical & Health Sciences": "Medical & Health Sciences",
  "Agricultural Sciences": "Agricultural Sciences",
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
  },
};


const Prefixes = () => {
  let navigate = useNavigate();
  const [prefixes, setPrefixes] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [key, setTabKey] = useState('');
  const [providers, setProviders] = useState([]);


  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getPrefixes().then((response) => setPrefixes(response));
    DM.getProviders().then((response) => setProviders(response));
  }, []);


  const filteredPrefixesProviders = prefixes.filter(
    (item) => item.provider_name && item.provider_name.toLowerCase().includes(filterProvider.toLowerCase())
  );

  const filteredPrefixes = filteredPrefixesProviders.filter((item) => {
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
        <div className="col-12">

          <InputGroup className="mb-3">

          <InputGroup.Text id="basic-addon1"
          style={{ borderColor: '#6C757D' }}
          >Domains</InputGroup.Text>

            <Form.Select aria-label="Default select example"
            style={{ borderColor: '#6C757D' }}
            >
            <option value="">All</option>
              {Object.entries(def_domains).map((domain) => (
                <option key={domain[0]} value={domain[0]}>{domain[0]}</option>
              ))}
            </Form.Select>

            <InputGroup.Text id="basic-addon1"
            style={{ borderColor: '#6C757D' }}
            >Contact Type</InputGroup.Text>
            <Form.Select aria-label="Default select example"
            style={{ borderColor: '#6C757D' }}
            >
              <option value="">All</option>
              {Object.entries(contract_type_t).map((contract) => (
                    <option key={"contract-" + contract[0]} value={contract[0]}>
                      {contract[0]}
                    </option>
                  ))}
            </Form.Select>

            <Form.Control aria-label="Text input with dropdown button" placeholder="Search ..." value={filterText} aria-describedby="button-addon2"
              onChange={(e) => setFilterText(e.target.value)} 
              style={{ borderColor: '#6C757D' }}
              />
          </InputGroup>
        </div>
      </>
    );
  }, [filterText]);

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
            activeKey={key}
            onSelect={(k) => { setFilterProvider(k), setTabKey(k) }}
          >
            <Tab eventKey="" title={<span style={{ fontSize: '18px' }}><b>ALL</b></span>} active></Tab>
            {providers.map((provider) => (
              <Tab
                key={provider.id} eventKey={provider.name}
                title={<span style={{ fontSize: '18px' }}>{provider.name}</span>}
              />
            ))}
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