import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';

// Components
import Header from './components/Header';
import CustomerForm from './components/CustomerForm';
import BillTable from './components/BillTable';
import AddItemModal from './components/AddItemModal';
import ConfirmationModal from './components/ConfirmationModal';
import Loader from './Loader';

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSupabase } from './hooks/useSupabase';

// Utils and Constants
import { PANEL_URLS, STORAGE_KEYS } from './constants/config';
import { getMockLabourCharges } from './utils/mockData';
import InvoicePDF from './InvoicePdf';

const App = () => {
  // State management
  const [labourCharges, setLabourCharges] = useState([]);
  const [panelUrl, setPanelUrl] = useState(PANEL_URLS.NEW_PANEL);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingPanel, setIsLoadingPanel] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  // Custom hooks
  const { loading: supabaseLoading, error: supabaseError, fetchHistoryById, saveHistory } = useSupabase();
  const [formData, setFormData] = useLocalStorage(STORAGE_KEYS.FORM_DATA, {
    name: '',
    address: '',
    phone: '',
    description: '',
    advances: '',
    advancesTotal: 0
  });
  const [billItems, setBillItems] = useLocalStorage(STORAGE_KEYS.BILL_DATA, []);

  // Get history ID from URL if present
  const { id: historyId } = useParams();

  // Fetch labour charges from panel
  useEffect(() => {
    const fetchLabourCharges = async () => {
      if (!panelUrl) return;
      
      setIsLoadingPanel(true);
      setError(null);
      setUsingMockData(false);
      
      try {
        console.log('Fetching from:', panelUrl);
        
        const response = await fetch(panelUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Response data:', result);

        // Handle different response formats
        let data = [];
        if (result.data) {
          data = result.data;
        } else if (Array.isArray(result)) {
          data = result;
        } else if (result.rows) {
          data = result.rows;
        } else {
          console.warn('Unexpected response format:', result);
          data = [];
        }

        setLabourCharges(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching labour charges:', err);
        
        // Check if it's a CORS error
        if (err.message.includes('CORS') || err.message.includes('blocked')) {
          setError('CORS Error: Cannot access Google Apps Script from localhost. Using sample data instead.');
          setUsingMockData(true);
          setLabourCharges(getMockLabourCharges());
        } else {
          setError(`Failed to load panel data: ${err.message}. Using sample data instead.`);
          setUsingMockData(true);
          setLabourCharges(getMockLabourCharges());
        }
      } finally {
        setIsLoadingPanel(false);
      }
    };

    fetchLabourCharges();
  }, [panelUrl]);

  // Load history data if ID is present
  useEffect(() => {
    const loadHistoryData = async () => {
      if (historyId) {
        const historyData = await fetchHistoryById(historyId);
        if (historyData) {
          const { name, address, phone, description, advances, advancesTotal, bills } = historyData;
          setFormData({ name, address, phone, description, advances, advancesTotal });
          setBillItems(JSON.parse(bills || '[]'));
        }
      }
    };

    loadHistoryData();
  }, [historyId, fetchHistoryById, setFormData, setBillItems]);

  // Handle form data changes
  const handleFormChange = useCallback((newFormData) => {
    setFormData(newFormData);
  }, [setFormData]);

  // Handle bill item updates
  const handleUpdateItem = useCallback((index, updatedItem) => {
    setBillItems(prev => {
      const newItems = [...prev];
      newItems[index] = updatedItem;
      return newItems;
    });
  }, [setBillItems]);

  // Handle adding new item
  const handleAddItem = useCallback((newItem) => {
    setBillItems(prev => [...prev, newItem]);
  }, [setBillItems]);

  // Handle deleting item
  const handleDeleteItem = useCallback((itemId) => {
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  }, []);

  // Confirm delete item
  const confirmDeleteItem = useCallback(() => {
    if (itemToDelete) {
      setBillItems(prev => prev.filter(item => item.id !== itemToDelete));
      setItemToDelete(null);
    }
    setShowDeleteModal(false);
  }, [itemToDelete, setBillItems]);

  // Handle reset
  const handleReset = useCallback(() => {
    setShowResetModal(true);
  }, []);

  // Confirm reset
  const confirmReset = useCallback(() => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      description: '',
      advances: '',
      advancesTotal: 0
    });
    setBillItems([]);
    setShowResetModal(false);
  }, [setFormData, setBillItems]);

  // Handle PDF download and save to history
  const handleDownloadPDF = useCallback(async () => {
    try {
      const historyData = {
        ...formData,
        bills: JSON.stringify(billItems)
      };
      
      const success = await saveHistory(historyData);
      if (!success) {
        setError('Failed to save to history. Please try again.');
      }
    } catch (err) {
      console.error('Error saving history:', err);
      setError('Failed to save to history. Please try again.');
    }
  }, [formData, billItems, saveHistory]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isLoading = supabaseLoading || isLoadingPanel;

  return (
    <>
      {isLoading && <Loader />}
      
      <Container fluid>
        <Header
          panelUrl={panelUrl}
          setPanelUrl={setPanelUrl}
          labourCharges={labourCharges}
          onReset={handleReset}
          onAddItem={() => setShowAddModal(true)}
        />

        {error && (
          <Alert variant="warning" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {usingMockData && (
          <Alert variant="info" dismissible onClose={() => setUsingMockData(false)}>
            <strong>Note:</strong> Using sample labour charges data. The Google Apps Script URLs may not be accessible from localhost due to CORS restrictions. 
            In production, this should work normally.
          </Alert>
        )}

        {supabaseError && (
          <Alert variant="warning" dismissible onClose={() => setError(null)}>
            Database error: {supabaseError}
          </Alert>
        )}

        <CustomerForm
          formData={formData}
          onFormChange={handleFormChange}
        />

        <BillTable
          billItems={billItems}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          advanceTotal={formData.advancesTotal}
        />

        <Row>
          <Col xs={12} className='d-flex justify-content-center'>
            <PDFDownloadLink 
              document={<InvoicePDF bill={billItems} formData={formData} />} 
              fileName={`${formData.name || 'invoice'}.pdf`}
            >
              {({ loading }) => (
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline-info"
                  size="large"
                  disabled={loading || billItems.length === 0}
                  className="custom-button"
                  style={{
                    fontWeight: 'bold',
                    fontSize: '18px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    marginBottom: '14px',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  {loading ? 'Generating PDF...' : 'Download Invoice'}
                </Button>
              )}
            </PDFDownloadLink>
          </Col>
        </Row>

        {/* Modals */}
        <AddItemModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onAdd={handleAddItem}
          labourCharges={labourCharges}
        />

        <ConfirmationModal
          show={showResetModal}
          onHide={() => setShowResetModal(false)}
          onConfirm={confirmReset}
          title="Confirm Reset"
          message="Are you sure you want to reset all data? This action cannot be undone."
          confirmText="Reset"
          cancelText="Cancel"
        />

        <ConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteItem}
          title="Confirm Deletion"
          message="Are you sure you want to delete this item?"
        />
      </Container>
    </>
  );
};

export default App;