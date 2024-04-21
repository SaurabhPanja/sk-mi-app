import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register(
  { family: 'opensans', src: '/fonts/opensans.ttf' })

const styles = StyleSheet.create({
  page: {
    margin: '5px',
    fontSize: '12px',
    // marginRight: '12px',
    width: '100px',
    fontFamily: 'opensans'
  },
  header: {
    marginBottom: 5,
    textAlign: 'center',
    backgroundColor: "#00BFFE",
    // padding: '5px'
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold', marginBottom: 5,
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
  <View style={styles.header}>
    <View style={styles.title}>
      <Text>SK Maidul Islam</Text>
    </View>
    <View style={styles.companyInfo}>
      <Text>D 27 Abdullah Park, Nadiad</Text>
      <Text>Phone no & G Pay: 9898832796 Email: skmaidulsk@gmail.com</Text>
    </View>
  </View>
);

export default ({ bill, formData }) => (
  <Document>
    <Page style={styles.page}>
      <InvoiceHeader />
      <View style={styles.tableRow}>
        <View style={{ flexGrow: 1.5, fontWeight: '800' }}>
          <Text>{formData.name}</Text>
          <Text>{formData.address}</Text>
          <Text>{formData.phone}</Text>
        </View>
        <View style={{ flexGrow: 1 }}>
          <Text style={{ width: '30%' }}>{new Date().toLocaleString('en-IN')}</Text>
        </View>
      </View>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={{ width: '5%', ...styles.tableCol }}>#</Text>
          <Text style={{ width: '45%', ...styles.tableCol }}>Item Name</Text>
          <Text style={{ width: '20%', ...styles.tableCol }}>Dimension</Text>
          <Text style={{ width: '10%', ...styles.tableCol }}>Rate</Text>
          <Text style={{ width: '20%', ...styles.tableCol }}>Total</Text>
        </View>
        {bill && bill.map((item) => (
          <View style={styles.tableRow} key={item.id}>
            <Text style={{ width: '5%', ...styles.tableCol }}>{item.id}</Text>
            <Text style={{ width: '45%', ...styles.tableCol }}>{item.itemName}</Text>
            <Text style={{ width: '20%', ...styles.tableCol }}>{item.dimension}</Text>
            <Text style={{ width: '10%', ...styles.tableCol }}>{item.rate}</Text>
            <Text style={{ width: '20%', ...styles.tableCol }}>{Number(item.total).toLocaleString("en-IN")}</Text>
          </View>
        ))}
        <View>
          <View style={styles.tableRow}>
            <Text style={{ width: '80%', fontSize: '14px', ...styles.tableCol }}>Total</Text>
            <Text style={{ width: '20%', fontSize: '14px', ...styles.tableCol }}>{bill.reduce((accumulator, currentValue) => {
              return accumulator + Number(currentValue['total']);
            }, 0).toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={{ width: '80%', fontSize: '14px', ...styles.tableCol }}>Advance</Text>
            <Text style={{ width: '20%', fontSize: '14px', ...styles.tableCol }}>{Number(formData.advancesTotal).toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={{ width: '80%', fontSize: '18px', ...styles.tableCol }}>Balance</Text>
            <Text style={{ width: '20%', fontSize: '18px', ...styles.tableCol }}>{bill.reduce((accumulator, currentValue) => {
              return accumulator + Number(currentValue['total']);
            }, -1 * formData.advancesTotal).toLocaleString("en-IN")}</Text>
          </View>
        </View>
      </View>
      <View style={{fontWeight: 'bold'}}>
        <Text>
          Description / Advance(s)
        </Text>
      </View>
      <View>
        <Text>{formData.description}</Text>
      </View>
    </Page>
  </Document>
);