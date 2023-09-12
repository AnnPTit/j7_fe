import PropTypes from "prop-types";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import Button from "@mui/material/Button";
import { SeverityPill } from "src/components/severity-pill";
import Link from "next/link";

export const BookRoomTable = (props) => {
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

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 0:
        return { color: "error", text: "Đã hủy" };
      case 1:
        return { color: "primary", text: "Chờ xác nhận" };
      case 2:
        return { color: "warning", text: "Đã nhận phòng" };
      case 3:
        return { color: "success", text: "Đã trả phòng" };
      case 4:
        return { color: "warning", text: "Pending" };
      case 5:
        return { color: "info", text: "Processing" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">STT</TableCell>
                <TableCell>Mã hóa đơn</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((order, index) => {
                const created = moment(order.createAt).format("DD/MM/YYYY - hh:mm:ss");
                const statusData = getStatusButtonColor(order.status);
                const statusText = statusData.text;
                const hrefUpdate = `/room-service?id=${order.id}`;

                return (
                  <TableRow hover key={order.id}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{formatPrice(order.totalMoney)}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>
                      <SeverityPill variant="contained" color={statusData.color}>
                        {statusText}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <Link className="btn btn-primary m-xl-2" href={hrefUpdate}>
                        <SvgIcon fontSize="small">
                          <PencilSquareIcon />
                        </SvgIcon>
                      </Link>
                      <button className="btn btn-danger m-xl-2">
                        <SvgIcon fontSize="small">
                          <TrashIcon />
                        </SvgIcon>
                      </button>
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

BookRoomTable.propTypes = {
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
