import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2';

import { useNavigate } from 'react-router-dom';
import {CiRead, CiPen} from 'react-icons/ci'
import {AiOutlineDelete} from 'react-icons/ai'



const API = "http://localhost:8080/employee/assessment";


function Admin() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  

  const sendEmail = async (rowData) => {
    const { fullName, email, confirmPassword } = rowData;
    const res = await fetch("http://localhost:8080/user/exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email, confirmPassword, fullName
      })
    });
    const data = await res.json();
    if (data.status === 401 || !data) {
      console.log("error")
    } else {
      const updateRes = await fetch(`http://localhost:8080/candidate/${rowData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "Email sent successfully"
        })
      });
      const updateData = await updateRes.json();
      console.log(updateData)
    }
  }

  const fetchUsers = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        return data;
      }
    } catch (e) {
      console.error(e)
    }
    return [fetchUsers]; 
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const updatedUserList = await fetchUsers(API);
      setData(updatedUserList);
    };
    fetchData();
  }, []);


  const customStyles = {
    rows: {
     
      padding: '15px',
      style: {
        backgroundColor: '#fff',
        minHeight: '25px', // set the minimum height of each row
      lineHeight: '25px',
        ':hover': {
          backgroundColor: '#00B4D2',
          color: '#fff',
          fontWeight: 'bold',
          height:'30px !important',
          
        },
        ':active': {
          backgroundColor: '#00B4D2',
          color: '#fff',
        },
        
      },
      
    },
    headCells: {
      style: {
        backgroundColor: 'rgb(8, 8, 68)',
        color: '#FFFF',
        padding: '2px 10px 2px 10px',
      
      },
    },
    cells: {
      style: {
        padding: '8px',
        height:'30px !important',
        width: '180px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
   
    pagination: {
      
      style: {
        backgroundColor: '#28325A',
        height:'30px !important',
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
  //   
  

  const viewCandidate = (id) => {
    navigate('/hr/view/' + id)
  }

  const editCandidate = (id) => {
    navigate('/hr/edit/' + id)
  }

  const handleRegister = () => {
    navigate('/register')
  }

  const handleDelete = async (row) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B4D2',
      cancelButtonColor: '#8C8C8C',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8080/admin/users/${row._id}`, {
            method: 'DELETE'
          });
  
          if (response.ok) {
            // Update the user list in state after successful deletion
            setData(data.filter(user => user._id !== row._id));
            Swal.fire(
              'Deleted!',
              'User has been deleted.',
              'success'
            )
          } else {
            console.error('Error deleting user:', data.message);
            Swal.fire(
              'Error!',
              'Failed to delete the user.',
              'error'
            )
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire(
            'Error!',
            'Failed to delete the user.',
            'error'
          )
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Aborted',
          'info'
        )
      }
    })
  };
  
  
  


  const columns = [

    {
      name: "Name",
      selector: row => row.fullName,
      sortable: true,
      cell: (row) => <span className="custom-cells">{row.fullName}</span>,
      width: "200px",
      

    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
      cell: row => <span className="custom-cell">{row.email}</span>,
      width: "300px"
    },
    {
      name: 'Topic',
      selector: (row) => {
        if (row.topics && row.topics.length > 0) {
          // Filter out topics without a valid topic and then join the valid ones with commas
          const validTopics = row.topics.filter((topic) => topic.topic && topic.topic.trim() !== '');
          return validTopics.map((topic) => topic.topic).join(', ');
        }
        return ''; // Return an empty string if there are no topics or valid topics
      },
      sortable: true,
    },
   
    {
      name: "Actions",
      cell: row => (
        <div>
          <button  title='View' onClick={() => viewCandidate(row._id)} className="action-button" style={{margin: '5px'}}><CiRead color='#0398b2' /></button>
          <button  title='Edit' onClick={() => editCandidate(row._id)} className="action-button" style={{margin: '5px'}} ><CiPen color= '#0398b2' /></button>
          <button  title='Delete' onClick={() => handleDelete(row)} className="action-button" style={{margin: '5px' , color:'red'}} ><AiOutlineDelete color= '#0398b2' /></button>

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "250px"
    },
  ];



  const handleSendEmail = async () => {
    const selectedCount = selectedRows.length;
    Swal.showLoading();
    for (const row of selectedRows) {
      await sendEmail(row);
      
    }
    Swal.showLoading();
    setSelectedRows([]);
  
    if (selectedCount > 1) {
      Swal.fire({
        icon: 'success',
        title: 'Credentials Sent successfully',
        showConfirmButton: false,
        confirmButtonColor: '#00B4D2',
        timer: 3000,
      });
    } else if (selectedCount === 1){
      Swal.fire({
        icon: 'success',
        title: 'Credentials Sent successfully',
        showConfirmButton: false,
        confirmButtonColor: '#00B4D2',
        timer: 3000,
      });
    }
  };

  return (
  
      <div className="table-container">
        <h1> Welcome to Admin Dashboard </h1>
   
        <div className="search-filter2">
        <button className="send-button" title='Add Employee' style={{ color:'#fff', padding: "6px 10px 6px 17px", width: '10%'}} onClick={handleRegister} >+Add New</button>
          <input placeholder='Search Employee here' type="text" value={searchQuery} className='search-field' onChange={(e) => setSearchQuery(e.target.value)} />
          {/* <button type="submit"><BsSearch/></button> */}
          
          <button className="send-button" title='send Email' style={{ padding: "6px 10px 6px 17px", visibility: "visible", color:'#fff'}} disabled={selectedRows.length === 0} onClick={handleSendEmail} >
          Send Mail
        </button>
        </div>

        <DataTable
          columns={columns}
          data={data}
          selectableRows
          onSelectedRowsChange={handleRowSelected}
          selectedRows={selectedRows}
          fixedHeader
          pagination
          paginationPerPage={10}
          className="dataTable"
          customStyles={customStyles}
        />
        <br />
        <center>
       
        <i><p style={{ color: '#00B4D2' , fontWeight: 'bold' }}> *Select an Employee to send their credentials through Email respectively</p></i></center>
      </div>


   
  );

}

export default Admin;