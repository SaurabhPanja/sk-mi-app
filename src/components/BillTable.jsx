import React from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { calculateTotal, formatIndianCurrency, calculateBillTotals } from '../utils/calculations';
import { APP_CONFIG } from '../constants/config';

const BillTable = ({ 
  billItems, 
  onUpdateItem, 
  onDeleteItem, 
  advanceTotal = 0 
}) => {
  const handleItemChange = (index, field, value) => {
    const updatedItem = { ...billItems[index], [field]: value };
    
    // Recalculate total if rate or dimension changes
    if (field === 'rate' || field === 'dimension') {
      updatedItem.total = calculateTotal(updatedItem.rate, updatedItem.dimension);
    }
    
    onUpdateItem(index, updatedItem);
  };

  const totals = calculateBillTotals(billItems, advanceTotal);

  return (
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
            {billItems.map((item, index) => (
              <tr key={item.id || index}>
                <td>{index + 1}</td>
                <td>
                  <Form.Control
                    type="text"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                    style={{ minWidth: "175px" }}
                    aria-label={`Item name for row ${index + 1}`}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={item.dimension}
                    onChange={(e) => handleItemChange(index, 'dimension', e.target.value)}
                    placeholder="e.g., 10x5"
                    aria-label={`Dimension for row ${index + 1}`}
                  />
                </td>
                <td style={{ minWidth: "80px" }}>
                  <Form.Control
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                    min="0"
                    step="0.01"
                    aria-label={`Rate for row ${index + 1}`}
                  />
                </td>
                <td className="fw-bold">
                  {APP_CONFIG.CURRENCY_SYMBOL} {formatIndianCurrency(item.total)}
                </td>
                <td>
                  <Button 
                    variant='outline-danger' 
                    size="sm"
                    onClick={() => onDeleteItem(item.id)}
                    aria-label={`Delete item ${item.itemName}`}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            
            {billItems.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No items added yet. Click "Add Item" to get started.
                </td>
              </tr>
            )}
            
            <tr className="table-secondary">
              <td colSpan={5} className='text-end fw-bold'>Total</td>
              <td className="fw-bold">
                {APP_CONFIG.CURRENCY_SYMBOL} {totals.formattedSubtotal}
              </td>
            </tr>
            <tr className="table-info">
              <td colSpan={5} className='text-end'>Advance</td>
              <td>
                {APP_CONFIG.CURRENCY_SYMBOL} {totals.formattedAdvance}
              </td>
            </tr>
            <tr className="table-warning fw-bold">
              <td colSpan={5} className='text-end'>Balance</td>
              <td>
                {APP_CONFIG.CURRENCY_SYMBOL} {totals.formattedBalance}
              </td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default BillTable; 