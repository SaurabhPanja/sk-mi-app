import { useState, useEffect, useRef } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select'
import ReactPDF from '@react-pdf/renderer';
import {Document, Page, PDFDownloadLink } from '@react-pdf/renderer';

import ResponsiveTable from "./ResponsiveTable"
import InvoicePDF from './InvoicePdf';

function BasicExample() {
  const [labourCharges, setLabourCharges] = useState([])
  const [show, setShow] = useState(false);
  const [rate, setRate] = useState("")
  const [unit, setUnit] = useState("")
  const [itemTotal, setItemTotal] = useState(0)
  const [dimensionError, setDimensionError] = useState(false)
  const [dimensionFieldDisabled, setDimensionDisabled] = useState(true)
  const [bill, setBill] = useState([])
  const [itemName, setItemName] = useState("")
  const [dimension, setDimension] = useState("")

  const handleClose = () => {
    setShow(false);
    setRate("")
    setUnit("")
    setItemTotal("")
  }
  const handleShow = () => setShow(true);

  const calculateTotal = (e) => {
    setDimension(e.target.value)
    const val = e.target.value.toLowerCase().replaceAll("x", "*")
    try {

      const evalVal = eval(val)
      const roundOffTotal = rate * evalVal
      setItemTotal(prevTotal=>{
        if(isNaN(roundOffTotal)){
          return 0
        }else{
          return roundOffTotal.toFixed(2)
        }
      })
      setDimensionError(false)
    } catch (error) {
      setDimensionError(true)
    }
  }

  const addItem = () =>{
    setBill(prevBill=>{
      if(itemName && rate && dimension && itemTotal){
        return [
          ...prevBill,
          {
            "id": prevBill.length + 1,
            "itemName": itemName,
            "rate": rate,
            "dimension": dimension,
            "total": itemTotal
          }
        ]
      }
      return [...prevBill]
    })
    handleClose()
  }

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const url = "https://script.googleusercontent.com/macros/echo?user_content_key=5Rl60qFjHih-wXiqLkEREf0zR7iUrXOZIYAHaQyge0rtkSlWMR_cXoiBZyR8M_ORAq-zh4JXaiqhpqXFHiEkZC8l4onhOF9wm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnI24BgTL3TIa7aIWGNPfWVyHQVgGhdWUK0HUJdkLZuc7VXxrLrPDSl-vRWVp-vXHaHKW3DzNbCkc24VxfAY1c6KzuUIWwi2m9A&lib=Mzmx6W9F8y-HD-Fdgh0tAcmZ55HFYViQD"
      const response = await fetch(url);
      const result = await response.json();
      setLabourCharges(result.data)
    }
    fetchData();
  }, [])

  return (
    <Container>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/" className='text-danger fw-bold'>S K Maidul Islam</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Button
                className='m-2'
                href="https://docs.google.com/spreadsheets/d/1N9Q7pTWpTSUBjuKpiCdhQN7HBcwM0f0_ry3UC9kNUAA/edit?usp=sharing"
                target="_blank">
                Panel
              </Button>
            </Nav>
            <Nav>
              <Button
                className='btn-success m-2'
                onClick={handleShow}
              >
                Add Item
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" >
              <Form.Label>Particular</Form.Label>
              <Select
                onChange={(selectedOption) => {
                  setDimensionDisabled(false)
                  const selectedParticular = labourCharges.find(lc => lc.particular == selectedOption['value'])
                  setRate(selectedParticular.rate)
                  setUnit(selectedParticular.unit)
                  setItemName(selectedOption['value'])
                }}
                options={
                  labourCharges.map(lc => (
                    {
                      value: lc['particular'],
                      label: lc['particular']
                    }
                  ))} />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Rate</Form.Label>
                  <Form.Control type="text" placeholder="Rate" value={rate.toLocaleString("en-IN")} disabled />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control type="text" placeholder="Unit" value={unit.toLocaleString("en-IN")} disabled />
                </Form.Group>
              </Col>
            </Row>


            <Form.Group className="mb-3">
              <Form.Label>Dimension</Form.Label>
              <Form.Control type="text" placeholder="Enter Dimension" onChange={(e) => calculateTotal(e)} disabled={dimensionFieldDisabled} />
              {dimensionError && <Form.Text className="text-danger">
                ** Dimension provided is wrong! Please check again!
              </Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total</Form.Label>
              <Form.Control type="text" placeholder="Total" disabled value={Number(itemTotal).toLocaleString("en-IN")} />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={addItem}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      <Form className="mt-3 p-3 bg-body-tertiary">
          <Row>
            <Col xs={2}>
            
              <Form.Label>Name</Form.Label>
            </Col>
            <Col xs={10}>
              <Form.Control type="username" placeholder="Enter Name" />
            </Col>
          </Row>

      </Form>
      <ResponsiveTable bill={bill} />
      <div>
      <PDFDownloadLink document={<InvoicePDF bill={bill} />} fileName="somename.pdf">
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download now!'
        }
      </PDFDownloadLink>
    </div>
      
    </Container>
  );
}

export default BasicExample;