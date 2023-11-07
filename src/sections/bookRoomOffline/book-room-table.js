import PropTypes from "prop-types";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
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
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import { SeverityPill } from "src/components/severity-pill";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export const BookRoomTable = (props) => {
  const { items = [], selected = [] } = props;
  const fullname = localStorage.getItem("fullName");
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const [order, setOrder] = useState({
    id: "",
    typeOfOrder: "",
    orderCode: "",
    status: "",
    // customer: {},
    // account: {},
  });

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A"; // Return a default value when price is not a valid number
    }

    return price.toLocaleString({ style: "currency", currency: "VND" }).replace(/\D00(?=\D*$)/, "");
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

  // Hủy hóa đơn
  const handleCancelOrder = async (orderId) => {
    try {
      const payload = {
        deleted: fullname,
      };

      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Gửi payload về máy chủ để thực hiện hủy hóa đơn
      await axios.put(`http://localhost:2003/api/order/delete/${orderId}`, payload);

      setOrder({ ...order, status: 0 });
      toast.success("Hủy thành công!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      router.push(`/orders?id=${orderId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card sx={{ marginTop: 5, marginBottom: 3 }}>
      <ToastContainer />
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
                const created = moment(order.createAt).format("DD/MM/YYYY - HH:mm:ss");
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
                    <TableCell style={{ color: "red" }}>{formatPrice(order.totalMoney)}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>
                      <SeverityPill variant="contained" color={statusData.color}>
                        {statusText}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {order.status === 1 ? (
                        <>
                          <Link className="btn btn-primary m-xl-2" href={hrefUpdate}>
                            <SvgIcon fontSize="small">
                              <PencilSquareIcon />
                            </SvgIcon>
                          </Link>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="btn btn-danger m-xl-2"
                          >
                            <SvgIcon fontSize="small">
                              <TrashIcon />
                            </SvgIcon>
                          </button>
                        </>
                      ) : null}
                      {order.status === 2 ? (
                        <>
                          <Link className="btn btn-primary m-xl-2" href={hrefUpdate}>
                            <SvgIcon fontSize="small">
                              <PencilSquareIcon />
                            </SvgIcon>
                          </Link>
                        </>
                      ) : null}
                      {order.status === 3 ? (
                        <>
                          <Link className="btn btn-warning m-xl-2" href={hrefUpdate}>
                            <SvgIcon fontSize="small">
                              <EyeIcon />
                            </SvgIcon>
                          </Link>
                        </>
                      ) : null}
                      {order.status === 0 ? <></> : null}
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
