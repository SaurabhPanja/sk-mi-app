import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const MAX_ITEM_TABLE = 25

Font.register(
  { family: 'opensans', src: '/fonts/opensans.ttf' })

const styles = StyleSheet.create({
  page: {
    // margin: '5px',
    padding: '20px',
    fontSize: '12px',
    width: '100px',
    fontFamily: 'opensans'
  },
  header: {
    marginBottom: 5,
    textAlign: 'center',
    backgroundColor: "#B19CD9",
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
      <Text>Rizwan Bhai POP</Text>
    </View>
    <View style={styles.companyInfo}>
      <Text>Faijan park 2 bhoja talaoudi</Text>
      <Text>Phone no.: 9725955463 Email: rijwansiddiki2450@gmail.com</Text>
    </View>
  </View>
);

const splitBillItems = (bill) => {
  const billPages = [];
  for (let i = 0; i < bill.length; i += MAX_ITEM_TABLE) {
    billPages.push(bill.slice(i, i + MAX_ITEM_TABLE));
  }
  return billPages;
};

export default ({ bill, formData }) => {
  const billPages = splitBillItems(bill);

  return (
    <Document>
      {billPages.map((billPage, index) => (
        <Page style={styles.page} key={index}>
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
            {billPage.map((item, itemIndex) => (
              <View style={styles.tableRow} key={`${index}-${itemIndex}`}>
                <Text style={{ width: '5%', ...styles.tableCol }}>{itemIndex + 1 + (index * MAX_ITEM_TABLE)}</Text>
                <Text style={{ width: '45%', ...styles.tableCol }}>{item.itemName}</Text>
                <Text style={{ width: '20%', ...styles.tableCol }}>{item.dimension}</Text>
                <Text style={{ width: '10%', ...styles.tableCol }}>{item.rate}</Text>
                <Text style={{ width: '20%', ...styles.tableCol }}>{Number(item.total).toLocaleString("en-IN")}</Text>
              </View>
            ))}
          </View>
          {index === billPages.length - 1 && (
            <>
              <View>
                <View style={styles.tableRow}>
                  <Text style={{ width: '80%', fontSize: '14px', ...styles.tableCol }}>Total</Text>
                  <Text style={{ width: '20%', fontSize: '14px', ...styles.tableCol }}>{billPages.reduce((accumulator, currentPage) => {
                    return accumulator + currentPage.reduce((accum, curr) => accum + Number(curr.total), 0);
                  }, 0).toLocaleString("en-IN")}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={{ width: '80%', fontSize: '14px', ...styles.tableCol }}>Advance</Text>
                  <Text style={{ width: '20%', fontSize: '14px', ...styles.tableCol }}>{Number(formData.advancesTotal).toLocaleString("en-IN")}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={{ width: '80%', fontSize: '18px', ...styles.tableCol }}>Balance</Text>
                  <Text style={{ width: '20%', fontSize: '18px', ...styles.tableCol }}>{billPages.reduce((accumulator, currentPage) => {
                    return accumulator + currentPage.reduce((accum, curr) => accum + Number(curr.total), 0);
                  }, -1 * formData.advancesTotal).toLocaleString("en-IN")}</Text>
                </View>
              </View>
              <View style={{ fontWeight: 'bold' }}>
                <Text>
                  Description / Advance(s)
                </Text>
              </View>
              <View>
                <Text>{formData.description}</Text>
              </View>
            </>
          )}
        </Page>
      ))}
    </Document>
  );
};