import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { calculateTotal, formatIndianCurrency } from '../utils/calculations';
import { VALIDATION_MESSAGES } from '../constants/config';

const AddItemModal = ({ 
  show, 
  onHide, 
  onAdd, 
  labourCharges 
}) => {
  const [formData, setFormData] = useState({
    itemName: '',
    rate: '',
    unit: '',
    dimension: '',
    total: 0
  });
  const [dimensionError, setDimensionError] = useState(false);
  const [dimensionFieldDisabled, setDimensionFieldDisabled] = useState(true);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!show) {
      setFormData({
        itemName: '',
        rate: '',
        unit: '',
        dimension: '',
        total: 0
      });
      setDimensionError(false);
      setDimensionFieldDisabled(true);
    }
  }, [show]);

  // Calculate total when rate or dimension changes
  useEffect(() => {
    if (formData.rate && formData.dimension) {
      const total = calculateTotal(formData.rate, formData.dimension);
      setFormData(prev => ({ ...prev, total }));
      setDimensionError(false);
    }
  }, [formData.rate, formData.dimension]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleParticularSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedParticular = labourCharges.find(
        lc => lc.particular === selectedOption.value
      );
      
      if (selectedParticular) {
        setFormData({
          itemName: selectedOption.value,
          rate: selectedParticular.rate,
          unit: selectedParticular.unit,
          dimension: '',
          total: 0
        });
        setDimensionFieldDisabled(false);
      }
    }
  };

  const handleSubmit = () => {
    if (formData.itemName && formData.rate && formData.dimension && formData.total > 0) {
      onAdd({
        id: Date.now(), // Use timestamp for unique ID
        itemName: formData.itemName,
        rate: formData.rate,
        dimension: formData.dimension,
        total: formData.total
      });
      onHide();
    }
  };

  const isFormValid = formData.itemName && formData.rate && formData.dimension && formData.total > 0;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form autoComplete="off">
          <Form.Group className="mb-3">
            <Form.Label>Particular</Form.Label>
            <Select
              onChange={handleParticularSelect}
              options={labourCharges.map(lc => ({
                value: lc.particular,
                label: lc.particular
              }))}
              placeholder="Select from panel or type below"
              isClearable
            />
            <div className="text-center my-2">OR</div>
            <Form.Control
              type="text"
              placeholder="Enter particular manually"
              value={formData.itemName}
              onChange={(e) => handleInputChange('itemName', e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Rate</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Rate"
                  value={formData.rate}
                  onChange={(e) => handleInputChange('rate', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Unit</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Dimension</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter dimension (e.g., 10x5)"
              value={formData.dimension}
              onChange={(e) => {
                handleInputChange('dimension', e.target.value);
                setDimensionFieldDisabled(false);
              }}
              disabled={dimensionFieldDisabled}
            />
            {dimensionError && (
              <Form.Text className="text-danger">
                {VALIDATION_MESSAGES.DIMENSION_ERROR}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total</Form.Label>
            <Form.Control
              type="text"
              placeholder="Total"
              value={formatIndianCurrency(formData.total)}
              disabled
              className="fw-bold"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Add Item
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddItemModal; 