import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { APP_CONFIG, PDF_STYLES } from './constants/config';

Font.register({
  family: PDF_STYLES.FONT_FAMILY,
  src: '/fonts/opensans.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: PDF_STYLES.PAGE_PADDING,
    fontSize: PDF_STYLES.FONT_SIZE,
    fontFamily: PDF_STYLES.FONT_FAMILY
  },
  header: {
    backgroundColor: PDF_STYLES.PRIMARY_COLOR,
    fontWeight: 'bold',
    color: '#fff',
    height: "60px",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    marginBottom: 10,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff'
  },
  companyInfo: {
    marginBottom: 5,
    color: "#fff"
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: PDF_STYLES.SECONDARY_COLOR,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 10,
    color: '#666',
  }
});

const InvoiceHeader = () => (
  <View style={styles.header}>
    <Text style={{ width: '33%', textAlign: 'left' }}>
      Mob: {APP_CONFIG.COMPANY_PHONE}
    </Text>
    <Text style={styles.title}>{APP_CONFIG.COMPANY_NAME}</Text>
    <Text style={{ width: '33%', textAlign: 'right' }}>
      {APP_CONFIG.COMPANY_ADDRESS.split(',')[0]}
    </Text>
  </View>
);

const LabourChargesTable = ({ labourCharges, pageIndex }) => (
  <View style={styles.table}>
    <View style={[styles.tableRow, styles.tableHeader]}>
      <Text style={{ width: '5%', ...styles.tableCol }}>#</Text>
      <Text style={{ width: '50%', ...styles.tableCol }}>Particular</Text>
      <Text style={{ width: '20%', ...styles.tableCol }}>Sqf/R.feet</Text>
      <Text style={{ width: '25%', ...styles.tableCol }}>Rate</Text>
    </View>
    {labourCharges.map((item, idx) => (
      <View style={styles.tableRow} key={`item-${pageIndex}-${idx}`}>
        <Text style={{ width: '5%', ...styles.tableCol }}>
          {idx + 1 + (pageIndex * APP_CONFIG.MAX_LABOUR_CHARGES_PER_PAGE)}
        </Text>
        <Text style={{ width: '50%', ...styles.tableCol }}>{item.particular}</Text>
        <Text style={{ width: '20%', ...styles.tableCol }}>{item.unit}</Text>
        <Text style={{ width: '25%', ...styles.tableCol }}>{item.rate}</Text>
      </View>
    ))}
  </View>
);

export default ({ labourCharges }) => {
  const itemsPerPage = APP_CONFIG.MAX_LABOUR_CHARGES_PER_PAGE;
  const pages = [];
  let currentPage = [];

  labourCharges.forEach((item, index) => {
    currentPage.push(item);

    if ((index + 1) % itemsPerPage === 0 || index === labourCharges.length - 1) {
      pages.push(
        <Page style={styles.page} key={`page-${pages.length}`}>
          <InvoiceHeader />
          <LabourChargesTable 
            labourCharges={currentPage} 
            pageIndex={pages.length} 
          />
          <Text style={styles.pageNumber}>
            Page {pages.length + 1} of {Math.ceil(labourCharges.length / itemsPerPage)}
          </Text>
        </Page>
      );
      currentPage = [];
    }
  });

  return <Document>{pages}</Document>;
};