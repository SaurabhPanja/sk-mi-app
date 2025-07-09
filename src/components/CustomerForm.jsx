import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { safeEvaluate, formatIndianCurrency } from '../utils/calculations';

const CustomerForm = ({ formData, onFormChange }) => {
  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handleAdvanceFocus = () => {
    try {
      const advancesTotal = safeEvaluate(formData.advances);
      handleInputChange('advancesTotal', advancesTotal);
    } catch (error) {
      handleInputChange('advancesTotal', 0);
    }
  };

  return (
    <Form className="mt-3 p-3 bg-body-tertiary" autoComplete="off">
      <Row className='mb-2'>
        <Col xs={12}>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            aria-label="Customer name"
          />
        </Col>
      </Row>
      
      <Row className='mb-2'>
        <Col xs={12}>
          <Form.Control
            type="text"
            placeholder="Enter Address"
            name="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            aria-label="Customer address"
          />
        </Col>
      </Row>
      
      <Row className='mb-2'>
        <Col xs={12}>
          <Form.Control
            type="tel"
            placeholder="Enter Contact No"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            aria-label="Customer phone number"
          />
        </Col>
      </Row>
      
      <Row>
        <Col xs={8}>
          <Form.Control
            as="textarea"
            placeholder="Enter Description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            aria-label="Project description"
          />
        </Col>
        <Col xs={4}>
          <Form.Control
            type="text"
            placeholder="Advances"
            name="advances"
            value={formData.advances}
            onChange={(e) => handleInputChange('advances', e.target.value)}
            onFocus={handleAdvanceFocus}
            aria-label="Advance amount"
          />
          <Form.Control
            className='mt-2'
            type="text"
            placeholder='Advances Total'
            name='advancesTotal'
            value={formatIndianCurrency(formData.advancesTotal)}
            readOnly
            aria-label="Calculated advance total"
          />
        </Col>
      </Row>
    </Form>
  );
};

export default CustomerForm; 