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
    marginBottom: 5,
    textAlign: 'center',
    backgroundColor: PDF_STYLES.PRIMARY_COLOR,
    padding: '10px 0',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff'
  },
  companyInfo: {
    marginBottom: 5,
    color: "#fff",
    fontSize: '10px'
  },
  customerInfo: {
    marginBottom: 10,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: 5,
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
  totalsSection: {
    marginTop: 10,
    borderTop: '1px solid #ddd',
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  totalLabel: {
    width: '80%',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  totalValue: {
    width: '20%',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  balanceRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid #000',
  },
  description: {
    marginTop: 15,
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 5,
  },
  descriptionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  }
});

const InvoiceHeader = () => (
  <View style={styles.header}>
    <View style={styles.title}>
      <Text>{APP_CONFIG.COMPANY_NAME}</Text>
    </View>
    <View style={styles.companyInfo}>
      <Text>{APP_CONFIG.COMPANY_ADDRESS}</Text>
      <Text>Phone: {APP_CONFIG.COMPANY_PHONE} | Email: {APP_CONFIG.COMPANY_EMAIL}</Text>
    </View>
  </View>
);

const CustomerInfo = ({ formData }) => (
  <View style={styles.customerInfo}>
    <View style={styles.tableRow}>
      <View style={{ flexGrow: 1.5, fontWeight: '800' }}>
        <Text>{formData.name || 'N/A'}</Text>
        <Text>{formData.address || 'N/A'}</Text>
        <Text>{formData.phone || 'N/A'}</Text>
      </View>
      <View style={{ flexGrow: 1 }}>
        <Text>Date: {new Date().toLocaleDateString('en-IN')}</Text>
      </View>
    </View>
  </View>
);

const splitBillItems = (bill) => {
  const billPages = [];
  for (let i = 0; i < bill.length; i += APP_CONFIG.MAX_ITEMS_PER_PAGE) {
    billPages.push(bill.slice(i, i + APP_CONFIG.MAX_ITEMS_PER_PAGE));
  }
  return billPages;
};

const InvoiceTable = ({ billPage, pageIndex }) => (
  <View style={styles.table}>
    <View style={[styles.tableRow, styles.tableHeader]}>
      <Text style={{ width: '5%', ...styles.tableCol }}>#</Text>
      <Text style={{ width: '45%', ...styles.tableCol }}>Item Name</Text>
      <Text style={{ width: '20%', ...styles.tableCol }}>Dimension</Text>
      <Text style={{ width: '10%', ...styles.tableCol }}>Rate</Text>
      <Text style={{ width: '20%', ...styles.tableCol }}>Total</Text>
    </View>
    {billPage.map((item, itemIndex) => (
      <View style={styles.tableRow} key={`${pageIndex}-${itemIndex}`}>
        <Text style={{ width: '5%', ...styles.tableCol }}>
          {itemIndex + 1 + (pageIndex * APP_CONFIG.MAX_ITEMS_PER_PAGE)}
        </Text>
        <Text style={{ width: '45%', ...styles.tableCol }}>{item.itemName}</Text>
        <Text style={{ width: '20%', ...styles.tableCol }}>{item.dimension}</Text>
        <Text style={{ width: '10%', ...styles.tableCol }}>{item.rate}</Text>
        <Text style={{ width: '20%', ...styles.tableCol }}>
          {Number(item.total).toLocaleString("en-IN")}
        </Text>
      </View>
    ))}
  </View>
);

const InvoiceTotals = ({ billPages, formData }) => {
  const totalAmount = billPages.reduce((accumulator, currentPage) => {
    return accumulator + currentPage.reduce((accum, curr) => accum + Number(curr.total), 0);
  }, 0);

  const advanceAmount = Number(formData.advancesTotal) || 0;
  const balanceAmount = totalAmount - advanceAmount;

  return (
    <View style={styles.totalsSection}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{totalAmount.toLocaleString("en-IN")}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Advance</Text>
        <Text style={styles.totalValue}>{advanceAmount.toLocaleString("en-IN")}</Text>
      </View>
      <View style={styles.balanceRow}>
        <Text style={styles.totalLabel}>Balance</Text>
        <Text style={styles.totalValue}>{balanceAmount.toLocaleString("en-IN")}</Text>
      </View>
    </View>
  );
};

const InvoiceDescription = ({ formData }) => (
  <View style={styles.description}>
    <Text style={styles.descriptionTitle}>Description / Advance(s)</Text>
    <Text>{formData.description || 'No description provided'}</Text>
  </View>
);

export default ({ bill, formData }) => {
  const billPages = splitBillItems(bill);

  return (
    <Document>
      {billPages.map((billPage, index) => (
        <Page style={styles.page} key={index}>
          <InvoiceHeader />
          <CustomerInfo formData={formData} />
          <InvoiceTable billPage={billPage} pageIndex={index} />
          
          {index === billPages.length - 1 && (
            <>
              <InvoiceTotals billPages={billPages} formData={formData} />
              <InvoiceDescription formData={formData} />
            </>
          )}
        </Page>
      ))}
    </Document>
  );
};