import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Row, Col, Table, Badge, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSupabase } from './hooks/useSupabase';
import { APP_CONFIG } from './constants/config';

const HistoryList = () => {
  const [histories, setHistories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [error, setError] = useState(null);

  const { loading, error: supabaseError, fetchHistories, deleteHistory } = useSupabase();

  useEffect(() => {
    loadHistories();
  }, []);

  const loadHistories = async () => {
    try {
      const data = await fetchHistories();
      setHistories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load histories. Please try again.');
    }
  };

  const filteredHistories = histories.filter(history =>
    history.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    history.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    history.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (historyId) => {
    setSelectedHistoryId(historyId);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const success = await deleteHistory(selectedHistoryId);
      if (success) {
        setHistories(histories.filter(history => history.id !== selectedHistoryId));
        setError(null);
      } else {
        setError('Failed to delete history. Please try again.');
      }
    } catch (err) {
      setError('Failed to delete history. Please try again.');
    }

    setShowModal(false);
    setSelectedHistoryId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHistoryId(null);
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Container>
      <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
        <Container>
          <Navbar.Brand href="/" className='text-danger fw-bold'>
            {APP_CONFIG.COMPANY_NAME}
          </Navbar.Brand>
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

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {supabaseError && (
        <Alert variant="warning" dismissible onClose={() => setError(null)}>
          Database error: {supabaseError}
        </Alert>
      )}

      <Row className='mt-3'>
        <Col>
          <Form.Group className='mb-2'>
            <Form.Control
              type="text"
              placeholder="Search by name, address, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search histories"
            />
          </Form.Group>
          
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer Details</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistories.map((history, historyIndex) => (
                <tr key={history.id || historyIndex}>
                  <td>{historyIndex + 1}</td>
                  <td>
                    <Link 
                      to={`/history/${history.id}`}
                      className="text-decoration-none"
                    >
                      <div className="fw-bold">{history.name || 'N/A'}</div>
                      <div className="text-muted small">{history.address || 'N/A'}</div>
                      <div className="text-muted small">{history.phone || 'N/A'}</div>
                    </Link>
                  </td>
                  <td>
                    <Badge bg="secondary">
                      {history.created_at ? 
                        new Date(history.created_at).toLocaleString() : 
                        'N/A'
                      }
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant='danger' 
                      size="sm"
                      onClick={() => handleDeleteClick(history.id)}
                      aria-label={`Delete history for ${history.name}`}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              
              {filteredHistories.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    {searchQuery ? 'No histories found matching your search.' : 'No histories found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <div className="modal fade show" 
           style={{ display: showModal ? 'block' : 'none' }}
           tabIndex="-1"
           aria-labelledby="deleteModalLabel"
           aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this history? This action cannot be undone.
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </div>
        {showModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </Container>
  );
};

export default HistoryList;