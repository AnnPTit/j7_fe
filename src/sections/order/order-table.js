import PropTypes from "prop-types";
import moment from "moment";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { useRouter } from "next/router";

export const OrderTable = (props) => {
  const router = useRouter();
  const { items = [], selected = [] } = props;

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A"; // Return a default value when price is not a valid number
    }

    return price.toLocaleString({ style: "currency", currency: "VND" }).replace(/\D00(?=\D*$)/, "");
  };

  const handleDelete = (id) => {
    props.onDelete(id);
  };

  const handleRowClick = (id) => {
    // Navigate to the "orders" page based on the selected row's ID
    router.push(`/orders?id=${id}`);
  };

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 0:
        return { color: "error", text: "Đã hủy" };
      case 1:
        return { color: "warning", text: "Chờ xác nhận" };
      case 2:
        return { color: "primary", text: "Đã nhận phòng" };
      case 3:
        return { color: "success", text: "Đã trả phòng" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  return (
    <Card style={{ marginBottom: 30 }}>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">STT</TableCell>
                <TableCell>Mã HĐ</TableCell>
                <TableCell>Loại HĐ</TableCell>
                <TableCell>Nhân viên</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((order, index) => {
                const created = moment(order.createAt).format("DD/MM/YYYY - HH:mm:ss");
                const statusData = getStatusButtonColor(order.status);
                const statusText = statusData.text;

                return (
                  <TableRow
                    hover
                    key={order.id}
                    style={{ cursor: "pointer", height: 80 }}
                    onClick={() => handleRowClick(order.id)}
                  >
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.typeOfOrder == 1 ? "Tại quầy" : "Online"}</TableCell>
                    <TableCell>
                      {order.account && order.account.fullname ? order.account.fullname : "NaN"}
                    </TableCell>
                    <TableCell>{order.customer.fullname}</TableCell>
                    <TableCell style={{ color: "red" }}>{formatPrice(order.totalMoney)}</TableCell>
                    <TableCell>{order.note}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>
                      <SeverityPill variant="contained" color={statusData.color}>
                        {statusText}
                      </SeverityPill>
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

OrderTable.propTypes = {
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
