import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'opensans',
  src: '/fonts/opensans.ttf'
});

const styles = StyleSheet.create({
  page: {
    // margin: '5px',
    padding: '20px',
    fontSize: '12px',
    fontFamily: 'opensans'
  },
  header: {
    backgroundColor: "#B19CD9", // Will be overridden by config
    fontWeight: 'bold',
    color: '#fff',
    height: "60px",
    // fontSize: "36px",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px'
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
  invoiceDetails: {
    marginBottom: 5,
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
    padding: 2,
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#ddd',
  },
  partyLeft: {
    fontWeight: 'bold',
    width: '80%'
  }
});

export default ({ labourCharges, config }) => {
  const itemsPerPage = 32;
  const pages = [];
  let currentPage = [];
  
  // Merge config theme color with styles
  const headerStyle = { ...styles.header, backgroundColor: config.themeColor };

  labourCharges.forEach((item, index) => {
    currentPage.push(item);

    if ((index + 1) % itemsPerPage === 0 || index === labourCharges.length - 1) {
      pages.push(
        <Page style={styles.page} key={`page-${pages.length}`}>
          <View style={headerStyle}>
            <Text style={{ width: '33%', textAlign: 'left' }}>Phone no.: {config.phone}</Text>
            <Text style={styles.title}>{config.companyName}</Text>
            <Text style={{ width: '33%', textAlign: 'right' }}>{config.address} &nbsp;&nbsp;</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={{ width: '5%', ...styles.tableCol }}>&nbsp; #</Text>
              <Text style={{ width: '50%', ...styles.tableCol }}>&nbsp; Particular</Text>
              <Text style={{ width: '20%', ...styles.tableCol }}>&nbsp; Sqf/R.feet</Text>
              <Text style={{ width: '25%', ...styles.tableCol }}>&nbsp; Rate</Text>
            </View>
            {currentPage.map((item, idx) => (
              <View style={styles.tableRow} key={`item-${idx}`}>
                <Text style={{ width: '5%', ...styles.tableCol }}>&nbsp;{idx + 1 +  pages.length * itemsPerPage}</Text>
                <Text style={{ width: '50%', ...styles.tableCol }}>&nbsp;{item.particular}</Text>
                <Text style={{ width: '20%', ...styles.tableCol }}>&nbsp;{item.unit}</Text>
                <Text style={{ width: '25%', ...styles.tableCol }}>&nbsp;{item.rate}</Text>
              </View>
            ))}
          </View>
        </Page>
      );
      currentPage = [];
    }
  });

  return <Document>{pages}</Document>;
};