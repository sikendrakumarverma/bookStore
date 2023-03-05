import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function SearchDiv() {

    const[searchData,setSearchData]= useState("");

    let navigate = useNavigate();
    let userEmail = localStorage.getItem("userEmail")

    function SearchBook(){
      console.log("click")
      navigate("/searchBook",{state: searchData})
    }


    return (
        <div>
            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Search Book By Title"
                    className="me-5"
                    aria-label="Search"
                    onChange={(e) => { setSearchData(e.target.value) }}
                />
                <Button onClick={() => { SearchBook() }} variant="outline-success">Search</Button>
            </Form>
        </div>
    )
}

export default SearchDiv;