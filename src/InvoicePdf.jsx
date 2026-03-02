import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const MAX_ITEM_TABLE = 25

Font.register(
  { family: 'opensans', src: '/fonts/opensans.ttf' })

const styles = StyleSheet.create({
  page: {
    padding: '20px',
    fontSize: '12px',
    fontFamily: 'opensans'
  },
  header: {
    marginBottom: 5,
    textAlign: 'center',
    backgroundColor: "#B19CD9", // Will be overridden by config
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
    width: '100%',
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
    padding: 4,
    overflow: 'hidden',
    minWidth: 0,
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

// Split long strings with explicit newlines so they wrap to the next line in the cell
const wrapLongText = (str, maxChars = 14) => {
  const s = str != null ? String(str) : '';
  if (!s || s.length <= maxChars) return s;
  const lines = [];
  for (let i = 0; i < s.length; i += maxChars) {
    lines.push(s.slice(i, i + maxChars));
  }
  return lines.join('\n');
};

const colWidths = {
  col1: { width: '5%', flexGrow: 0, flexShrink: 0 },
  col2: { width: '35%', flexGrow: 0, flexShrink: 1, minWidth: 0 },
  col3: { width: '30%', flexGrow: 0, flexShrink: 1, minWidth: 0 },
  col4: { width: '12%', flexGrow: 0, flexShrink: 0 },
  col5: { width: '18%', flexGrow: 0, flexShrink: 0 },
};

const splitBillItems = (bill) => {
  const billPages = [];
  for (let i = 0; i < bill.length; i += MAX_ITEM_TABLE) {
    billPages.push(bill.slice(i, i + MAX_ITEM_TABLE));
  }
  return billPages;
};

export default ({ bill = [], formData = {}, config }) => {
  const billPages = splitBillItems(Array.isArray(bill) ? bill : []);
  
  // Merge config theme color with styles
  const headerStyle = { ...styles.header, backgroundColor: config?.themeColor ?? styles.header.backgroundColor };

  return (
    <Document>
      {billPages.map((billPage, index) => (
        <Page style={styles.page} key={index}>
          <View style={headerStyle}>
            <View style={styles.title}>
              <Text>{config?.companyName ?? ''}</Text>
            </View>
            <View style={styles.companyInfo}>
              <Text>{config?.address ?? ''}</Text>
              <Text>Phone no.: {config?.phone ?? ''} Email: {config?.email ?? ''}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={{ flexGrow: 1.5, fontWeight: '800' }}>
              <Text>{formData.name ?? ''}</Text>
              <Text>{formData.address ?? ''}</Text>
              <Text>{formData.phone ?? ''}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text style={{ width: '30%' }}>{new Date().toLocaleString('en-IN')}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCol, colWidths.col1]}><Text>#</Text></View>
              <View style={[styles.tableCol, colWidths.col2]}><Text>Item Name</Text></View>
              <View style={[styles.tableCol, colWidths.col3]}><Text>Dimension</Text></View>
              <View style={[styles.tableCol, colWidths.col4]}><Text>Rate</Text></View>
              <View style={[styles.tableCol, colWidths.col5]}><Text>Total</Text></View>
            </View>
            {billPage.map((item, itemIndex) => (
              <View style={styles.tableRow} key={`${index}-${itemIndex}`} wrap={false}>
                <View style={[styles.tableCol, colWidths.col1]}><Text>{itemIndex + 1 + (index * MAX_ITEM_TABLE)}</Text></View>
                <View style={[styles.tableCol, colWidths.col2]}><Text wrap>{item.itemName ?? ''}</Text></View>
                <View style={[styles.tableCol, colWidths.col3]}><Text>{wrapLongText(item.dimension)}</Text></View>
                <View style={[styles.tableCol, colWidths.col4]}><Text>{item.rate ?? ''}</Text></View>
                <View style={[styles.tableCol, colWidths.col5]}><Text>{Number(item.total || 0).toLocaleString("en-IN")}</Text></View>
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
                  <Text style={{ width: '20%', fontSize: '14px', ...styles.tableCol }}>{Number(formData.advancesTotal || 0).toLocaleString("en-IN")}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={{ width: '80%', fontSize: '18px', ...styles.tableCol }}>Balance</Text>
                  <Text style={{ width: '20%', fontSize: '18px', ...styles.tableCol }}>{billPages.reduce((accumulator, currentPage) => {
                    return accumulator + currentPage.reduce((accum, curr) => accum + Number(curr.total), 0);
                  }, -1 * (formData.advancesTotal || 0)).toLocaleString("en-IN")}</Text>
                </View>
              </View>
              <View style={{ fontWeight: 'bold' }}>
                <Text>
                  Description / Advance(s)
                </Text>
              </View>
              <View>
                <Text>{formData.description ?? ''}</Text>
              </View>
            </>
          )}
        </Page>
      ))}
    </Document>
  );
};