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

    let prefix = {};

    const [prefixes, setPrefixes] = useState([]);
    const [prefixStatistics, setPrefixStatistics] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = value.replace(/\D/g, '');
        setPrefixStatistics({
            ...prefixStatistics,
            [name]: sanitizedValue
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
                //TODO empty response
                setPrefixStatistics({
                    ["handles_count"]: response.handles_count ? response.handles_count : 0,
                    ["resolvable_count"]: response.resolvable_count ? response.resolvable_count : 0,
                    ["unresolvable_count"]: response.unresolvable_count ? response.unresolvable_count : 0,
                    ["unchecked_count"]: response.unresolvable_count ? response.resolvable_count : 0,

                });
            });
        }
    }, [prefixes]);

    const handleSubmit = (e) => {
        //TODO add check for inconsistent input (handles_count = resolvable_count + unresolvable_count + unchecked_count)
        let numPidTotal = parseInt(prefixStatistics.handles_count)
        let numPidResolv = parseInt(prefixStatistics.resolvable_count)
        let numPidNonResolv = parseInt(prefixStatistics.unresolvable_count)
        let numPidUnknown = parseInt(prefixStatistics.unchecked_count)
        const stats = {
            ["handles_count"]: prefixStatistics.handles_count.toString(),
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

    // number of total pids
    let numPidTotal = 0
    // number of resolvable pids
    let numPidResolv = 0
    // number of non resolvable pids
    let numPidNonResolv = 0

    // if data available process the numbers
    if (prefixStatistics) {
        numPidTotal = parseInt(prefixStatistics.handles_count)
        numPidResolv = parseInt(prefixStatistics.resolvable_count)
        numPidNonResolv = parseInt(prefixStatistics.unresolvable_count)
    }

    return (
        <div className="container">{alert &&
            <Alert type={alertType} message={alertMessage} />
        }
            <form id="editStats" onSubmit={handleSubmit}>
                <div className="form-group-edit-stats">
                    <label htmlFor="handles" className="form-label-edit-stats fw-bold">Handles</label>
                    <input type="text" id="handles_count" name="handles_count" value={prefixStatistics.handles_count ? prefixStatistics.handles_count : "N/A"} onChange={handleChange} />
                    <label htmlFor="resolvable" className="form-label-edit-stats fw-bold">Resolvable</label>
                    <input type="text" id="resolvable_count" name="resolvable_count" value={prefixStatistics.resolvable_count ? prefixStatistics.resolvable_count : "N/A"} onChange={handleChange} />
                    <label htmlFor="non-resolvable" className="form-label-edit-stats fw-bold">Non-Resolvable</label>
                    <input type="text" id="unresolvable_count" name="unresolvable_count" value={prefixStatistics.unresolvable_count ? prefixStatistics.unresolvable_count : "N/A"} onChange={handleChange} />
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