import React from "react";
import { v4 as uuidv4 } from "uuid";

const Container = (props) => {

  let domains = props.domains;

  return (
    <div>
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {domains &&
            domains.map((domain) => (
              <tr key={uuidv4()}>
                <td>{domain.id}</td>
                <td>{domain.name}</td>
                <td>{domain.description}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Container;
