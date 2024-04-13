import React from 'react';
// import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFDownloadLink, Document,  Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const MyDocument = () => (

  <div>
  <PDFDownloadLink document={  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>} fileName="somename.pdf">
    {({ blob, url, loading, error }) =>
      loading ? 'Loading document...' : 'Download now!'
    }
  </PDFDownloadLink>
</div>

);

export default MyDocument