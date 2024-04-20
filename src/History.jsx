import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { supabase } from './supabase';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

export default () => {
    const [histories, setHistories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function getHistories() {
            const { data, error } = await supabase.from('histories').select().order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching histories:', error.message);
                return;
            }
            if (data.length > 0) {
                setHistories(data);
            }
        }

        getHistories();
    }, []);

    // Function to filter histories based on search query
    const filteredHistories = histories.filter(history =>
        history.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        history.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        history.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container>
            <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
                <Container>
                    <Navbar.Brand href="/" className='text-danger fw-bold'>S K Maidul Islam</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <Nav.Link as={Link} to="/">
                                <Button className='btn-dark m-2'>Home</Button>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Row className='mt-3'>
                <Col>
                <Form.Group className='mb-2'>
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>History</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistories.map((history, historyIndex) => (
                                <tr key={historyIndex}>
                                    <td>{historyIndex + 1}</td>
                                    <td>
                                        <Link to={`/history/${history.id}`}>{history.name} | {history.address} | {history.phone}</Link>
                                    </td>
                                    <td>
                                        <Badge bg="secondary">
                                            {new Date(history.created_at).toLocaleString()}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};
