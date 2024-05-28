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
import Table from 'react-bootstrap/Table'
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';

import InvoicePDF from './InvoicePdf';
import LabourChargesPdf from './LabourChargesPdf';
import Loader from './Loader';

function BillApp() {
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
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    advances: '',
    advancesTotal: ''
  });
  const [panelUrl, setPanelUrl] = useState("https://script.googleusercontent.com/macros/echo?user_content_key=5Rl60qFjHih-wXiqLkEREf0zR7iUrXOZIYAHaQyge0rtkSlWMR_cXoiBZyR8M_ORAq-zh4JXaiqhpqXFHiEkZC8l4onhOF9wm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnI24BgTL3TIa7aIWGNPfWVyHQVgGhdWUK0HUJdkLZuc7VXxrLrPDSl-vRWVp-vXHaHKW3DzNbCkc24VxfAY1c6KzuUIWwi2m9A&lib=Mzmx6W9F8y-HD-Fdgh0tAcmZ55HFYViQD")

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isloading, setIsloading] = useState(false)

  const [showResetModal, setShowResetModal] = useState(false);

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const handleResetConfirm = () => {
    localStorage.removeItem('formData');
    localStorage.removeItem('bill');
    setFormData({
      name: '',
      address: '',
      phone: '',
      description: '',
      advances: '',
      advancesTotal: ''
    });
    setBill([]);
    setShowResetModal(false);
  };

  const handleResetCancel = () => {
    setShowResetModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {

      try {
        // Get the id parameter from the URL
        setIsloading(true)
        const id = window.location.pathname.split('/').pop();

        // Make sure id is present before making the API call
        if (id) {
          // Make your API call here

          const { data, error } = await supabase
            .from('histories')
            .select()
            .eq('id', id)
          const response = data[0]
          console.log(response)
          const { name, address, phone, description, advances, advancesTotal } = response
          setFormData({ name, address, phone, description, advances, advancesTotal })
          const billObj = JSON.parse(response['bills'])
          setBill(billObj)
          // console.log(billObj)
        } else {
          const storedFormData = localStorage.getItem('formData');
          if (storedFormData) {
            setFormData(JSON.parse(storedFormData));
          }

          const storedBill = localStorage.getItem('bill');
          if (storedBill) {
            setBill(JSON.parse(storedBill));
          }

        }
        setIsloading(false)
      } catch (error) {
        console.log("Error while fetching data from supabase " + error)
      }
    };

    fetchData();
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClose = () => {
    setShow(false);
    setRate("")
    setUnit("")
    setItemTotal("")
    setDimension("")
  }
  const handleShow = () => setShow(true);

  useEffect(() => {
    const val = dimension.toLowerCase().replaceAll("x", "*")
    try {

      const evalVal = eval(val)
      const roundOffTotal = rate * evalVal
      setItemTotal(prevTotal => {
        if (isNaN(roundOffTotal)) {
          return 0
        } else {
          return roundOffTotal.toFixed(2)
        }
      })
      setDimensionError(false)
    } catch (error) {
      setDimensionError(true)
    }

  }, [rate, dimension])

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('bill', JSON.stringify(bill));
  }, [bill]);

  const addItem = () => {
    setBill(prevBill => {
      if (itemName && rate && dimension && itemTotal) {
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

  const openDeleteModal = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const deleteItem = (idToDelete) => {
    setBill(prevState => prevState.filter(item => item.id !== idToDelete));
  };

  const handleParticularChange = (index, newValue) => {
    const updatedBillItems = [...bill]
    updatedBillItems[index - 1].itemName = newValue

    setBill(updatedBillItems)
  }

  const handleRateChange = (index, newValue) => {
    // Create a copy of the billItems array
    // console.log("Executed!")
    const updatedBillItems = [...bill];
    // Update the dimension of the item at the specified index
    // console.log(updatedBillItems[index])
    updatedBillItems[index - 1].rate = newValue
    let evalVal = 0
    try {

      const val = updatedBillItems[index - 1].dimension.toLowerCase().replaceAll("x", "*")
      evalVal = eval(val)
    } catch (erro) {
      evalVal = NaN
    }
    // console.log(evalVal)
    const roundOffTotal = updatedBillItems[index - 1].rate * evalVal

    updatedBillItems[index - 1].total = roundOffTotal.toFixed(2)
    // console.log(updatedBillItems)
    // Update the state with the modified array
    // console.log(updatedBillItems)
    setBill(updatedBillItems);
  };

  const handleDimensionChange = (index, newValue) => {
    // Create a copy of the billItems array
    // console.log("Executed!")
    const updatedBillItems = [...bill];
    // Update the dimension of the item at the specified index
    // console.log(updatedBillItems[index])
    updatedBillItems[index - 1].dimension = newValue
    let evalVal = 0
    try {

      const val = newValue.toLowerCase().replaceAll("x", "*")
      evalVal = eval(val)
    } catch (erro) {
      evalVal = NaN
    }
    // console.log(evalVal)
    const roundOffTotal = updatedBillItems[index - 1].rate * evalVal

    updatedBillItems[index - 1].total = roundOffTotal.toFixed(2)
    // console.log(updatedBillItems)
    // Update the state with the modified array
    // console.log(updatedBillItems)
    setBill(updatedBillItems);
  };

  useEffect(() => {
    async function fetchData() {
      // You can await here
      setIsloading(true)
      // const url = "https://script.googleusercontent.com/macros/echo?user_content_key=5Rl60qFjHih-wXiqLkEREf0zR7iUrXOZIYAHaQyge0rtkSlWMR_cXoiBZyR8M_ORAq-zh4JXaiqhpqXFHiEkZC8l4onhOF9wm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnI24BgTL3TIa7aIWGNPfWVyHQVgGhdWUK0HUJdkLZuc7VXxrLrPDSl-vRWVp-vXHaHKW3DzNbCkc24VxfAY1c6KzuUIWwi2m9A&lib=Mzmx6W9F8y-HD-Fdgh0tAcmZ55HFYViQD"
      const response = await fetch(panelUrl);
      const result = await response.json();
      setLabourCharges(result.data)
      setIsloading(false)
    }
    fetchData();
  }, [panelUrl])

  return (
    <>
      {isloading && <Loader />}
      <Container>
        <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
          <Container>
            <Navbar.Brand href="/" className='text-danger fw-bold'>S K Maidul Islam</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <Form.Select size="lg"
                  className='m-2' onChange={(e) => setPanelUrl(e.target.value)}>
                  <option value="https://script.googleusercontent.com/macros/echo?user_content_key=5Rl60qFjHih-wXiqLkEREf0zR7iUrXOZIYAHaQyge0rtkSlWMR_cXoiBZyR8M_ORAq-zh4JXaiqhpqXFHiEkZC8l4onhOF9wm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnI24BgTL3TIa7aIWGNPfWVyHQVgGhdWUK0HUJdkLZuc7VXxrLrPDSl-vRWVp-vXHaHKW3DzNbCkc24VxfAY1c6KzuUIWwi2m9A&lib=Mzmx6W9F8y-HD-Fdgh0tAcmZ55HFYViQD">New Panel</option>
                  <option value="https://script.google.com/macros/s/AKfycbxD9TeEyPyA1Hr6-6yXDnpuQkZAYNzbsvN3WIwChmSLpdNFQA68WnGa4jpBZq5dvCa_Og/exec ">Old Panel</option>
                </Form.Select>
              </Nav>
              <PDFDownloadLink document={<LabourChargesPdf labourCharges={labourCharges} />} fileName={`labour_charges.pdf`}>
                {({ blob, url, loading, error }) => {
                  if (loading) {
                    return 'Loading document'
                  } else {
                    return (
                      <Nav>

                        <Button
                          // variant="outline-info"
                          size='large'>
                          Download Panel
                        </Button>
                      </Nav>
                    )
                  }
                }
                }
              </PDFDownloadLink>
              <Nav>
                <Button variant='danger' className='m-2' onClick={handleResetClick}>
                  Reset
                </Button>
              </Nav>

              <Nav>
                <Button
                  variant='info'
                  className='m-2'
                  href="https://docs.google.com/spreadsheets/d/1N9Q7pTWpTSUBjuKpiCdhQN7HBcwM0f0_ry3UC9kNUAA/edit?usp=sharing"
                  target="_blank">
                  New Panel
                </Button>
              </Nav>
              <Nav>
                <Button
                  variant='dark'
                  className='m-2'
                  href="https://docs.google.com/spreadsheets/d/1Qr1rcwtGwDfMz2TTXxCQaZE7RFPpycKLGGWFy5d3tzE/edit?usp=sharing"
                  target="_blank">
                  Old Panel
                </Button>
              </Nav>
              <Nav>


                <Button
                  className='btn-warning m-2 p-0'
                ><Nav.Link as={Link} to="/history">
                    History
                  </Nav.Link>
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
        <Modal show={showResetModal} onHide={handleResetCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Reset</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to reset the data? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleResetCancel}>
              Cancel
            </Button>
            <Button variant='danger' onClick={handleResetConfirm}>
              Reset
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showDeleteModal} onHide={closeDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeDeleteModal}>
              No
            </Button>
            <Button variant="danger" onClick={() => { deleteItem(itemToDelete); closeDeleteModal(); }}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form autoComplete='off'>
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
                <div className='text-center'>OR</div>

                <Form.Control type='text' placeholder='Particular' onChange={(e) => setItemName(e.target.value)}>

                </Form.Control>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Rate</Form.Label>
                    {/* dynamic rate change */}
                    <Form.Control type="text" placeholder="Rate" value={rate.toLocaleString("en-IN")} onChange={(e) => {
                      setRate(e.target.value)
                    }} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Unit</Form.Label>
                    <Form.Control type="text" placeholder="Unit" value={unit.toLocaleString("en-IN")} onChange={(e) => setUnit(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>


              <Form.Group className="mb-3">
                <Form.Label>Dimension</Form.Label>
                <Form.Control type="text" placeholder="Enter Dimension" onChange={(e) => {
                  setDimension(e.target.value)
                }} disabled={dimensionFieldDisabled} />
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
        <Form className="mt-3 p-3 bg-body-tertiary" autoComplete='off'>
          <Row className='mb-2'>
            {/* <Col xs={2}>

            <Form.Label>Name</Form.Label>
          </Col> */}
            <Col xs={12}>
              <Form.Control type="username" placeholder="Enter Name" name="name" value={formData.name}
                onChange={handleInputChange} />
            </Col>
          </Row>
          <Row className='mb-2'>
            {/* <Col xs={2}>

            <Form.Label>Address</Form.Label>
          </Col> */}
            <Col xs={12}>
              <Form.Control type="username" placeholder="Enter Address" name="address" value={formData.address}
                onChange={handleInputChange} />
            </Col>
          </Row>
          <Row className='mb-2'>
            {/* <Col xs={2}>

            <Form.Label>Contact no</Form.Label>
          </Col> */}
            <Col xs={12}>
              <Form.Control type="username" placeholder="Enter Contact No" name='phone' value={formData.phone}
                onChange={handleInputChange} />
            </Col>
          </Row>
          <Row>
            {/* <Col xs={2}>

            <Form.Label>Contact no</Form.Label>
          </Col> */}
            <Col xs={8}>
              <Form.Control as="textarea" placeholder="Enter Description" name='description' rows={3} value={formData.description}
                onChange={handleInputChange} />
            </Col>
            <Col xs={4}>
              <Form.Control placeholder="Advances" name='advances' value={formData.advances}
                onChange={handleInputChange}
              />
              <Form.Control className='mt-2' placeholder='Advances Total' name='advancesTotal' onFocus={() => {
                try {
                  const advancesTotal = eval(formData.advances)
                  // console.log(advancesTotal)
                  setFormData((prevState) => ({ ...prevState, advancesTotal }))
                } catch (error) {
                  setFormData((prevState) => ({ ...prevState, advancesTotal: 0 }))
                }
              }} value={Number(formData.advancesTotal).toLocaleString("en-IN")} readOnly />
            </Col>
          </Row>

        </Form>
        <Row className='mt-3'>
          <Col>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Dimension</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bill.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{row.id}</td>
                    <td>
                      <Form.Control type="text" value={row.itemName} style={{ minWidth: "175px" }} onChange={(e) => handleParticularChange(row.id, e.target.value)} />
                    </td>
                    <td>
                      <Form.Control type="text" value={row.dimension} onChange={(e) => handleDimensionChange(row.id, e.target.value)} />
                    </td>
                    <td style={{ minWidth: "80px" }}>
                      <Form.Control type="text" value={row.rate} onChange={(e) => handleRateChange(row.id, e.target.value)} />
                    </td>
                    <td>{Number(row.total).toLocaleString("en-IN")}</td>
                    <td><Button variant='outline-danger' onClick={() => openDeleteModal(row.id)}>Delete</Button></td>
                  </tr>
                ))}
                <tr key="total">
                  <td colSpan={5} className='text-end'>Total</td>
                  <td>₹ {bill.reduce((accumulator, currentValue) => {
                    return accumulator + Number(currentValue['total']);
                  }, 0).toLocaleString("en-IN")}</td>
                </tr>
                <tr key="advance">
                  <td colSpan={5} className='text-end'>Advance</td>
                  <td style={{ minWidth: "100px" }}>₹ {Number(formData.advancesTotal).toLocaleString("en-IN")}</td>
                </tr>
                <tr key="balance" className='fw-bold'>
                  <td colSpan={5} className='text-end'>Balance</td>
                  <td>₹
                    {bill.reduce((accumulator, currentValue) => {
                      return accumulator + Number(currentValue['total']);
                    }, -1 * formData.advancesTotal).toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className='d-flex'>
            <PDFDownloadLink document={<InvoicePDF bill={bill} formData={formData} />} fileName={`${formData.name}.pdf`}>
              {({ blob, url, loading, error }) => {
                if (loading) {
                  return 'Loading document'
                } else {
                  return (
                    <Button
                      onClick={async () => {
                        // console.log({ ...formData, bills: JSON.stringify(bill) })
                        const { error } = await supabase
                          .from('histories')
                          .insert({ ...formData, bills: JSON.stringify(bill) });

                        if (error) {
                          console.log(error);
                          alert("An error occurred, please contact Saurabh!");
                        }
                      }}
                      variant="outline-info"
                      size="large"
                      className="custom-button"
                      style={{
                        fontWeight: 'bold',
                        fontSize: '18px',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        marginBottom: '14px',
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      Download now!
                    </Button>
                  )
                }
              }
              }
            </PDFDownloadLink>
          </Col>

        </Row>
      </Container>
    </>
  );
}

export default BillApp;