import React from 'react';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { APP_CONFIG, PANEL_URLS, SPREADSHEET_URLS } from '../constants/config';
import LabourChargesPdf from '../LabourChargesPdf';

const Header = ({ 
  panelUrl, 
  setPanelUrl, 
  labourCharges, 
  onReset, 
  onAddItem 
}) => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
      <Container>
        <Navbar.Brand href="/" className='text-danger fw-bold'>
          {APP_CONFIG.COMPANY_NAME}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Form.Select 
              size="lg"
              className='m-2' 
              value={panelUrl}
              onChange={(e) => setPanelUrl(e.target.value)}
              aria-label="Select panel type"
            >
              <option value={PANEL_URLS.NEW_PANEL}>New Panel</option>
              <option value={PANEL_URLS.OLD_PANEL}>Old Panel</option>
            </Form.Select>
          </Nav>
          
          <PDFDownloadLink 
            document={<LabourChargesPdf labourCharges={labourCharges} />} 
            fileName="labour_charges.pdf"
          >
            {({ loading }) => (
              <Nav>
                <Button
                  size='large'
                  disabled={loading}
                  aria-label="Download panel"
                >
                  {loading ? 'Loading document' : 'Download Panel'}
                </Button>
              </Nav>
            )}
          </PDFDownloadLink>
          
          <Nav>
            <Button 
              variant='danger' 
              className='m-2' 
              onClick={onReset}
              aria-label="Reset all data"
            >
              Reset
            </Button>
          </Nav>

          <Nav>
            <Button
              variant='info'
              className='m-2'
              href={SPREADSHEET_URLS.NEW_PANEL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open new panel spreadsheet"
            >
              New Panel
            </Button>
          </Nav>
          
          <Nav>
            <Button
              variant='dark'
              className='m-2'
              href={SPREADSHEET_URLS.OLD_PANEL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open old panel spreadsheet"
            >
              Old Panel
            </Button>
          </Nav>
          
          <Nav>
            <Button className='btn-warning m-2 p-0'>
              <Nav.Link as={Link} to="/history" aria-label="View history">
                History
              </Nav.Link>
            </Button>
          </Nav>
          
          <Nav>
            <Button
              className='btn-success m-2'
              onClick={onAddItem}
              aria-label="Add new item"
            >
              Add Item
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 