import axios from "axios";
import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { SERVER_URI } from '../config/keys';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function GetAllOrder() {

    let [data, setData] = useState([]);
    const [searchData, setSearchData] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        // if (!localStorage.getItem('token')) {
        //     navigate("/login")
        // }
        GetOrderData();

    }, [])

    async function GetOrderData() {
        await axios.get(`${SERVER_URI}/getAllOrder`, {
            headers: {
                "x-api-key": localStorage.getItem("token")
            }
        })
            .then((response) => {
                setData(response.data.data)
                //alert(`success : ${response.data.message}`)
            })
            .catch((error) => {
                console.log("error :", error.response.data.message)
                alert(`Error: ${error.response.data.message}`)
            })

    }

    function SearchBook() {
        console.log("click")
        navigate("/searchOrder", { state: searchData })
    }


    return (
        <div >
            <h1 style={{ color: "white" }}> All Ordered List</h1>
            <br />
            <div>
                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder="Search ordered By BookName"
                        className="me-5"
                        aria-label="Search"
                        onChange={(e) => { setSearchData(e.target.value) }}
                    />
                    <Button onClick={() => { SearchBook() }} variant="outline-success">Search</Button>
                </Form>
            </div>
            <br />
            <div className="col-sm-10 offset-sm-1" style={{ background: "skyblue" }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Ordered Book</th>
                            <th>Order Amount</th>
                            <th>Ordered Status</th>
                            <th>OrderedAt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) =>
                            <tr key={index}>
                                <td>{item.bookName}</td>
                                <td>{item.bookPrice}</td>
                                <td>{item.status}</td>
                                <td>{item.createdAt}</td>
                            </tr>)
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
export default GetAllOrder;