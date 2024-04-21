import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register(
  { family: 'opensans', src: '/fonts/opensans.ttf' })

const styles = StyleSheet.create({
  page: {
    margin: '5px',
    fontSize: '12px',
    // marginRight: '12px',
    // width: '100px',
    fontFamily: 'opensans'
  },
  header: {
    backgroundColor: "#00BFFE",
    fontWeight: 'bold',
    color: '#fff'
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    // marginBottom: 5,
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
    // padding: 2,
    // width: '20%'
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

const InvoiceHeader = () => (
  <View style={[styles.tableRow, styles.header]}>
      <Text style={{ width: '33%', textAlign: 'left'}}>Mob no: 9898832796</Text>
      <Text style={{ width: '33%', textAlign: 'center', ...styles.title}}>SK Maidul Islam</Text>
      <Text style={{ width: '33%', textAlign:'right'}}>Nadiad &nbsp;&nbsp;</Text>
  </View>
);

export default ({ labourCharges }) => (
  <Document>
    <Page style={styles.page}>
      <InvoiceHeader />
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={{ width: '5%', ...styles.tableCol }}>&nbsp; #</Text>
          <Text style={{ width: '50%', ...styles.tableCol }}>&nbsp; Particular</Text>
          <Text style={{ width: '20%', ...styles.tableCol }}>&nbsp; Sqf/R.feet</Text>
          <Text style={{ width: '25%', ...styles.tableCol }}>&nbsp; Rate</Text>
        </View>
        {labourCharges && labourCharges.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={{ width: '5%', ...styles.tableCol }}>&nbsp;{index + 1}</Text>
            <Text style={{ width: '50%', ...styles.tableCol }}>&nbsp;{item.particular}</Text>
            <Text style={{ width: '20%', ...styles.tableCol }}>&nbsp;{item.unit}</Text>
            <Text style={{ width: '25%', ...styles.tableCol }}>&nbsp;{item.rate}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);