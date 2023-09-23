import React from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';

const ResponsiveTable = ({ bill }) => {
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
            </tr>
          </thead>
          <tbody>
            {bill.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row.id}</td>
                <td>{row.itemName}</td>
                <td>{row.dimension}</td>
                <td>₹ {row.rate}</td>
                <td>₹ {Number(row.total).toLocaleString("en-IN")}</td>
              </tr>
            ))}
            <tr key="total">
              <td colSpan={4} className='text-end'>Total</td>
              <td className='fw-bold'>₹ {bill.reduce((accumulator, currentValue) => {
                return accumulator + Number(currentValue['total']);
              }, 0).toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default ResponsiveTable;
