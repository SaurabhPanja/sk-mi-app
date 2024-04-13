import { useState, useEffect, useRef } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import { supabase } from './supabase';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom';

export default () => {
    const [histories, setHistories] = useState([])
    useEffect( () => {
        async function getHistories() {
          const { data, error } = await supabase.from('histories').select()
    
        //   console.log(data)
          if (data.length > 0) {
            setHistories(data)
          }
        }
    
      getHistories()
      }, [])
    return(
        <Container>
        <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
            <Container>
                <Navbar.Brand href="/" className='text-danger fw-bold'>S K Maidul Islam</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>

                        <Nav.Link as={Link} to="/">
                            <Button
                                className='btn-dark m-2'
                            >
                                Home
                            </Button></Nav.Link>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <Row className='mt-3'>
            <Col>
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>History</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {histories.map((history, historyIndex) => (
                            <tr key={historyIndex}>
                                <td>{historyIndex + 1}</td>
                                <td>
                                    <a href={`/history/${history.id}`}>{history.name} | {history.address} | {history.phone}</a>
                                </td>
                                <td>{new Date(history.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    </Container>
    )
}
