import { useState, useEffect, useRef } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select'
import ReactPDF from '@react-pdf/renderer';

import ResponsiveTable from "./ResponsiveTable"
import InvoicePDF from './InvoicePdf';

function BasicExample() {
  return <InvoicePDF />
}

export default BasicExample;