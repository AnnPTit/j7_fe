import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const PDFDocument = ({ order, orderDetailData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Hóa đơn số: {order.orderCode}</Text>
          <Text>Tên khách hàng: {order.customer.fullname}</Text>
          {/* Thêm các thông tin khác của hóa đơn và phòng ở đây */}
          {/* Ví dụ: Loại phòng, Giá phòng, Dịch vụ, Ngày check-in, Ngày check-out, v.v. */}
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default PDFDocument;
