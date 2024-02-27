import React, { useState } from 'react';
import { Tab, Tabs, Table, Button, Form } from 'react-bootstrap';
import { TextField } from '@mui/material';

const TestTable = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Perform search/filter operation based on searchQuery
  };

  // Sample data for the table
  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    // Add more data as needed
  ];

  // Filter data based on search query
  const filteredData = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <Tabs activeKey={activeTab} onSelect={handleTabChange} id="tabs">
        <Tab eventKey="tab1" title="Tab 1">
          <div className="mb-3">
            <Form.Control type="text" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td><Button variant="primary">Action</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="tab2" title="Tab 2">
          {/* Content for Tab 2 */}
        </Tab>
      </Tabs>
    </div>
  );
};

export default TestTable;
