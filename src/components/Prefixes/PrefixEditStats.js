import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../Alert";

import DataManager from "../../api/DataManager";

import config from "../../config";


const PrefixEditStats = () => {
    let params = useParams();
    let navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [prefixName, setPrefixName] = useState("");

    const [prefixes, setPrefixes] = useState([]);
    const [prefixStatistics, setPrefixStatistics] = useState({});

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value || 0;
        setPrefixStatistics({
            ...prefixStatistics,
            [name]: parseInt(value, 10)
        });
    };

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
        setPrefixName(prefix.name);
        if (prefix.name !== undefined) {
            DM.getStatisticsByPrefixID(prefix.name).then((response) => {
                setPrefixStatistics({
                    ["handles_count"]: parseInt(response.handles_count || 0, 10),
                    ["resolvable_count"]: parseInt(response.resolvable_count || 0, 10),
                    ["unresolvable_count"]: parseInt(response.unresolvable_count || 0, 10),
                    ["unchecked_count"]: parseInt(response.unchecked_count || 0, 10),
                });
            });
        }
    }, [prefixes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const handles_count = parseInt(prefixStatistics.resolvable_count) + parseInt(prefixStatistics.unresolvable_count) + parseInt(prefixStatistics.unchecked_count)
        const stats = {
            ["handles_count"]: handles_count.toString(),
            ["resolvable_count"]: prefixStatistics.resolvable_count.toString(),
            ["unresolvable_count"]: prefixStatistics.unresolvable_count.toString(),
            ["unchecked_count"]: prefixStatistics.unchecked_count.toString()
        }
        let DM = new DataManager(config.endpoint);
        DM.updateStatisticsByPrefixID(prefixName, stats).then((r) => {
            setAlert(true);
            if (!("message" in r)) {
                setAlertType("success");
                setAlertMessage("Prefix succesfully updated.");
                setTimeout(() => {
                    navigate("/prefixes/");
                }, 2000);
            }
            else {
                setAlertType("danger");
                setAlertMessage(r["message"]);
            }
        });
    };

    return (
        <div className="container">
            {alert &&
                <Alert type={alertType} message={alertMessage} />
            }
            <form onSubmit={handleSubmit}>
                <div className="form-group-edit-stats">
                    <label htmlFor="resolvable" className="form-label-edit-stats fw-bold">Resolvable</label>
                    <input type="number" id="resolvable_count" name="resolvable_count" value={!isNaN(prefixStatistics.resolvable_count) ? parseInt(prefixStatistics.resolvable_count, 10).toString() : ""} onChange={handleChange} />
                    <label htmlFor="non-resolvable" className="form-label-edit-stats fw-bold">Non-Resolvable</label>
                    <input type="number" id="unresolvable_count" name="unresolvable_count" value={!isNaN(prefixStatistics.unresolvable_count) ? parseInt(prefixStatistics.unresolvable_count, 10).toString() : ""} onChange={handleChange} />
                    <label htmlFor="unchecked" className="form-label-edit-stats fw-bold">Unchecked</label>
                    <input type="number" id="unchecked_count" name="unchecked_count" value={!isNaN(prefixStatistics.unchecked_count) ? parseInt(prefixStatistics.unchecked_count, 10).toString() : ""} onChange={handleChange} />
                </div>
                <div className="button-group-edit-stats">
                    <button type="submit" value="Submit" className="btn btn-primary" style={{ marginRight: "1rem" }}>Update</button>
                    <button type="reset" className="btn btn-dark" onClick={() => { navigate("/prefixes/"); }}>Back</button>
                </div>
            </form>
        </div>

    );
};

export default PrefixEditStats;