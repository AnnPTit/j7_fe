import { useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import {
  Box,
  Card,
  Stack,
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
import Link from "next/link";
import { SeverityPill } from "src/components/severity-pill";

export const RoomTable = (props) => {
  const { items = [], selected = [] } = props;

  // useEffect(() => {
  //   // Định nghĩa hàm fetchData bên trong useEffect
  //   async function fetchData() {
  //     try {
  //       const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
  //       // Kiểm tra xem accessToken có tồn tại không
  //       if (!accessToken) {
  //        console.log("Bạn chưa đăng nhập");
  //         return;
  //       }
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
  //       const response = await axios.get("http://localhost:2003/api/admin/floor/getList");
  //       const response2 = await axios.get("http://localhost:2003/api/admin/type-room/getList");
  //       console.log(response.data);
  //       console.log(response2.data);
  //       setFloor(response.data);
  //       setTypeRoom(response2.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   // Gọi hàm fetchData ngay lập tức
  //   fetchData();
  // }, []);

  const handleDelete = (id) => {
    props.onDelete(id);
  };

  const handleChangeStatus = (id) => {
    props.onChangeStatus(id);
  };

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 0:
        return { color: "error", text: "Phòng đang sữa chữa" };
      case 1:
        return { color: "success", text: "Phòng trống" };
      case 2:
        return { color: "warning", text: "Phòng đã được đặt" };
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
                <TableCell>Mã phòng</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Tên phòng</TableCell>
                <TableCell>Loại phòng</TableCell>
                <TableCell>Tầng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((room, index) => {
                const statusData = getStatusButtonColor(room.status);
                const statusText = statusData.text;
                const hrefUpdate = `/update/updateRoom/updateRoom?id=${room.id}`;
                const alertDelete = () => {
                  Swal.fire({
                    title: "Bạn chắc chắn muốn xóa chứ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Hủy",
                    confirmButtonText: "Chắc chắn!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDelete(room.id);
                      // Swal.fire("Đã xóa!", "Dữ liệu đã được xóa.", "success");
                    }
                  });
                };
                const alertResetStatus = () => {
                  Swal.fire({
                    title: "Bạn chắc chắn muốn khôi phục trạng thái cho phòng ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Chắc chắn!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleChangeStatus(room.id);
                      // Swal.fire("Đã xóa!", "Dữ liệu đã được xóa.", "success");
                    }
                  });
                };
                return (
                  <TableRow hover key={room.id}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{room.roomCode}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        {room.photoList.length > 0 && ( // Check if photoList is not empty
                          <img
                            key={room.photoList[0].id} // Use key from the first photo
                            src={`${room.photoList[0].url}`} // Use URL from the first photo
                            width={200}
                            height={200}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{room.roomName}</TableCell>
                    <TableCell>{room.typeRoom.typeRoomName}</TableCell>
                    <TableCell>{room.floor.floorName}</TableCell>
                    <TableCell>
                      <SeverityPill variant="contained" color={statusData.color}>
                        {statusText}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {room.status === 0 ? (
                        <>
                          <Link className="btn btn-primary m-xl-2" href={hrefUpdate}>
                            <SvgIcon fontSize="small">
                              <PencilSquareIcon />
                            </SvgIcon>
                          </Link>
                          <button className="btn btn-success m-xl-2" onClick={alertResetStatus}>
                            <SvgIcon fontSize="small">
                              <RotateLeftIcon />
                            </SvgIcon>
                          </button>
                        </>
                      ) : room.status !== 2 ? (
                        <>
                          <Link className="btn btn-primary m-xl-2" href={hrefUpdate}>
                            <SvgIcon fontSize="small">
                              <PencilSquareIcon />
                            </SvgIcon>
                          </Link>
                          <button className="btn btn-danger m-xl-2" onClick={alertDelete}>
                            <SvgIcon fontSize="small">
                              <TrashIcon />
                            </SvgIcon>
                          </button>
                        </>
                      ) : null}
                    </TableCell>
                    <ToastContainer />
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

RoomTable.propTypes = {
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
