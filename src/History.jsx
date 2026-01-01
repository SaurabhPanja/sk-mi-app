import React, { useState, useEffect } from 'react';
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
import Modal from 'react-bootstrap/Modal';

const HistoryList = () => {
    const [histories, setHistories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedHistoryId, setSelectedHistoryId] = useState(null);

    useEffect(() => {
        fetchHistories();
    }, []);

    const fetchHistories = async () => {
        try {
            const { data, error } = await supabase
                .from('histories_new')
                .select()
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching histories:', error.message);
            } else {
                setHistories(data);
            }
        } catch (error) {
            console.error('Error fetching histories:', error.message);
        }
    };

    const filteredHistories = histories.filter(history =>
        history.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        history.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        history.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteClick = (historyId) => {
        setSelectedHistoryId(historyId);
        setShowModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const { error } = await supabase
                .from('histories_new')
                .delete()
                .match({ id: selectedHistoryId });

            if (error) {
                console.error('Error deleting history:', error.message);
            } else {
                setHistories(histories.filter(history => history.id !== selectedHistoryId));
            }
        } catch (error) {
            console.error('Error deleting history:', error.message);
        }

        setShowModal(false);
        setSelectedHistoryId(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedHistoryId(null);
    };

    return (
        <Container>
            <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
                <Container>
                    <Navbar.Brand href="/" className='text-danger fw-bold'>Rizwan Bhai POP</Navbar.Brand>
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
                                <th>Action</th>
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
                                    <td>
                                        <Button variant='danger' onClick={() => handleDeleteClick(history.id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this history?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default HistoryList;