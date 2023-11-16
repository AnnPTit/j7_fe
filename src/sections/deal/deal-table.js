import PropTypes from "prop-types";
import moment from "moment";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";

export const DealTable = (props) => {
  const { items = [], selected = [] } = props;

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A"; // Return a default value when price is not a valid number
    }

    return price.toLocaleString({ style: "currency", currency: "VND" }).replace(/\D00(?=\D*$)/, "");
  };

  const getPaymentMethodColor = (method) => {
    if (method === true) {
      return { color: "primary", text: "Tiền mặt" };
    } else if (method === false) {
      return { color: "warning", text: "Chuyển khoản" };
    } else {
      return { color: "default", text: "Unknown" };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 0:
        return { color: "error", text: "Thất bại" };
      case 1:
        return { color: "success", text: "Thành công" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  return (
    <Card style={{ marginBottom: 50 }}>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã HĐ</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Hình thức</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Người xác nhận</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((payment, index) => {
                const created = moment(payment.createAt).format("DD/MM/YYYY - hh:mm:ss");
                const methodPayment = getPaymentMethodColor(payment.method);
                const methodPaymentText = methodPayment.text;
                const statusPayment = getPaymentStatusColor(payment.status);
                const statusPaymentText = statusPayment.text;

                return (
                  <TableRow style={{ height: 80 }} hover key={payment.id}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{payment.order.orderCode}</TableCell>
                    <TableCell>{payment.order.customer.fullname}</TableCell>
                    <TableCell>
                      <SeverityPill color="error">{formatPrice(payment.totalMoney)}</SeverityPill>
                    </TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>
                      <SeverityPill variant="contained" color={methodPayment.color}>
                        {methodPaymentText}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <SeverityPill variant="contained" color={statusPayment.color}>
                        {statusPaymentText}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {payment.order.account && payment.order.account.fullname
                        ? payment.order.account.fullname
                        : "NaN"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

DealTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
