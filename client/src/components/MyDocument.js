import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const MyDocument = () => {
  // Create styles
const hello = "hello world"

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });

  return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>{hello}</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
  );
};

export default MyDocument;
