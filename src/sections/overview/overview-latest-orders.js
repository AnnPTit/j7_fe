import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";

const statusMap = {
  1: "warning",
  3: "success",
  refunded: "error",
};

const getTypeOrderColor = (method) => {
  if (method === true) {
    return { color: "primary", text: "Tại quầy" };
  } else if (method === false) {
    return { color: "warning", text: "Online" };
  } else {
    return { color: "default", text: "Unknown" };
  }
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
    case 4:
      return { color: "secondary", text: "Đã xác nhận" };
    case 5:
      return { color: "info", text: "Thanh toán tiền cọc" };
    case 6:
      return { color: "error", text: "Từ chối" };
    case 7:
      return { color: "error", text: "Hết hạn" };
    case 8:
      return { color: "error", text: "Hết hạn thanh toán tiền cọc" };
    case 9:
      return { color: "error", text: "Hết hạn  checkin" };
    default:
      return { color: "default", text: "Unknown" };
  }
};

export const OverviewLatestOrders = (props) => {
  const { orders = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="HÓA ĐƠN MỚI NHẤT" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hóa đơn</TableCell>
                <TableCell>Loại hóa đơn</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell sortDirection="desc">Ngày tạo</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => {
                const typeOfOrderData = getTypeOrderColor(order.id);
                const typeOfOrderText = typeOfOrderData.text;
                const statusData = getStatusButtonColor(order.status);
                const statusText = statusData.text;

                return (
                  <TableRow hover key={index}>
                    <TableCell>{order.ref}</TableCell>
                    <TableCell>
                      <SeverityPill variant="contained" color={typeOfOrderData.color}>
                        {typeOfOrderText}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>
                      {order && order.createdAt && format(new Date(order.createdAt), "dd/MM/yyyy")}
                    </TableCell>
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

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
