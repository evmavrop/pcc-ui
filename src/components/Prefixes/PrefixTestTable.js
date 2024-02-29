import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-free-solid";
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import "react-datepicker/dist/react-datepicker.css";
import DataManager from "../../api/DataManager";
import config from "../../config";
import DataTable from 'react-data-table-component';


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



const TestTable = () => {
    let navigate = useNavigate();
    const [prefixes, setPrefixes] = useState([]);

    useEffect(() => {
        let DM = new DataManager(config.endpoint);
        DM.getPrefixes().then((response) => setPrefixes(response));
    }, []);

    return (
        <div>
            {prefixes && (
                <div className="col mx-4 mt-4 prefix-table">
                    <h2 className="view-title">
                        <i>
                            <FontAwesomeIcon icon="tags" size="lg" />
                        </i>
                        <span>Prefix List</span>
                        <button
                            className="btn btn-secondary mb-2"
                            onClick={() => {
                                navigate("/prefixes/add");
                            }}
                        >
                            <FontAwesomeIcon icon="plus" size="lg" /> Create new
                        </button>
                    </h2>

                    <DataTable
                        columns={columns}
                        data={prefixes}
                        theme="default"
                        highlightOnHover
                        pointerOnHover
                        pagination
                    />
                </div>
            )}
        </div>
    );
};

export default TestTable;