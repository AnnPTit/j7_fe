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
  Dialog,
  DialogTitle,
  DialogContent,
  TextareaAutosize,
  DialogActions,
  Button,
  TableSortLabel,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import { SeverityPill } from "src/components/severity-pill";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
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
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [openCancelRoom, setOpenCancelRoom] = React.useState(false);
  const [noteCancelRoom, setNoteCancelRoom] = useState("");

  const [orderBy, setOrderBy] = useState(""); // Column to be sorted
  const [sort, setSort] = useState("asc");

  const handleSort = (column) => {
    const isAsc = orderBy === column && sort === "asc";
    setSort(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const handleOpenCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenCancelRoom(true);
  };

  const handleCloseCancelOrder = () => {
    setNoteCancelRoom("");
    setOpenCancelRoom(false);
  };

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

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get("http://localhost:2003/api/order/loadBookRoomOffline");
        setOrder(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  // Hủy hóa đơn
  const handleCancelOrder = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const orderId = selectedOrderId;
      await axios.put(`http://localhost:2003/api/order/delete/${orderId}`, {
        note: noteCancelRoom,
        deleted: fullname,
      });
      setOrder({ ...order, status: 0 });
      handleCloseCancelOrder();
      toast.success("Hủy thành công!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      router.push(`/order-detail?id=${orderId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card sx={{ marginTop: 5, marginBottom: 3 }}>
      <ToastContainer />
      <Dialog open={openCancelRoom} onClose={handleCloseCancelOrder} maxWidth="md">
        <DialogTitle>Xác nhận khách hàng hủy phòng</DialogTitle>
        <DialogContent>
          <TextareaAutosize
            className="form-control"
            placeholder="Ghi chú"
            name="note"
            cols={100}
            style={{ height: 150 }}
            variant="outlined"
            value={noteCancelRoom}
            onChange={(e) => setNoteCancelRoom(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancelOrder}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">STT</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "orderCode"}
                    direction={orderBy === "orderCode" ? sort : "asc"}
                    onClick={() => handleSort("orderCode")}
                  >
                    Mã hóa đơn
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "totalMoney"}
                    direction={orderBy === "totalMoney" ? sort : "asc"}
                    onClick={() => handleSort("totalMoney")}
                  >
                    Tổng tiền
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "createAt"}
                    direction={orderBy === "createAt" ? sort : "asc"}
                    onClick={() => handleSort("createAt")}
                  >
                    Ngày tạo
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? sort : "asc"}
                    onClick={() => handleSort("status")}
                  >
                    Trạng thái
                  </TableSortLabel>
                </TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((order, index) => {
                const created = moment(order.createAt).format("DD/MM/YYYY - HH:mm:ss");
                const statusData = getStatusButtonColor(order.status);
                const statusText = statusData.text;
                const hrefUpdate = `/booking?id=${order.id}`;

                return (
                  <TableRow hover key={order.id}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>
                      <SeverityPill color="error">{formatPrice(order.totalMoney)}</SeverityPill>
                    </TableCell>
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
                            onClick={() => handleOpenCancelOrder(order.id)}
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
