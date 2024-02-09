import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DataManager from "../../api/DataManager";

import config from "../../config";


const PrefixEditStats = () => {
    let params = useParams();
    let navigate = useNavigate();
    const [prefixes, setPrefixes] = useState([]);
    const [prefixStatistics, setPrefixStatistics] = useState({});

    let prefix = {};
    if (prefixes) {
        prefixes.forEach((p) => {
            if (String(p.id) === params.id) {
                prefix = p;
            }
        });
    }

    useEffect(() => {
        let DM = new DataManager(config.endpoint);
        DM.getPrefixes().then((response) => setPrefixes(response));
    }, []);

    useEffect(() => {
        let DM = new DataManager(config.endpoint);
        let prefix = {};
        if (prefixes) {
            prefixes.forEach((p) => {
                if (String(p.id) === params.id) {
                    prefix = p;
                }
            });
        }
        if (prefix.name !== undefined) {
            DM.getStatisticsByPrefixID(prefix.name).then((response) => {
                setPrefixStatistics(response);
            });
        }
    }, [prefix]);

    return (
        <form id="editStats">
            <div className="form-group-edit-stats">
                <label htmlFor="handles" className="form-label-edit-stats fw-bold">Handles</label>
                <input type="text" id="handles" name="handles" />
                <label htmlFor="resolvable" className="form-label-edit-stats fw-bold">Resolvable</label>
                <input type="text" id="resolvable" name="resolvable" />
                <label htmlFor="non-resolvable" className="form-label-edit-stats fw-bold">Non-Resolvable</label>
                <input type="text" id="non-resolvable" name="non-resolvable" />
            </div>
            <div className="button-group-edit-stats">
                <button type="submit" value="Submit" className="btn btn-primary" style={{ marginRight: "1rem" }}>Update</button>
                <button type="reset" className="btn btn-dark" onClick={() => { navigate("/prefixes/"); }}>Back</button>
            </div>
        </form>


    );
};

export default PrefixEditStats;