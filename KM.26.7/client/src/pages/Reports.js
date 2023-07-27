import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { CSVLink } from 'react-csv';

const API = "http://localhost:8080/candidates";

function Reports() {
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8080/employee/assessment')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setFilteredData(data);
      })
      .catch(error => console.error(error));
  }, []);
  useEffect(() => {
    setFilteredData(
      data.filter(
        row =>
          row.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  const fetchUsers = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        setData(data);
      }
    } catch (e) {
      console.error(e)
    }
  }
  // const dataToExport = filteredData.map(row => {
  //   const formattedRow = {
      
  //     Name: row.fullName,
  //     Email: row.email,
  //     Pychometric: row.psychometric !== -1 ? row.psychometric : 0,
  //     Quantitative: row.quantitative !== -1 ? row.quantitative : 0,
  //     Vocabulary: row.vocabulary !== -1 ? row.vocabulary : 0,
  //     java: row.java !== -1 ? row.java : 0,
  //   };
  //   return formattedRow;
  // });

  useEffect(() => {
    fetchUsers(API);
  }, [])

  const uniqueTopics = Array.from(new Set(data.flatMap(row => row.topics.map(topic => topic.topic))));

  // Create columns dynamically based on unique topics
  const dynamicColumns = uniqueTopics.map(topic => ({
    name: topic,
    width: "130px",
    selector: row => {
      const topicData = row.topics.find(t => t.topic === topic);
      return topicData && topicData.score !== -1 ? topicData.score : 0;
    },
    sortable: true,
    center: true,
  }));

  
  const customStyles = {
    rows: {
      padding: '12px',
      style: {
        minHeight: '30px',
        lineHeight: '30px',
        backgroundColor: '#fff',
        ':hover': {
          backgroundColor: '#00B4D2',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: 'none',
        },
        ':active': {
          backgroundColor: '#00B4D2',
          color: '#fff',
        },
      },
    },
    headCells: {
      style: {
        backgroundColor: '#28325A',
        color: '#FFFF',
        padding: '2px 0px 2px 0px',
        height: '40px !important',
        fontWeight: 'bolder'
      },
    },
    cells: {
      style: {
        padding: '8px',
        width: "100px",
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        alignItems: 'center'
      },
    },
    pagination: {
      style: {
        backgroundColor: '#28325A',
        border: 'none',
        color: '#fff',
        display: "flex",
        alignItems: "center",
        minHeight: '30px',
        lineHeight: '30px'
      },
      pageButtonsStyle: {
        backgroundColor: '#fff',
        border: 'none',
        cursor: 'pointer',
        margin: "0 5px",
        padding: '1px',
        width: '20%',
        height: '23px !important',
        ':hover': {
          backgroundColor: '#00B4D2',
          color: 'rgb(14, 157, 157)',
        },
        ':active': {
          backgroundColor: '#8C8C8C',
          color: '#333',
        },
      },
    },
  };
  const columns = [
    {
      name: "Full Name",
      width: "150px",
      selector: row => row.fullName,
      sortable: true,
      cell: row => <span className="custom-cells">{row.fullName}</span>
    },
    {
      name: "Email",
      width: "250px",
      selector: row => row.email,
      sortable: true,
      cell: row => <span className="custom-cell">{row.email}</span>
    },
    ...dynamicColumns,
  ];
  
  
  return (
    <div className='table-container'>
      <div className='search-filter2'>
        <input type="text" value={searchQuery} className='search-field' onChange={(e) => setSearchQuery(e.target.value)} placeholder='Type Name here' />
     

        <h1 className='total-applicants' >Total Applicants :  {data.length}</h1>

      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        fixedHeader
        pagination
        paginationPerPage={10}
        customStyles={customStyles}
      />
      <br />
      
      <center><i><p style={{ color: '#fff', fontWeight: 'bold'}}> *All fields are sortable</p></i></center>
    </div>
  )
}

export default Reports;