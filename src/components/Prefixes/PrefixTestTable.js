import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-free-solid";
import { Link, useNavigate } from "react-router-dom";


const TestTable = () => {
    let navigate = useNavigate();
    const [dummyList, setDummyList] = useState([]);

    useEffect(() => {
        const dummyData = [
            {
                id: "id1",
                name: "Name 1",
                owner: "Owner 1",
                domain: "Domain 1",
                provider: "Provider 1",
            },
            {
                id: "id2",
                name: "Name 2",
                owner: "Owner 2",
                domain: "Domain 2",
                provider: "Provider 2",
            },
            {
                id: "id3",
                name: "Name 3",
                owner: "Owner 3",
                domain: "Domain 3",
                provider: "Provider 3",
            },
        ];

        setDummyList(dummyData);
    }, []);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 150
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150
        },
        {
            field: 'owner',
            headerName: 'Owner',
            width: 150
        },
        {
            field: 'domain',
            headerName: 'Domain',
            width: 150,
        },
        {
            field: 'provider',
            headerName: 'Provider',
            width: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <>
                    <div className="edit-buttons btn-group shadow">
                        <Link
                            className="btn btn-secondary btn-sm "
                            to={`/prefixes/`}
                        >
                            <FontAwesomeIcon icon="list" />
                        </Link>
                        <Link
                            className="btn btn-secondary btn-sm "
                            to={`/prefixes/`}
                        >
                            <FontAwesomeIcon icon="edit" />
                        </Link>
                        <Link
                            className="btn btn-secondary btn-sm "
                            to={`/prefixes/`}
                        >
                            <FontAwesomeIcon icon="times" />
                        </Link>
                        <Link
                            className="btn btn-secondary btn-sm "
                            to={`/prefixes/`}
                        >
                            <FontAwesomeIcon icon="fa-solid fa-chart-bar" />
                        </Link>
                    </div>
                </>
            ),
        },
    ];

    return (

        <div>
            <div className="col mx-4 mt-4 prefix-table">
                <h2 className="view-title">
                    <i><FontAwesomeIcon icon="tags" size="lg" /></i>
                    <span>Prefix List</span>
                    <button className="btn btn-secondary mb-2"
                        onClick={() => { navigate("/prefixes/add"); }}>
                        <FontAwesomeIcon icon="plus" size="lg" /> Create new
                    </button>
                </h2>

                <DataGrid
                    rows={dummyList}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 25, 100]}
                    paginationMode="client"
                />
            </div>
        </div>
    );
};

export default TestTable;