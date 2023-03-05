import axios from "axios";
import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { useLocation, useNavigate } from "react-router-dom";
import { SERVER_URI } from '../config/keys';

function SearchOrdersData() {

    let location = useLocation();
    let bookData = location.state;
console.log(bookData)
    let [data, setData] = useState([]);

    let navigate = useNavigate();
    useEffect(() => {
        // if (!localStorage.getItem('token')) {
        //     navigate("/login")
        // }
        getBooksData()

    }, [bookData])



    function getBooksData() {
        axios.get(`${SERVER_URI}/getOrdersByQ?bookName=${bookData}`, {
            headers: {
                "x-api-key": localStorage.getItem("token")
            }
        })
            .then((response) => {
                setData(response.data.data)
                alert(`success : ${response.data.message}`)
            })
            .catch((error) => {
                console.log("error :", error.response.data.message)
                alert(`Error: ${error.response.data.message}`)
            })

    }

    return (
        <div >
            <h1 style={{ color: "white" }}> Search Orders List</h1>
            {/* <p> Number of Order={response.data.totalOrders}</p> */}
            <div className="col-sm-10 offset-sm-1" style={{ background: "skyblue" }} >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>OrderedId</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>OrderedAt</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) =>
                            <tr>
                                <td>{item._id}</td>
                                <td>{item.bookName}</td>
                                <td>{item.bookPrice}</td>
                                <td>{item.createdAt}</td>
                              
                            </tr>)
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
export default SearchOrdersData;