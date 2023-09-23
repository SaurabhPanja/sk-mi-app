import React from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';

const ResponsiveTable = () => {
  // Create sample data for 5 rows and 10 columns
  const tableData = [];
  for (let i = 1; i <= 5; i++) {
    const rowData = [];
    for (let j = 1; j <= 10; j++) {
      rowData.push(`Row ${i}, Column ${j}`);
    }
    tableData.push(rowData);
  }

  return (
    <Container>
      <Row>
        <Col>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                {Array.from({ length: 10 }, (_, index) => (
                  <th key={index}>Header {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, columnIndex) => (
                    <td key={columnIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ResponsiveTable;
