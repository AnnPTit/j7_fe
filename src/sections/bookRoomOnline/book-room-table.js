import PropTypes from "prop-types";
import moment from "moment";
import { toast } from "react-toastify";
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
  Button,
  Select,
  Checkbox,
  TextField,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import { SeverityPill } from "src/components/severity-pill";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { Drawer } from "antd";
import { format } from "date-fns";

export const BookRoomTable = (props) => {
  const { items = [], selected = [] } = props;
  const [order, setOrder] = useState({});
  const [orderDetail, setOrderDetail] = useState([]);

  const [open, setOpen] = useState(false);
  const showDrawer = async (orderId) => {
    setOpen(true);
    try {
    } catch (error) {
      console.log(error);
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const responseOrder = await axios.get(
        `http://localhost:2003/api/order/detail-info/${orderId}`
      );
      setOrder(responseOrder.data);
      console.log(responseOrder.data);
      const responseOrderDetail = await axios.get(
        `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${orderId}`
      );
      console.log("OrderDetail: ", responseOrderDetail.data);
      setOrderDetail(responseOrderDetail.data);
    } catch (error) {
      console.log(error);
    }
  };
  const onClose = () => {
    setOpen(false);
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

  // Hủy hóa đơn
  const handleCancelOrder = async (id) => {
    try {
      // Make an API call to update the order status to "Đã xác nhận" (status: 2)
      await axios.put(`http://localhost:2003/api/order/delete/${id}`);
      setOrder({ ...order, status: 0 });
      toast.success("Hủy thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      // router.push(`/orders?id=${id}`);
    } catch (error) {
      console.log(error);
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
                <TableCell>Khách hàng</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((order, index) => {
                const created = moment(order.createAt).format("DD/MM/YYYY");
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
                    <TableCell>{order.customer.fullname}</TableCell>
                    <TableCell>{order.customer.phoneNumber}</TableCell>
                    <TableCell>{order.customer.email}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>
                      <SeverityPill variant="contained" color={statusData.color}>
                        {statusText}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => showDrawer(order.id)}>
                        <InformationCircleIcon />
                      </Button>
                      <Drawer
                        style={{ marginTop: 65 }}
                        width="55%"
                        title="Thông tin đặt phòng"
                        placement="right"
                        onClose={onClose}
                        open={open}
                      >
                        <Scrollbar>
                          <div>
                            <TextField
                              id="outlined-read-only-input"
                              label="Tên khách hàng"
                              defaultValue={order.customer.fullname}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            <br />
                            <br />
                            <TextField
                              id="outlined-read-only-input"
                              label="Số điện thoại"
                              defaultValue={order.customer.phoneNumber}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            <br />
                            <br />
                            <TextField
                              id="outlined-read-only-input"
                              label="Email"
                              defaultValue={order.customer.email}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            <hr />
                            <Box>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    {/* <TableCell></TableCell> */}
                                    <TableCell></TableCell>
                                    <TableCell>Phòng</TableCell>
                                    <TableCell>Loại phòng</TableCell>
                                    <TableCell>Ngày check-in</TableCell>
                                    <TableCell>Ngày check-out</TableCell>
                                    <TableCell>Sức chứa</TableCell>
                                    <TableCell>Số khách</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {orderDetail.map((od, index) => {
                                    return (
                                      <TableRow key={index}>
                                        {/* <TableCell>
                                          <Checkbox />
                                        </TableCell> */}
                                        <TableCell>
                                          {od && od.roomImages && od.roomImages[0] && (
                                            <img
                                              style={{ objectFit: "cover", width: 150 }}
                                              src={od.roomImages[0]}
                                              // alt={`Room ${index + 1} Image 1`}
                                            />
                                          )}
                                        </TableCell>
                                        <TableCell>{od.room.roomName}</TableCell>
                                        <TableCell>{od.room.typeRoom.typeRoomName}</TableCell>
                                        <TableCell>
                                          {od &&
                                            od.checkIn &&
                                            format(new Date(od.checkIn), "dd/MM/yyyy")}
                                        </TableCell>
                                        <TableCell>
                                          {od &&
                                            od.checkOut &&
                                            format(new Date(od.checkOut), "dd/MM/yyyy")}
                                        </TableCell>
                                        <TableCell>{od.room.typeRoom.capacity}</TableCell>
                                        <TableCell>{od.customerQuantity}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </Box>
                            <br />
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                              <TextField style={{ marginRight: 20 }} label="Tiền cọc" />
                              <Button variant="outlined">Xác nhận</Button>
                            </div>
                          </div>
                        </Scrollbar>
                      </Drawer>
                      {/* {order.status === 1 ? (
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
                      {order.status === 0 ? <></> : null} */}
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
